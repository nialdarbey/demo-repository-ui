var App = require('app');

Em.Handlebars.registerBoundHelper('listRenderer', function (context, options) {
    if (context.allowMultiple) {
    // if (context.type === 'ipaddress') {
        return options.fn(this);
    }
});