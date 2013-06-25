var App = require('app');

App.IndexRoute = Em.Route.extend({
    model: function () {
     	return ['this', 'is', 'a', 'test'];
    },
    renderTemplate: function () {
        // var model = [{ name: 'Michael Jackson', songs: [{ name: 'Billie Jean' }, { name: 'Thriller'}] }],
        //     controller = Em.ArrayController.create({ content: model });

        // this.render('index', { controller: controller, outlet: 'content' });
        this.render('index');
    }
});

module.exports = App.IndexRoute;