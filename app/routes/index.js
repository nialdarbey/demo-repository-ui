var App = require('app');

App.IndexRoute = Em.Route.extend({
    model: function () {
     	return ['this', 'is', 'a', 'test'];
    }
});

module.exports = App.IndexRoute;