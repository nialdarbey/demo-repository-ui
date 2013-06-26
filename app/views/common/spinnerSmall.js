var App = require('app');

App.SpinnerSmallView = App.BaseView.extend({
    templateName: require('templates/common/spinnerSmall'),
    loadingMessage: 'Loading...',
    showMessage: true
});