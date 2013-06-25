var App = require('app'),
    get = Em.get,
    modalPaneBackdrop = '<div class="login-background"></div>';

require('mixins');
require('mixins');

App.LoginView = App.BaseView.extend(App.KeyPressListener, App.ErrorListener, {
    templateName: require('templates/common/login'),
    classNames: ['modal', 'login'],
    errorListenerTitle: 'Announcement',
    errorListenerDisplayInCurrentView: true,
    errorListenerErrorProperty: 'controller.errors',
    errorListenerOutletName: 'notifications',
    errorListenerClassNames: ['alert-modal', 'login-alert-modal'],
    status: null,
    slideDownFinished: false,
    hasAnnouncements: function () {
        return this.get('slideDownFinished') &&
            this.get('controller.content.hasAnnouncements');
    }.property('controller.content.hasAnnouncements', 'slideDownFinished'),
    classNameBindings: ['hasAnnouncements:with-announcements'],

    didInsertElement: function () {
        var that = this;
        this.$('#email').focus();
        this._appendBackdrop();
        this.$().hide().slideDown('slow', function () {
            that.set('slideDownFinished', true);
        });
    },

    willDestroyElement: function () {
        this._backdrop.remove();
    },

    doLogin: function () {
        this.controller.doLogin();
    },

    keyPress: function (event) {
        if (event.keyCode === 13) {
            this.doLogin();
        }
    },

    closeModal: function () {
        if (App.get('user') && this.$()) {
            this._hide();
        }
    }.observes('App.user'),

    statusChanged: function () {
        this.set('status', this.get('controller.status'));
    }.observes('controller.status'),

    _appendBackdrop: function () {
        var parentLayer = this.$().parent();
        this._backdrop = $(modalPaneBackdrop).appendTo(parentLayer);
    },

    _hide: function (options, event) {
        var that = this;
        this.$().slideUp('slow', function () {
            that._triggerCallbackAndDestroy(options, event);
        });
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


module.exports = App.LoginView;