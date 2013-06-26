var App = require('app');

App.UserDetailsView = App.BaseView.extend({
    templateName: require('templates/common/userDetails'),
    prefixMessage: '',
    placement: 'top',
    user: null,
    classNames: ['user-info-container'],
    showPopover: false,

    init: function () {
        this._super();
        this.set('controller', App.UserDetailsController.create());
    },

    click: function (event) {
        var target = event.target,
            targetRel = target.getAttribute('rel');

        if (targetRel !== 'no-close') {
            this.set('showPopover', false);
        }

        return false;
    },

    togglePopover: function () {
        if (!this.get('showPopover')) {
            this.hideAllPopovers();
        }
        this.set('showPopover', !this.get('showPopover'));
        return false;
    },

    hideAllPopovers: function () {
        var popups = $('.user-info-popover');
        popups.click();
    },

    loadUserDetails: function () {
        if (this.get('showPopover')) {
            this.controller.loadUserDetails(this.get('user.username'));
        }
    }.observes('showPopover'),

    toggleVisibility: function () {
        if (this.get('showPopover')) {
            this.$().find('.user-info-popover').fadeIn();
        } else {
            this.$().find('.user-info-popover').fadeOut();
        }
    }.observes('showPopover')
});