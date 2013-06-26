var App = require('app');

App.SearchListView = Em.View.extend({
    templateName: require('templates/common/searchList'),

    showMore: function () {
        //// TODO: Build Uri should be only creating the resource uri
        //// TODO: The Default adapter should be reading all query params

        this.get('controller.content.showMoreResolver')(this.get('controller.content.query'));
    },

    showDetails: function (e) {
        var entityName = this.get('controller.content.name'),
            detailsRouter = App['%@DetailsRoute'.fmt(entityName.singularize())],
            rootRouter = App['%@Route'.fmt(entityName)];

        //// HACK, users does not have details
        if (entityName === 'Users') {
            this.get('controller.content.showMoreResolver')(e.context.get('name'));
        } else {
            if (detailsRouter) {
                App.router.transitionTo(detailsRouter.routePath, e.context);
            } else {
                App.router.transitionTo(rootRouter.routePath);
            }
        }
    },

    didInsertElement: function () {
        $('.dropdown-menu.global-search').find('.search-results').find('li').first().addClass('active');
    }
});