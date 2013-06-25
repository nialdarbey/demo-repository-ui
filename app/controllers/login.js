var App = require('app');

App.LoginController = Em.ObjectController.extend({
    content: null,
    status: null,
    doLogin: function () {
        var username = this.get('content.username'),
            password = this.get('content.password'),
            that = this;

        this.set('content.authenticating', true);
        this.set('content.errorMessage', '');
        App.authProvider.authenticateUser(this, username, password)
            .done(function (token) {
                App.authProvider.populateCurrentUser()
                    .done(function () {
                        window.location.href = '#/' + that.get('content.returnUri');
                    })
                    .fail(function (error) {
                        that.set('errors', [{ message: error }]);
                        that.set('content.authenticating', false);
                        that.set('content.password', '');
                    });
            })
            .fail(function (error) {
                that.set('errors', [{ message: error }]);
                that.set('content.authenticating', false);
                that.set('content.password', '');
            });
    }
});


module.exports = App.LoginController;