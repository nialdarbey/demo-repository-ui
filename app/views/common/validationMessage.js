var App = require('app');

App.ValidationMessageView = App.BaseView.extend({
    templateName: require('templates/common/validationMessage'),
    field: null,
    classNames: ['validation-message-popover', 'popover'],

    setUp: function () {
        var field = this.get('field'),
            currentElement = this.$(),
            fieldElement;

        if (field) {
            fieldElement = field.$();
            fieldElement.on('change', function () {
                if (fieldElement.is(':invalid')) {
                    currentElement.addClass('show');
                } else {
                    currentElement.removeClass('show');
                }
            });
        }
    }.observes('field')
});
