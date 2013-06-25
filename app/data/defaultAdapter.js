var App, config;
App = require('app');
config = require('config');

require('helpers');

App.HabitatApiAdapter = DS.Adapter.extend(App.KISSMetrics, {
    //bulkCommit: false,
    baseUri: config.API_HOST,
    serializer: App.DefaultSerializer,
    metaDataKey: '_metaData',
    noCacheFlags: [],

    find: function (store, type, id, query) {
        var that = this;

        this.ajax(this.buildRequestUri(type, query, id), null, 'GET', type)
            .done(function (data) {
                data[that.metaDataKey] = JSON.stringify(query);
                Em.run(that, function () {
                    this.didFindRecord(store, type, data, id);
                });
            })
            .fail(function (jqXHR, textStatus) {
                var reference, record;
                reference = store.load(type, id, { id: id });
                record = store.recordForReference(reference);
                record.hasErrors = true;
                Em.run.next(that, function () {
                    this.didRecordError(store, type, record, id, query, jqXHR);
                });
            });
    },

    findQuery: function (store, type, query, array) {
        var that = this;

        this.ajax(this.buildRequestUri(type, query, '', true), null, 'GET', type)
            .done(function (data) {
                var pageSize = query.pageSize || type.pageSize || 10,
                    pageCount = data.count ? (Math.ceil(data.count / pageSize)) : 0,
                    totalRecords = data.count,
                    showRecords = data.count - data.offset > pageSize ? pageSize : data.count - data.offset;

                data[that.metaDataKey] = JSON.stringify(query);
                Em.run(that, function () {
                    array.set('pageCount', pageCount);
                    array.set('totalRecords', totalRecords);
                    array.set('showRecords', showRecords);
                    this.didFindQuery(store, type, data, array);
                });
            })
            .fail(function (jqXHR, textStatus) {
                array.load([]);
                that.didArrayError(store, type, array, query, jqXHR);
            });
    },

    findAll: function (store, type) {
        return this.findQuery(store, type, {});
    },

    createRecord: function (store, type, record) {
        var that = this,
            json = this.serialize(record, { includeId: true }),
            metadata = record.get(this.metaDataKey);

        if (!record.get('isNew')) {
            record.set('isNew', true);
        }

        metadata = metadata ? JSON.parse(metadata) : null;
        json = type.prePost ? type.prePost(json) : json;

        that.setNoCacheFlag(type);
        //// TODO: There is a fix in Ember-data but it was not populated to the master branch
        if (type.toString().indexOf('Embedded') === -1) {
            this.ajax(this.buildRequestUri(type, metadata || record, record.id), json, 'POST', type)
                .done(function (data, textStatus, jqXHR) {
                    var location = jqXHR.getResponseHeader('Location');
                    that.didSaveRecord(store, type, record, data);
                    var typeAsString = type.toString();
                    var trackType = typeAsString.substring(0, 4) === 'App.' ? typeAsString.substring(4) : typeAsString;
                    that.track('Created ' + trackType, jQuery.extend({id: location}, metadata));
                })
                .fail(function (jqXHR, textStatus) {
                    that.didRecordError(store, type, record, null, null, jqXHR);
                });
        }
    },

    updateRecord: function (store, type, record) {
        var that = this,
            json = this.serialize(record, { includeId: false }),
            metadata = record.get(this.metaDataKey);

        if (record.get('isNew')) {
            record.set('isNew', false);
        }

        metadata = metadata ? JSON.parse(metadata) : null;
        json = type.prePut ? type.prePut(json) : json;

        that.setNoCacheFlag(type);
        if (type.toString().indexOf('Embedded') === -1) {
            this.ajax(this.buildRequestUri(type, metadata || record, record.id), json, 'PUT', type)
                .done(function (data) {
                    that.didSaveRecord(store, type, record, data);
                    var typeAsString = type.toString();
                    var trackType = typeAsString.substring(0, 4) === 'App.' ? typeAsString.substring(4) : typeAsString;
                    that.track('Updated ' + trackType, jQuery.extend({id: record.id}, metadata));
                })
                .fail(function (jqXHR, textStatus) {
                    that.didRecordError(store, type, record, null, null, jqXHR);
                });
        }
    },

    deleteRecord: function (store, type, record) {
        var that = this, metadata = record.get(this.metaDataKey);
        that.setNoCacheFlag(type);
        Em.run.later(function () {
            metadata = metadata ? JSON.parse(metadata) : null;
            that.ajax(that.buildRequestUri(type, metadata || record, record.id), '', 'DELETE', type)
                .done(function (data) {
                    that.didSaveRecord(store, type, record, data);
                    var typeAsString = type.toString();
                    var trackType = typeAsString.substring(0, 4) === 'App.' ? typeAsString.substring(4) : typeAsString;
                    that.track('Deleted ' + trackType, jQuery.extend({id: record.id}, metadata));
                })
                .fail(function (jqXHR, textStatus) {
                    that.didRecordError(store, type, record, record.id, null, jqXHR);
                });
        }, 1000);
    },

    extractError: function (type, id, query, jqXHR) {
        return Em.Object.create({
            type: type,
            query: query,
            id: id,
            message: jqXHR.responseText,
            status: jqXHR.status,
            statusText: jqXHR.statusText
        });
    },

    didArrayError: function (store, type, array, query, jqXHR) {
        var errors = Em.A();
        errors.push(this.extractError(type, null, query, jqXHR));
        array.set('errors', errors);
    },

    didRecordError: function (store, type, record, id, query, jqXHR) {
        var errors = [];
        errors.push(this.extractError(type, id, query, jqXHR));
        store.recordWasInvalid(record, errors);
    },

    buildRequestUri: function (type, query, id, paged) {
        var limit, offset, pagination, url;
        query = query || {};
        limit = query.pageSize || type.pageSize || 10;
        offset = !query.page ? 0 : (query.page - 1) * limit,
        pagination = paged ? 'limit=%@&offset=%@'.fmt(limit, offset) : '',
        url = this.baseUri + type.buildUrl(query, id);

        url = url.indexOf('?') > 0 ? url + '&' : url + '?';

        return url + pagination;
    },

    ajax: function (url, data, method, type) {
        var cacheFlag = (method || 'GET') === 'GET' ? this.calculateCacheFlag(type) : true;

        if (type.noCache === false) {
            cacheFlag = false;
        }

        return App.helpers.ajax(url, data, method, cacheFlag);
    },

    calculateCacheFlag: function (type) {
        var typeName = type.toString(),
            index = this.noCacheFlags.indexOf(typeName);

        if (index === -1) {
            return true;
        } else {
            this.noCacheFlags.removeAt(index);
            return false;
        }
    },

    setNoCacheFlag: function (type) {
        var typeName = type.toString();

        if (type.invalidatesCache && type.invalidatesCache.length) {
            type.invalidatesCache.forEach(function (typeName) {
                if (this.noCacheFlags.indexOf(typeName) === -1 && typeName.indexOf('Embedded') === -1) {
                    this.noCacheFlags.push(typeName);
                }
            }, this);
        }

        if (this.noCacheFlags.indexOf(typeName) === -1 && typeName.indexOf('Embedded') === -1) {
            this.noCacheFlags.push(typeName);
        }
    }
});

App.HabitatApiAdapter.reopenClass({
    clearCacheForType: function (type, force) {
        var store = DS.defaultStore,
            toDematerialize = [];

        for (var clientId in store.clientIdToType) {
            if (store.clientIdToType[clientId] === type) {
                toDematerialize.push(store.recordCache[clientId]);
            }
        }

        toDematerialize.forEach(function (record) {
            if ((record && record.get('id')) || force) {
                store.dematerializeRecord(record);
            }
        });
    },

    commit: function () {
        DS.defaultStore.commit();
    },

    rollback: function () {
        DS.defaultStore.defaultTransaction.rollback();
    }
});
