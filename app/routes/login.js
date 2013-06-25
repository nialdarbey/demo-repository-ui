var App = require('app');

App.LoginRoute = Em.Route.extend({
    route: 'login/:returnUri',

    connectOutlets: function (router, context) {
        var applicationController = router.get('applicationController'),
            loginController = router.get('loginController'),
            announcements = Api.Announcement.findMany();

        applicationController.connectOutlet('popup', 'login', context);
        
        announcements.set('content', Em.A());
        loginController.connectOutlet('announcements', 'announcements', announcements);

        announcements.done(function () {
            context.set('hasAnnouncements', announcements.get('length'));
            announcements.set('moreThanOne', announcements.get('length') > 1);
        });
    }
});


module.exports = App.LoginRoute;