var App = require('app');

Em.Handlebars.registerBoundHelper('tendencyRenderer', function (stat) {
    if (stat.tendency === 0) {
        return new Em.Handlebars.SafeString('<span class="tendency neutral">No Change</span>');
    }

    var cssClass, tendencyArrow;
    if (stat.improved) {
        cssClass = 'tendency positive';
        tendencyArrow = stat.tendency > 0 ? '&uarr;' : '&darr;';
    } else {
        cssClass = 'tendency negative';
        tendencyArrow = stat.tendency < 0 ? '&darr;' : '&uarr;';
    }

    return new Em.Handlebars.SafeString('<span class="%@">%@ %@%</span>'.fmt(cssClass, tendencyArrow, Math.abs(stat.tendency)));
});