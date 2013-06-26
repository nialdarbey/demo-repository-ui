var App = require('app');

App.ButtonConfirmationView = App.BaseView.extend({
    attributeBindings: ['methodName'],
    methodName: 'deleteRecord',
    templateName: require('templates/common/buttonConfirmation'),
    tagName: 'span',
    classNames: ['action'],
    record: null,
    actionName: 'Delete',
    modelName: '',
    title: 'Are you sure?',
    placement: 'top',
    buttonClassNames: 'btn btn-block btn-small btn-danger',
    confirmationButtonClassNames: 'btn btn-small btn-danger',

    click: function () {
        $('#' + this.get('element').id + ' span:first-child').tooltip('hide');
    },

    onConfirm: function (event) {
        this.controller[this.get('methodName')](this.get('record'));
        this.$('a[rel="popover"]').popover('hide');
    },

    hide: function () {
        this.$('a[rel="popover"]').popover('hide');
    },

    didInsertElement: function () {
        $('[rel=popover]').popover();
    }
});

