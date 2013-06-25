var App = require('app');
require('views/base');
require('views/common/alert');
require('controllers/common/alert');

App.ErrorListener = Em.Mixin.create({
    errorListenerRumble: false,
    errorListenerAutoClose: false,
    errorListenerDisplayInCurrentView: false,
    errorListenerTitle: 'Announcement',
    errorListenerOutletName: 'notifications',
    errorListenerErrorProperty: '',
    errorListenerPropertyIsGlobal: false,
    errorListenerClassNames: ['alert-message'],

    init: function () {
        this._super();
        if (this.get('errorListenerPropertyIsGlobal')) {
            Em.addObserver(App.globals, this.get('errorListenerErrorProperty'), this, 'fireErrorEvent');
        } else {
            Em.addObserver(this, this.get('errorListenerErrorProperty'), this, 'fireErrorEvent');
        }
    },
    fireErrorEvent: function () {
        var errorEvent = this.get('error'),
            property = this.get('errorListenerErrorProperty'),
            err = this.get('errorListenerPropertyIsGlobal') ? App.globals.get(property) : this.get(property);

        if (err && Em.typeOf(errorEvent) === 'function') {
            errorEvent.bind(this)(Em.isArray(err) ? err[0] : err);
        } else {
            this.defaultError(Em.isArray(err) ? err[0] : err);
        }
    },
    defaultError: function (err) {
        if (err) {
            err = App.helpers.isValidJSON(err.message) ?
                JSON.parse(err.message) :
                (this.isServiceUnavailable(err) ? {
                    message: 'We are currently experiencing some technical difficulties. Please be patient with us ;)'
                } : err);

            if (!this.isServiceUnavailable(err)) {
                this.get('errorListenerClassNames').pushObject('error');
            }

            App.AlertView.popup(
                err.message || err.statusText,
                this.get('errorListenerTitle'),
                this.get('errorListenerRumble'),
                this.get('errorListenerAutoClose'),
                this.get('errorListenerDisplayInCurrentView') ? this.get('controller') : null,
                this.get('errorListenerOutletName'),
                this.get('errorListenerClassNames'));
        }
    },
    isServiceUnavailable: function (err) {
        return err && (err.status === 503 || err.statusText === 'error');
    },
    willDestroy: function () {
        this._super();
    }
});

App.ArrayControllerErrorListener = Em.Mixin.create(App.ErrorListener, {
    errorListenerErrorProperty: 'controller.content.errors'
});

App.ObjectControllerErrorListener = Em.Mixin.create(App.ErrorListener, {
    errorListenerErrorProperty: 'controller.content.errors'
});
