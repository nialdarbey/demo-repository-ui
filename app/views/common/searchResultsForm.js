var App = require('app');

App.SearchResultsFormView = Em.View.extend(App.Slider, {
    templateName: require('templates/common/searchResultsForm'),
    minLength: 3,
    pageSize: 5,

    isServices: function () {
        return App.get('globals.route').indexOf('Service') >= 0;
    }.property('query'),

    isApplications: function () {
        return App.get('globals.route').indexOf('Consumer') >= 0;
    }.property('query'),

    isUsers: function () {
        return App.get('globals.route').indexOf('User') >= 0;
    }.property('query'),

    didInsertElement: function () {
        $('[rel=tooltip]').tooltip();
    },

    queryChanged: function () {
        if (App.get('globals.route').indexOf('Service') >= 0) {
            this.showServicesResults();
        } else if (App.get('globals.route').indexOf('Consumer') >= 0) {
            this.showConsumersResults();
        } else if (App.get('globals.route').indexOf('User') >= 0) {
            this.showUsersResults();
        } else {
            this.showServicesResults();
        }
    }.observes('query'),

    hide: function () {
        $('.dropdown-menu.global-search').hide();
        $('.search-query.typeahead').removeClass('focused');
        $('.search-query.typeahead').val('');

//        this.destroy();
    },

    showServicesResults: function (e) {
        this.get('controller').showServicesResults(this.get('query'), this.get('minLength'), this.get('pageSize'), function () {
            this.hide();
        }.bind(this));

        if (e) {
            $(e.currentTarget).closest('ul').find('.selected').removeClass('selected');
            $(e.currentTarget).parent().addClass('selected');
        }

        return false;
    },

    showConsumersResults: function (e) {
        this.get('controller').showConsumersResults(this.get('query'), this.get('minLength'), this.get('pageSize'), function () {
            this.hide();
        }.bind(this));

        if (e) {
            $(e.currentTarget).closest('ul').find('.selected').removeClass('selected');
            $(e.currentTarget).parent().addClass('selected');
        }

        return false;
    },

    showUsersResults: function (e) {
        this.get('controller').showUsersResults(this.get('query'), this.get('minLength'), this.get('pageSize'), function () {
            this.hide();
        }.bind(this));

        if (e) {
            $(e.currentTarget).closest('ul').find('.selected').removeClass('selected');
            $(e.currentTarget).parent().addClass('selected');
        }

        return false;
    }
});