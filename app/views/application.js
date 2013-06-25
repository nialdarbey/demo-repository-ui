var App = require('app');

App.ApplicationView = App.BaseView.extend(App.ObjectControllerErrorListener, {
    errorListenerDisplayInCurrentView: true,
    errorListenerOutletName: 'content',
    errorListenerErrorProperty: 'applicationError',
    errorListenerPropertyIsGlobal: true,
    templateName: require('templates/application'),
    classNames: ['holder'],

    error: function (err) {
        var sessionExpired = App.authProvider.isAccessTokenExpired();

        if (err) {
            App.ConfirmDialogView.confirm({
                title: sessionExpired ? 'Session Expired' : 'Error',
                body: sessionExpired ? 'Your session has been expired due to inactivity, please log in again.' : err.message,
                okButtonEnabled: false,
                acceptCallback: sessionExpired ? this.logout : this.refresh
            });
        }
    },

    refresh: function () {
        window.location.reload();
    },

    logout: function () {
        App.get('router').transitionTo('root.logout');
    }
});
