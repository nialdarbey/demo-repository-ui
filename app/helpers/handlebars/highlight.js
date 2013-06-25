var App = require('app');

Em.Handlebars.registerBoundHelper('highlight', function (item, options) {
    var query = options.hash.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');

    var a = item.get('name').replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<span class="search-match">' + match + '</span>';
    });

    return new Em.Handlebars.SafeString(a);
});