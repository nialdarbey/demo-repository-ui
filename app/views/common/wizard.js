var App = require('app');
require('mixins');

App.WizardView = App.BaseView.extend(App.ErrorListener, App.Modal, App.KeyPressListener, {
    templateName: require('templates/common/wizard'),
    useTransitions: false,
    errorListenerOutletName: 'wizard-notifications',
    errorListenerErrorProperty: 'controller.errors',
    errorListenerDisplayInCurrentView: true,

    didInsertElement: function () {
        this.$().toggleClass('modal');
        this.$().toggleClass('wizard-modal');
        this._super();
    },

    keyPress: function (event) {
        if (event.keyCode === 27) {
            this.cancel();
        }
    },

    cancel: function () {
        App.ConfirmDialogView.confirm({
            title: 'Are you sure you want to close the wizard?',
            body: 'All the information will be lost.',
            okButtonEnabled: true,
            acceptCallback: jQuery.proxy(this.controller.cancel, this.controller)
        });
    },

    previous: function () {
        this.controller.previous();
    },

    next: function () {
        if (this.controller.get('currentView').save()) {
            this.controller.next();
        }
    },

    finish: function () {
        var currentView = this.controller.get('currentView'),
            isValid = currentView.save ? currentView.save() : true;

        if (isValid) {
            this.controller.finish();
        }
    }
});