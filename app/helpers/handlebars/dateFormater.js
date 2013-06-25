var App = require('app');

Em.Handlebars.registerBoundHelper('dateFormater', function (value) {
    return moment(value).calendar();
});