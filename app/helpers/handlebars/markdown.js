var App = require('app');

Em.Handlebars.registerBoundHelper('markdown', function (value, options) {
    var escaped = Em.Handlebars.Utils.escapeExpression(value);
    /*jshint undef:false */
    var converter = new Showdown.converter();
    /*jshint undef:true */
    return new Em.Handlebars.SafeString(converter.makeHtml(escaped));
});