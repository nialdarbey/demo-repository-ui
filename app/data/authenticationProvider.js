var App = require('app'),
    config = require('config');

require('helpers');
require('models');
require('data/sessionManager');

App.AuthetincationProvider = Em.Object.extend({
    /*jshint camelcase:false */
    authenticateUser: function (loginController, username, password) {
        var ACCESS_TOKEN_URL = config.API_HOST + config.AGENT_TOKEN_PATH,
            deferred = $.Deferred(),
            accessTokenParams = {
                'grant_type': 'password',
                'username': username,
                'password': password,
                'client_id': 'WEBUI',
                'scope': config.SCOPES.join(' ')
            },
            that = this,
            token;

        App.set('user', null);
        loginController.set('status', 'Validating credentials...');

        App.helpers.oauth20Ajax(ACCESS_TOKEN_URL, $.param(accessTokenParams))
            .done(function (data) {
                var accessToken = data.access_token;

                if (accessToken) {
                    token = that.parseToken(data);
                    that.setAccessToken(token);
                    deferred.resolve(token);
                } else {
                    deferred.reject(config.INVALID_CREDENTIALS_MSG);
                }

            })
            .fail(function (jqxhr, t) {
                if (t === 'timeout') {
                    deferred.reject(config.TIMEOUT_ERROR_MSG);
                } else if (jqxhr.status >= 500) {
                    deferred.reject(config.SERVICE_UNAVAILABLE_MSG);
                } else {
                    deferred.reject(config.INVALID_CREDENTIALS_MSG);
                }
            });

        return deferred.promise();
    },
    refreshToken: function () {
        var ACCESS_TOKEN_URL = config.API_HOST + config.AGENT_TOKEN_PATH,
            deferred = $.Deferred(),
            accessToken = this.getAccessToken(),
            refreshAccessTokenParams = {
                'grant_type': 'refresh_token',
                'refresh_token': '',
                'client_id': 'WEBUI',
                'scope': config.SCOPES.join(' ')
            },
            that = this,
            token;

        if (!accessToken) {
            Em.run.next(function () {
                deferred.reject(config.SERVICE_UNAVAILABLE_MSG);
            });
        } else {
            refreshAccessTokenParams.refresh_token = accessToken.refresh_token;

            App.helpers.oauth20Ajax(ACCESS_TOKEN_URL, $.param(refreshAccessTokenParams))
                .done(function (data) {
                    var accessToken = data.access_token;

                    if (accessToken) {
                        token = that.parseToken(data);
                        that.setAccessToken(token);
                        deferred.resolve(token);
                    } else {
                        deferred.reject(config.INVALID_CREDENTIALS_MSG);
                    }
                })
                .fail(function (jqxhr, t) {
                    if (t === 'timeout') {
                        deferred.reject(config.TIMEOUT_ERROR_MSG);
                    } else if (jqxhr.status >= 500) {
                        deferred.reject(config.SERVICE_UNAVAILABLE_MSG);
                    } else {
                        deferred.reject(config.INVALID_CREDENTIALS_MSG);
                    }
                });
        }

        return deferred.promise();
    },
    parseToken: function (data) {
        return {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            token_expiration: moment().add('seconds', data.expires_in - 25).valueOf()
        };
    },
    setupTokenRefresh: function () {
        var accessToken = this.getAccessToken(),
            tokenExpirationDelay;

        if (accessToken) {
            tokenExpirationDelay = moment(accessToken.token_expiration).subtract('seconds', 15).diff();
            if (tokenExpirationDelay > 0) {
                Em.run.later(this, this.onTokenRefresh, tokenExpirationDelay);
            }
        }
    },
    onTokenRefresh: function () {
        var lastActivity = this.getLastActivity(),
            inactivityPeriod = moment().diff(lastActivity);

        if (inactivityPeriod < config.MAX_INACTIVITY_PERIOD) {
            console.log('refreshing token');
            this.refreshToken()
                .fail(function () {
                    App.authProvider.expireToken();
                    App.set('globals.applicationError', Em.Object.create({ errors: [{ message: 'Session expired' }] }));
                });
        } else {
            App.authProvider.expireToken();
            App.set('globals.applicationError', Em.Object.create({ errors: [{ message: 'Session expired' }] }));
        }
    },
    revokeToken: function () {
        var REVOKE_ACCESS_TOKEN_URL = config.API_HOST + config.AGENT_TOKEN_REVOKE_PATH,
            deferred = $.Deferred(),
            accessToken = this.getAccessToken(),
            revokeAccessTokenParams = {
                'token': '',
                'client_id': 'WEBUI'
            };

        if (!accessToken) {
            Em.run.next(function () {
                deferred.reject(config.SERVICE_UNAVAILABLE_MSG);
            });
        } else {
            revokeAccessTokenParams.token = accessToken.access_token;
            App.helpers.oauth20Ajax(REVOKE_ACCESS_TOKEN_URL, $.param(revokeAccessTokenParams))
                .done(function (data) {
                    deferred.resolve();
                })
                .fail(function (jqxhr, t) {
                    if (t === 'timeout') {
                        deferred.reject(config.TIMEOUT_ERROR_MSG);
                    } else if (jqxhr.status >= 500) {
                        deferred.reject(config.SERVICE_UNAVAILABLE_MSG);
                    } else {
                        deferred.reject(config.INVALID_CREDENTIALS_MSG);
                    }
                });
        }

        return deferred.promise();
    },
    populateCurrentUser: function () {
        var CURRENT_USER_URL = config.API_HOST + config.CURRENT_USER_PATH,
            CURRENT_ORGANIZATION_URL = config.API_HOST + config.ORGANIZATION_PATH,
            deferred = $.Deferred(),
            user = this.getCurrentUser(),
            accessToken = this.getAccessToken(),
            that = this;

        if (!accessToken) {
            deferred.reject(config.SERVICE_UNAVAILABLE_MSG);
        } else if (user) {
            deferred.resolve(user);
        } else {
            App.helpers.ajax(CURRENT_USER_URL, '', 'GET', false)
                .done(function (data) {
                    user = App.SessionUser.create(data);
                    user.set('accessToken', accessToken.access_token);
                    App.helpers.ajax(CURRENT_ORGANIZATION_URL, '', 'GET', false)
                        .done(function (data) {
                            user.set('organization', data.name);
                            that.setCurrentUser(user);
                            deferred.resolve(user);
                        })
                        .fail(function () {
                            deferred.reject(config.SERVICE_UNAVAILABLE_MSG);
                        });
                })
                .fail(function () {
                    deferred.reject(config.SERVICE_UNAVAILABLE_MSG);
                });
        }

        return deferred.promise();
    },
    isAccessTokenExpired: function () {
        var accessToken = this.getAccessToken();

        if (!accessToken) {
            return true;
        }

        return accessToken.token_expiration < new Date().getTime();
    },
    expireToken: function () {
        var accessToken = this.getAccessToken();

        if (accessToken) {
            accessToken.token_expiration = 0;
            this.setAccessToken(accessToken);
        }
    },
    /*jshint camelcase:true */
    getCurrentUser: function () {
        return App.get('user');
    },
    setCurrentUser: function (user) {
        if (user) {
            App.set('user', user);
        } else {
            App.set('user', null);
        }
    },
    /*jshint camelcase:false */
    setAccessToken: function (token) {
        App.sessionManager.setItem('accessToken', token);

        if (token && token.token_expiration) {
            this.setupTokenRefresh();
        }
    },
    /*jshint camelcase:true */
    getAccessToken: function () {
        return App.sessionManager.getItem('accessToken');
    },
    setLastActivity: function (lastActivity) {
        lastActivity = lastActivity || new Date().getTime();
        App.sessionManager.setItem('lastActivity', lastActivity);
    },
    getLastActivity: function () {
        return App.sessionManager.getItem('lastActivity');
    },
});

App.authProvider = App.AuthetincationProvider.create();
