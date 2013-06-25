var App = require('app');

Em.Handlebars.registerBoundHelper('defaultRenderer', function (context, options) {
    if (!context.allowMultiple && context.type !== 'timeunit') {
        return options.fn(this);
    }
});