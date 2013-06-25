var App = require('app');

App.BaseView = Em.View.extend({
    didInsertElement: function () {
        $('[rel=tooltip]').tooltip();
        $('[rel=popover]').popover();
        $('[autofocus=true]').focus();

        // Select All when clicking on Code To Copy snippets (for instance:
        // to copy agent tokens)
        $('.code-to-copy').live('click', function (ev) {
            if (ev) {
                ev.preventDefault();
            }

            $(this).select();
            return false;
        });
    },

    showTooltips: function () {
        Em.run.later(this, function () {
            $('[rel=tooltip]').tooltip();
            $('[rel=popover]').popover();
        }, 100);
    }.observes('controller.content.isLoaded')
});

App.BaseView.reopenClass({
    popup: function (context, outletName, controller) {
        controller = controller || App.get('router.applicationController');
        controller.connectOutlet({
            outletName: outletName || 'popup',
            name: this.toString().replace('App.', '').replace('View', '').dasherize().camelize(), // HACK: it got to be a better way to obtain the class name
            context: context
        });
    },

    confirm: function (context, outletName, controller) {
        controller = controller || App.get('router.applicationController');
        controller.connectOutlet({
            outletName: outletName || 'popup',
            name: this.toString().replace('App.', '').replace('View', '').dasherize().camelize(), // HACK: it got to be a better way to obtain the class name
            context: context
        });
    },

    popupWithCustomController: function (targetController, outletName, controller) {
        controller = controller || App.get('router.applicationController');
        controller.connectOutlet({
            outletName: outletName || 'popup',
            viewClass: this,
            controller: targetController
        });
    }
});


module.exports = App.BaseView;