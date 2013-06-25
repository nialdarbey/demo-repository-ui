var App, config, coerceId, Ember = Em, LOADING = 'loading';
App = require('app');
config = require('config');

require('helpers');
require('models');
require('data/defaultAdapter');
require('data/defaultSerializer');

coerceId = function (id) {
    return id === null ? null : id + '';
};

App.Store = DS.Store.extend({
    revision: 11,
    adapter: App.HabitatApiAdapter,
    metaDataKey: '_metaData',

    find: function (type, id, query) {
        if (id === undefined) {
            return this.findAll(type);
        }
        // We are passed a query instead of an id.
        if (Ember.typeOf(id) === 'object') {
            return this.findQuery(type, id);
        }
        return this.findById(type, coerceId(id), query);
    },
    findById: function (type, id, query) {
        var clientId = this.typeMapFor(type).idToCid[id];
        if (clientId) {
            return this.findByClientId(type, clientId);
        }
        clientId = this.pushData(LOADING, id, type);
        // create a new instance of the model type in the
        // 'isLoading' state
        var record = this.materializeRecord(type, clientId, id);
        // let the adapter set the data, possibly async
        var adapter = this.adapterForType(type);
        if (adapter && adapter.find) { adapter.find(this, type, id, query); }
        else { throw 'Adapter is either null or does not implement `find` method'; }
        return record;
    },
    reloadRecord: function (record) {
        var metadata = record.get(this.metaDataKey),
            type = record.constructor,
            adapter = this.adapterForType(type);

        if (!record.get('isReloading')) {
            metadata = metadata ? JSON.parse(metadata) : null;

            if (adapter && adapter.find) {
                adapter.find(this, type, record.id, metadata);

                record.set('isLoaded', true);
                record.set('isReloading', false);
            } else {
                throw 'Adapter is either null or does not implement `find` method';
            }
        }
    }
});

if (!config.USE_MOCKS) {
    App.HabitatApiAdapter.map(App.Contract, {
        service: { embedded: 'always' },
        serviceVersion: { embedded: 'always' },
        consumer: { embedded: 'always' },
        consumerVersion: { embedded: 'always' },
        serviceLevelAgreement: { embedded: 'always' },
        createdFromTier: { embedded: 'always' },
        createdBy: { embedded: 'load' },
        lastUpdatedBy: { embedded: 'load' }
    });

    App.HabitatApiAdapter.map(App.Service, {
        createdBy: { embedded: 'load' },
        lastUpdatedBy: { embedded: 'load' },
        taxonomies: { embedded: 'load' },
        lastVersion: { embedded: 'always' }
    });

    App.HabitatApiAdapter.map(App.ServiceHeader, {
        createdBy: { embedded: 'load' },
        lastUpdatedBy: { embedded: 'load' },
        lastVersion: { embedded: 'always' }
    });

    App.HabitatApiAdapter.map(App.Consumer, {
        createdBy: { embedded: 'load' },
        lastUpdatedBy: { embedded: 'load' },
        taxonomies: { embedded: 'load' }
    });

    App.HabitatApiAdapter.map(App.ConsumerHeader, {
        createdBy: { embedded: 'load' },
        lastUpdatedBy: { embedded: 'load' },
        lastVersion: { embedded: 'always' }
    });

    App.HabitatApiAdapter.map(App.Version, {
        createdBy: { embedded: 'load' },
        lastUpdatedBy: { embedded: 'load' }
    });

    App.HabitatApiAdapter.map(App.VersionHeader, {
        createdBy: { embedded: 'load' },
        lastUpdatedBy: { embedded: 'load' },
        characteristics: { embedded: 'load' }
    });

    App.HabitatApiAdapter.map(App.ServiceVersion, {
        createdBy: { embedded: 'load' },
        lastUpdatedBy: { embedded: 'load' },
        characteristics: { embedded: 'load' }
    });

    App.HabitatApiAdapter.map(App.ConsumerVersion, {
        createdBy: { embedded: 'load' },
        lastUpdatedBy: { embedded: 'load' },
        environment: { embedded: 'always' }
    });

    App.HabitatApiAdapter.map(App.SlaTier, {
        serviceLevelAgreement: { embedded: 'load' },
        createdBy: { embedded: 'load' },
        lastUpdatedBy: { embedded: 'load' }
    });

    App.HabitatApiAdapter.map(App.Policy, {
        configuration: { embedded: 'load' },
        createdBy: { embedded: 'load' },
        lastUpdatedBy: { embedded: 'load' }
    });

    App.HabitatApiAdapter.map(App.GlobalPolicy, {
        configuration: { embedded: 'always' },
        createdBy: { embedded: 'always' },
        lastUpdatedBy: { embedded: 'always' }
    });

    App.HabitatApiAdapter.map(App.Endpoint, {
        metadata: { embedded: 'load' },
        environment: { embedded: 'load' }
    });

    App.HabitatApiAdapter.map(App.EmbeddedService, {
        version: { embedded: 'always' }
    });

    App.HabitatApiAdapter.map(App.EmbeddedConsumer, {
        version: { embedded: 'always' }
    });

    App.HabitatApiAdapter.map(App.AgentTokenHeader, {
        createdBy: { embedded: 'load' }
    });

    App.HabitatApiAdapter.map(App.AgentToken, {
        createdBy: { embedded: 'load' },
        lastSeenBy: { embedded: 'load' }
    });

    App.HabitatApiAdapter.map(App.TierConsume, {
        version: { embedded: 'always' }
    });

    App.HabitatApiAdapter.map(App.Taxonomy, {
        nodes: { embedded: 'always' }
    });

    App.HabitatApiAdapter.map(App.TaxonomyRootNode, {
        nodes: { embedded: 'always' }
    });

    App.HabitatApiAdapter.map(App.TaxonomyNode, {
        nodes: { embedded: 'always' }
    });

    App.HabitatApiAdapter.map(App.EmbeddedTaxonomyNode, {
        nodes: { embedded: 'always' }
    });

    App.HabitatApiAdapter.map(App.ServiceHeader, {
        createdBy: { embedded: 'load' },
        lastUpdatedBy: { embedded: 'load' },
        lastVersion: { embedded: 'always' }
    });

    App.HabitatApiAdapter.map(App.TaxonomyBrowsedService, {
        createdBy: { embedded: 'load' },
        lastUpdatedBy: { embedded: 'load' },
        lastVersion: { embedded: 'always' }
    });

    App.HabitatApiAdapter.map(App.TaxonomyBrowsedConsumer, {
        createdBy: { embedded: 'load' },
        lastUpdatedBy: { embedded: 'load' }
    });

    App.HabitatApiAdapter.map(App.Review, {
        createdBy: { embedded: 'load' },
        lastUpdatedBy: { embedded: 'load' }
    });

    App.HabitatApiAdapter.map(App.ServiceStats, {
        service: { embedded: 'load' },
        stats: { embedded: 'load' }
    });

    App.HabitatApiAdapter.map(App.ConsumerStats, {
        consumer: { embedded: 'load' },
        stats: { embedded: 'load' }
    });
}
