var App = require('app');

Em.Handlebars.registerBoundHelper('timeUnitRenderer', function (context, options) {
    if (!context.allowMultiple && context.type === 'timeunit') {
        return options.fn(this);
    }
});