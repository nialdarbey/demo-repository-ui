Em.Handlebars.registerBoundHelper('breaklines', function (text) {
    text = Em.Handlebars.Utils.escapeExpression(text);
    var nl2br = (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
    return new Em.Handlebars.SafeString(nl2br);
});
