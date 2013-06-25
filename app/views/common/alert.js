var App = require('app');

App.AlertView = App.BaseView.extend({
    templateName: require('templates/common/alert'),
    classNames: ['alert-message'],

    didInsertElement: function () {
        this._super();

        this.get('context.classNames').forEach(function (element) {
            this.$().addClass(element);
        }, this);

        this.$()
            .animate({ height : 60 }, 500);

        if (this.get('context.autoClose')) {
            Em.run.later(this, this._hide, 4000);
        }
    },

    stopRumble: function () {
        if (this.$()) {
            this.$().trigger('stopRumble');
        }
    },

    _hide: function (options, event) {
        var that = this,
            elem = this.$();

        if (elem) {
            elem.animate({height : 0}, 500, function () {
                that._triggerCallbackAndDestroy(options, event);
            });
        }
    },

    click: function (event) {
        var target = event.target,
            targetRel = target.getAttribute('rel');

        if (targetRel === 'close') {
            this._hide({ close: true }, event);
        }

        return false;
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

App.AlertView.reopenClass({
    popup: function (message, title, rumble, autoClose, controller, outletName, classNames) {
        var context = Em.Object.create({
            title: title === '' ? '' : (title  || 'Error!'),
            message: message,
            rumble: rumble,
            autoClose: autoClose,
            classNames: classNames
        });
        (controller || App.get('router.applicationController')).connectOutlet({
            outletName: outletName || 'notifications',
            name: 'alert',
            context: context
        });
    }
});
