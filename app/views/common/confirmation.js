var App = require('app');

App.ConfirmationView = App.BaseView.extend({
    templateName: require('templates/common/confirmation'),
    tagName: 'span',
    classNames: ['action'],
    record: null,
    actionName: 'Delete',
    modelName: '',
    title: 'Are you sure?',
    placement: 'top',
    buttonClassNames: 'btn btn-small btn-danger',
    iconClassNames: 'habitat-icon-trash icon-dark btn-delete',

    // TODO implement tooltip
    // TODO implement method name

    click: function () {
        $('#' + this.get('element').id + ' span:first-child').tooltip('hide');
    },

    onConfirm: function (event) {
        var methodName = this.actionName.dasherize().camelize() + 'Record';
        this.controller[methodName](this.get('record'));
        this.$('a[rel="popover"]').popover('hide');
    },

    hide: function () {
        this.$('a[rel="popover"]').popover('hide');
    },

    didInsertElement: function () {
        $('[rel=popover]').popover();
    }
});
