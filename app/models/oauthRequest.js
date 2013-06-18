var App = require('app');

App.OauthRequest = Milo.Action.extend({
    uriTemplate: '/activate',
    verb: 'POST',

    grant_type: Milo.property('string'),
    username: Milo.property('string'),
    password: Milo.property('string'),
    client_id: Milo.property('string'),
    scope: Milo.property('string')
});

module.exports = App.OauthRequest;

/*
oauthRequest.accessToken({ username: xxx, password: pppp})
    .done(function (result) {

    })
    .fail(function (error) {

    })
*/