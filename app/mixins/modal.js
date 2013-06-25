var App = require('app'),
    get = Em.get,
    modalPaneBackdrop = '<div class="%@"></div>';

require('helpers');

App.Modal = Em.Mixin.create({
    classNames: ['modal'],
    useBackdrop: true,
    useTransitions: true,
    backdropClassName: 'modal-backdrop',
    _backdrop: null,

    didInsertElement: function () {
        this._super();
        if (this.get('useBackdrop')) {
            this._appendBackdrop();
        }
        if (this.get('useTransitions')) {
            this.$().hide().show('fast');
        }
    },

    willDestroyElement: function () {
        this._super();

        if (this.get('controller').rollback) {
            this.get('controller').rollback();
        }

        if (this.get('useBackdrop')) {
            this._backdrop.remove();
        }
    },

    _appendBackdrop: function () {
        var parentLayer = this.$().parent();
        this._backdrop = $(modalPaneBackdrop.fmt(this.backdropClassName)).appendTo(parentLayer);
        this._backdrop.css('z-index', this.$().css('z-index') - 5);
    },

    _hide: function (options, event) {
        var that = this;
        if (this.get('useTransitions')) {
            this.$().hide('fast', function () {
                that._triggerCallbackAndDestroy(options, event);
            });
        } else {
            that._triggerCallbackAndDestroy(options, event);
        }
    },

    _triggerCallbackAndDestroy: function (options, event) {
        var destroy;
        if (this.callback) {
            destroy = this.callback(options, event);
        }
        if (destroy === undefined || destroy) {
            this.destroy();
        }
    }
});