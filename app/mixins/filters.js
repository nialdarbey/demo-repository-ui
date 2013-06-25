var App = require('app');

var Filter = Em.Object.extend({
    defaultFilter: false,
    isApplied: false,
    hasCounter: false,
    controller: null,
    counter: '-',

    init: function () {
        if (this.get('hasCounter')) {
            this.get('controller').addObserver(this.buildCounterPropertyName(), this, this.handleCounterChanged);
        }
    },

    buildCounterPropertyName: function () {
        return '%@-%@-counter'.fmt(this.get('filter').toLocaleLowerCase(), this.get('value').toLocaleLowerCase()).camelize();
    },

    handleCounterChanged: function () {
        var value = this.get('controller.%@'.fmt(this.buildCounterPropertyName()));
        if (value === null) {
            this.set('counter', '-');
        } else {
            this.set('counter', value);
        }
    },

    destroy: function () {
        if (this.get('hasCounter')) {
            this.get('controller').removeObserver(this.buildCounterPropertyName(), this);
        }
    }
});

App.Filters = Em.Mixin.create({
    filters: null,
    init: function () {
        this._super();

        var filters = this.get('filters');
        var activeFilter = {};
        var filtersDic = {};
        var that = this;

        /*jshint loopfunc:true */
        for (var prop in filters) {
            if (filters.hasOwnProperty(prop)) {
                var filterMethodName = 'filterBy' + prop.capitalize(),
                    removeFilterMethodName = 'remove' + prop.capitalize() + 'Filter';

                filters[prop] = filters[prop].map(function (criteria) {
                    criteria.filter = prop;
                    criteria.controller = this;
                    return Filter.create(criteria);
                }, this);

                filters[prop].forEach(function (criteria) {
                    if (!filtersDic[prop]) {
                        filtersDic[prop] = {};
                    }

                    filtersDic[prop][criteria.value] = criteria;
                });

                this[filterMethodName] = function (e) {
                    var query = {};

                    // if (e.context.filter) {
                    //     delete query[e.context.filter];
                    // }

                    if (e.context.value) {
                        query[e.context.filter] = e.context.value;
                    }
                    // query.page = 1;
                    // this.set('filterQuery', query);
                    // this.reload();
                    // this.set('currentPage', 1);

                    //this.set('content', this.get('content.query').where(query).findMany());
                    this.set('currentPage', 1);
                    this.reload(query);

                    if (activeFilter[e.context.filter]) {
                        activeFilter[e.context.filter].set('isApplied', false);
                        that.set('isFilterApplied', false);
                    }

                    activeFilter[e.context.filter] = filtersDic[e.context.filter][e.context.value];
                    // XXX Fix me hack
                    if (!filtersDic[e.context.filter][e.context.value]) {
                        filtersDic[e.context.filter][e.context.value] = filtersDic[e.context.filter]['null'];
                    }
                    filtersDic[e.context.filter][e.context.value].set('isApplied', true);
                    that.set('isFilterApplied', true);
                };

                this[removeFilterMethodName] = function (e) {
                    if (e && e.context && e.context.filter) {
                        //// Hack: It would be greate to have a 'Clear' method
                        var controller = this.constructor.toString().replace('App.', '').replace('Controller', '').dasherize().camelize();
                        delete App.get('globals.' + controller + 'Query')[e.context.filter];
                        delete this.get('content.query.anyClause')[e.context.filter];
                    }

                    this.reload(null, 1);
                    // var query = App.helpers.cloneEmObject(this.get('content.query'));

                    // if (e && e.context && e.context.filter) {
                    //     delete query[e.context.filter];
                    // }

                    // query.page = 1;
                    // this.set('content.query', query);
                    // this.reload();
                    // this.set('currentPage', 1);

                    if (filtersDic[e.context.filter][e.context.value]) {
                        filtersDic[e.context.filter][e.context.value].set('isApplied', false);

                        that.set('isFilterApplied', Object.keys(activeFilter).map(function (key) {
                            if (activeFilter[key]) {
                                return activeFilter[key].get('isApplied');
                            }
                        }).reduce(function (x, y) {
                            return x || y;
                        }));
                    }

                    if (activeFilter[e.context.filter]) {
                        activeFilter[e.context.filter] = null;
                    }
                };

            }
        }
        /*jshint loopfunc:false */
    },

    // TODO: move this to a new mixin
    isFilterOrSearchApplied: function () {
        return this.get('isFilterApplied') || this.get('searchApplied');
    }.property('isFilterApplied', 'searchApplied')
});