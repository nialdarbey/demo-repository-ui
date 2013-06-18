var App = require('app');

App.IndexView = Em.View.extend({
    tagName: 'span',
    didInsertElement: function () {
        $('#content').css('border', '1px solid black');
        console.log('view inserted into the DOM');
    }
});

module.exports = App.IndexView;