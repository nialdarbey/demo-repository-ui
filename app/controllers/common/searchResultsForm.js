var App = require('app');

App.SearchResultsFormController = Em.ObjectController.extend(App.KISSMetrics, {
    content: null,

    swapList: function (context) {
        if (App.get('SearchListView')) {
            this.connectOutlet({
                outletName: 'search-list',
                name: 'searchList',
                context: context
            });
        }
        else
        {
            this.disconnectOutlet('search-list');
        }

        return false;
    },

    /* Helper to log only the last change */
    trackIfNotChanged: (function () {
        var timer;

        return function (q, p) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }

            timer = setTimeout(function () {
                this.track(q, p);
            }.bind(this), 1000);
        };
    }()),

    showServicesResults: function (q, minLength, pageSize, callback) {
        this.trackIfNotChanged('Searched', {Query: q, Where: 'Services'});
        var source = Em.A(), that = this, promise;

        if (q.length >= minLength) {
            promise = Api.Service.where({ q: q }).paginate({ page: 1 }).findMany();

            this.set('content', promise);

            promise.done(function (results) {
                for (var i = 0; i < results.get('length'); i++) {
                    source.pushObjects(results.objectAt(i));
                }

                that.swapList({
                    name: 'Services',
                    items: source,
                    query: q,
                    showMoreResolver: function (query) {
                        if (App.get('globals.route') === 'ServicesIndex') {
                            App.router.servicesController.reload({ q: query }, 1);
                        } else {
                            App.set('globals.servicesQuery', { q: query });
                            App.router.send('showServices');
                        }

                        callback();
                    }
                });
            });
        }
    },

    showConsumersResults: function (q, minLength, pageSize, callback) {
        this.trackIfNotChanged('Searched', {Query: q, Where: 'Consumers'});
        var source = Em.A(), that = this, promise;

        if (q.length >= minLength) {
            promise = Api.Consumer.where({ q: q }).paginate({ page: 1 }).findMany();

            this.set('content', promise);

            promise.done(function (results) {
                for (var i = 0; i < results.get('length'); i++) {
                    source.pushObjects(results.objectAt(i));
                }

                that.swapList({
                    name: 'Consumers',
                    items: source,
                    query: q,
                    showMoreResolver: function (query) {
                        if (App.get('globals.route') === 'ConsumersIndex') {
                            App.router.consumersController.reload({ q: query }, 1);
                        } else {
                            App.set('globals.consumersQuery', { q: query });
                            App.router.send('showConsumers');
                        }

                        callback();
                    }
                });
            });
        }
    },

    showUsersResults: function (q, minLength, pageSize, callback) {
        this.trackIfNotChanged('Searched', {Query: q, Where: 'Users'});
        var source = Em.A(), that = this, promise;

        if (q.length >= minLength) {
            promise = Api.User.where({ q: q }).paginate({ page: 1 }).findMany();

            this.set('content', promise);

            promise.done(function (results) {
                for (var i = 0; i < results.get('length'); i++) {
                    source.pushObjects(Em.Object.create({
                        id: results.objectAt(i).get('id'),
                        name: results.objectAt(i).get('username')
                    }));
                }

                that.swapList({
                    name: 'Users',
                    items: source,
                    query: q,
                    showMoreResolver: function (query) {
                        if (App.get('globals.route') === 'UsersIndex') {
                            App.router.usersController.reload({ q: query }, 1);
                        } else {
                            App.set('globals.usersQuery', { q: query });
                            App.router.send('showUsers');
                        }

                        callback();
                    }
                });
            });
        }
    }
});
