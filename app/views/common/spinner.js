var App = require('app');

App.SpinnerView = App.BaseView.extend({
    templateName: require('templates/common/spinner'),
    classNames: ['pagination-centered'],
    loadingMessage: 'Loading...'
});
