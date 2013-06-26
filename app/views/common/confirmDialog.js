var App = require('app');

App.ConfirmDialogView = App.BaseView.extend(App.ErrorListener, App.KeyPressListener, App.Modal, {
    errorListenerClassNames: ['alert-modal'],
    errorListenerDisplayInCurrentView: true,
    templateName: require('templates/common/confirmDialog'),

    keyPress: function (event) {
        if (event.keyCode === 27 || event.keyCode === 110 || event.keyCode === 78) {
            this._hide();
        }

        if (event.keyCode === 121 || event.keyCode === 89) {
            this.accept();
        }

        return false;
    },

    click: function (event) {
        var target = event.target,
            targetRel = target.getAttribute('rel');

        if (targetRel === 'close') {
            this._hide();
        }

        return false;
    },

    accept: function () {
        var acceptCallback = this.get('controller.content').acceptCallback;
        if ('function' === typeof acceptCallback) {
            acceptCallback();
        }

        this._hide();
    }
});
