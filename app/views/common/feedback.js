var App = require('app'),
    config = require('config');

require('helpers');

App.FeedbackView = App.BaseView.extend({
    showPopover: false,
    placement: 'top',
    multiline: false,
    done: null,
    cancelLabel: 'Cancel',
    message: null,
    // XXX Timer is a hack to pretend that JSONP request can be aborted (it can't)
    timer: null,
    templateName: require('templates/common/feedback'),
    classNames: ['feedback-container'],
    sending: function () {
        return this.get('timer');
    }.property('timer'),
    pending: false,
    showCancel: function () {
        return !(this.get('done') || this.get('pending'));
    }.property('done', 'pending'),
    showSubmit: function () {
        return !(this.get('done') || this.get('timer') || this.get('pending'));
    }.property('done', 'timer', 'pending'),
    _hide: function () {
        this.set('showPopover', false);
    },
    cancel: function (event) {
        var timer = this.get('timer');

        // Sorry, point of no return, can't cancel/undo here
        if (this.get('pending')) {
            return;
        }

        if (timer) {
            Em.run.cancel(timer);
            this.set('timer', null);
            this.set('cancelLabel', 'Cancel');
        } else {
            this._hide();
        }
        return false;
    },
    submit: function (event) {
        var val = this.get('feedback.value');
        val = (val ? val.trim() : '');

        if (!val) {
            return;
        }

        if (!this.get('timer')) {
            this.set('cancelLabel', 'Undo');
            this.set('timer', Em.run.later(jQuery.proxy(function () {
                this._submit(val);
            }, this), 2000));
        }

        return false;
    },
    _submit: function (val) {
        this.set('pending', true);
        this.set('cancelLabel', 'Cancel');
        var name = App.get('user.name');
        var email = App.get('user.emailAddresses')[0];
            
        var data = {
            client: config.USERVOICE_KEY,
            ticket: {
                message: val,
                subject: 'New Policy Suggestion'
            },
            name: name,
            email: email
        };

        var request = jQuery.getJSON(
                'https://' + config.USERVOICE_SUBDOMAIN +
                '.uservoice.com/api/v1/tickets/create_via_jsonp.json?callback=?', data)
        .success(jQuery.proxy(function (data) {
            this.set('timer', null);
            this.set('done', true);
            this.set('pending', false);
            Em.run.later(jQuery.proxy(function () {
                this._hide();
            }, this), 2000);

        }, this)).error(function () {
            // TODO Check if parent controller has ErrorListener
            // TODO Send the error to the controller
            //this.set('parentView.controller.content.errors',
            //{message: 'Thanks for your feedback. We will review the new policy.'});
            this.set('timer', null);
            this.set('pending', false);
        });

    },
    
    keyUp: function (event) {
        if (event.keyCode === 27) {
            event.stopPropagation();
            this.set('showPopover', false);
            return false;
        }
    },
    
    togglePopover: function () {
        if (!this.get('showPopover')) {
            this.hideAllPopovers();
        }
        this.set('showPopover', !this.get('showPopover'));
        return false;
    },

    hideAllPopovers: function () {
        var popups = $('.feedback-popover');
        popups.click();
    },
    
    toggleVisibility: function () {
        var that = this,
            keyUpListener = jQuery.proxy(this.keyUp, this);
        if (this.get('showPopover')) {
            this.set('done', null);
            this.$().find('.feedback-popover').fadeIn(jQuery.proxy(function () {
                this.get('feedback').$().focus();
                this.$().on('keyup', keyUpListener);
            }, this));
        } else {
            this.$().off('keyup', keyUpListener);
            this.$().find('.feedback-popover').fadeOut();
        }
    }.observes('showPopover')

});

