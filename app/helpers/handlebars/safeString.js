var App = require('app');

Em.Handlebars.registerBoundHelper('safeString', function (value) {
    return new Em.Handlebars.SafeString(value);
});