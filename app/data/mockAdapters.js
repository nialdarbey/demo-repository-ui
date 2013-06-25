var App, config;
App = require('app');
config = require('config');

require('helpers');
require('models');

App.MockAdapter = DS.Adapter.extend({
    records: [],
    pageCount: 1,
    delay: 2000,
    serializer: App.DefaultSerializer,

    find: function (store, type, id, query) {
        var records = this.get('records'),
            record;

        if (records && records.length) {
            record = JSON.parse(JSON.stringify(records.filter(function (item) { return item.id === id; })[0]));
            record.id = id;
            Em.run.later(this, function () {
                this.didFindRecord(store, type, record, id);
            }, this.delay);
        }
    },
    findQuery: function (store, type, query, array) {
        Em.run.later(this, function () {
            array.set('pageCount', this.get('pageCount'));
            this.didFindQuery(store, type, this.get('data'), array);
        }, this.delay);
    },
    findAll: function (store, type) {
    },
    createRecord: function (store, type, record) {
        console.log('App.MockAdapter.createRecord');
    },
    updateRecord: function (store, type, record) {
        console.log('App.MockAdapter.updateRecord');
        // record.set('didUpdate', true);
    },
    deleteRecord: function (store, type, record) {
        console.log('App.MockAdapter.deleteRecord');
        // record.set('isDeleted', true);
    }
});

// App.MockEnvironmentsAdapter = App.MockAdapter.extend({
//     records: [
//         { id: 'production', name: 'production' },
//         { id: 'qa', name: 'qa' },
//         { id: 'staging', name: 'staging' }
//     ],
//     data: function () {
//         return { environments: this.get('records') };
//     }.property()
// });

// App.Store.registerAdapter(App.Environment, App.MockEnvironmentsAdapter);

// App.MockServicesAdapter = App.MockAdapter.extend({
//     records: [
//         { id: 'Brew Coffee'.dasherize(), name: 'Brew Coffee', summary: 'Lorem ipsum dolor sit amet', tags: ['one', 'two'], taxonomies: [{ path: ['this', 'is', 'a', 'test'], taxonomy: 'test' }], createdBy: { firstName: 'Mateo', lastName: 'Almenta' }, lastUpdatedBy: { firstName: 'Robert', lastName: 'De Niro' }, description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.' },
//         { id: 'Weather'.dasherize(), name: 'Weather', summary: 'Lorem ipsum dolor sit amet', tags: ['one', 'two'], taxonomies: [{ path: ['this', 'is', 'a', 'test'], taxonomy: 'test' }], createdBy: { firstName: 'John', lastName: 'Rambo' }, lastUpdatedBy: { firstName: 'Robert', lastName: 'De Niro' }, description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.' },
//         { id: 'Shipment Tracking'.dasherize(), name: 'Shipment Tracking', summary: 'Lorem ipsum dolor sit amet', tags: ['one', 'two'], taxonomies: [{ path: ['this', 'is', 'a', 'test'], taxonomy: 'test' }], createdBy: { firstName: 'John', lastName: 'Rambo' }, lastUpdatedBy: { firstName: 'Robert', lastName: 'De Niro' }, description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.' },
//         { id: 'Units Converter'.dasherize(), name: 'Units Converter', summary: 'Lorem ipsum dolor sit amet', tags: ['one', 'two'], taxonomies: [{ path: ['this', 'is', 'a', 'test'], taxonomy: 'test' }], createdBy: { firstName: 'John', lastName: 'Rambo' }, lastUpdatedBy: { firstName: 'Robert', lastName: 'De Niro' }, description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.' }
//     ],
//     data: function () {
//         return { services: this.get('records') };
//     }.property()
// });

// App.MockVersionsAdapter = App.MockAdapter.extend({
//     records: [
//         { id: '1.1.0', major: 1, minor: 1, revision: '0', createdAt: '2013-01-14T22:50:50+0000', lastUpdated: '2013-01-14T22:50:50+0000' },
//         { id: '1.0.1', major: 1, minor: 0, revision: '1', createdAt: '2013-01-10T22:50:50+0000', lastUpdated: '2013-01-10T22:50:50+0000' },
//         { id: '1.0.0', major: 1, minor: 0, revision: '0', createdAt: '2013-01-09T22:50:50+0000', lastUpdated: '2013-01-09T22:50:50+0000' },
//         { id: '0.9.0pre', major: 0, minor: 9, revision: '0pre', createdAt: '2013-01-08T22:50:50+0000', lastUpdated: '2013-01-08T22:50:50+0000' }
//     ],
//     data: function () {
//         return { versions: this.get('records') };
//     }.property()
// });

// App.MockEndpointsAdapter = App.MockAdapter.extend({
//     records: [
//         { id: '1', tracked: true, uri: 'http://localhost:9000/', status: 'inactive', environment: 'development', createdAt: 0, lastUpdated: 0 },
//         { id: '2', tracked: false, uri: 'http://qa-server:9000/', status: 'active', environment: 'qa', createdAt: 0, lastUpdated: 0 },
//         { id: '3', tracked: true, uri: 'http://production:9000/', status: 'active', environment: 'production', createdAt: 0, lastUpdated: 0 }
//     ],
//     data: function () {
//         return { endpoints: this.get('records') };
//     }.property()
// });

// App.MockPoliciesAdapter = App.MockAdapter.extend({
//     records: [
//         { id: '1', template : { name: 'Basic HTTP Authentication', category: 'Security' }, createdAt: 0, lastUpdated: 0 },
//         { id: '2', template : { name: 'Throttling', category: 'Performance' }, createdAt: 0, lastUpdated: 0 }
//     ],
//     data: function () {
//         return { policies: this.get('records') };
//     }.property()
// });

// App.MockPolicyTemplatesAdapter = App.MockAdapter.extend({
//     records: [
//         { id: '1', name: 'Basic HTTP Authentication', createdAt: 0, lastUpdated: 0 },
//         { id: '2', name: 'Throttling', createdAt: 0, lastUpdated: 0 }
//     ],
//     data: function () {
//         return { policyTemplates: this.get('records') };
//     }.property()
// });

// App.MockConsumersAdapter = App.MockAdapter.extend({
//     records: [
//         { id: 'Windows Backup'.dasherize(), name: 'Windows Backup', summary: 'The best app for backing up your Windows OS', tags: ['Backup', 'Operation'], taxonomies: [{ path: ['Apps', 'Category', 'Life'], taxonomy: 'Life' }, { path: ['Apps', 'OS', 'Windows'], taxonomy: 'Windows' }], createdBy: { firstName: 'Mateo', lastName: 'Almenta' }, lastUpdatedBy: { firstName: 'Robert', lastName: 'De Niro' }, description: 'This is the best backup app ever. It backups all your Windows OS data, preferences, and more, by copying these information in a secured remote location.' },
//         { id: 'Sample Consumer 2'.dasherize(), name: 'Sample Consumer 2', summary: 'Lorem ipsum dolor sit amet', tags: ['one', 'two'], taxonomies: [{ path: ['Apps', 'Category', 'Business'], taxonomy: 'Business' }, { path: ['Apps', 'OS', 'Mac OS X'], taxonomy: 'Mac OS X' }], createdBy: { firstName: 'John', lastName: 'Rambo' }, lastUpdatedBy: { firstName: 'Robert', lastName: 'De Niro' }, description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.' }
//     ],
//     data: function () {
//         return { consumers: this.get('records') };
//     }.property()
// });

// App.MockConsumerVersionsAdapter = App.MockAdapter.extend({
//     records: [
//         { id: '2.1.0', major: 2, minor: 1, revision: '0', createdAt: '2013-01-13T22:50:50+0000', lastUpdated: '2013-01-14T22:50:50+0000' },
//         { id: '2.0.1', major: 2, minor: 0, revision: '1', createdAt: '2013-01-08T22:50:50+0000', lastUpdated: '2013-01-08T22:50:50+0000' }
//     ],
//     data: function () {
//         return { versions: this.get('records') };
//     }.property()
// });

// App.MockUsersAdapter = App.MockAdapter.extend({
//     records: [
//         { id: 'anypoint', username: 'anypoint', firstName: 'Anypoint', lastName: 'Service Registry', emailAddresses: ['anypoint@mulesoft.com'], organizationOwner: true },
//         { id: 'mateo', username: 'mateo', firstName: 'Mateo', lastName: 'Almenta', emailAddresses: ['mateo@mulesoft.com', 'mateo.almenta@mulesoft.com'], organizationOwner: true },
//         { id: 'emiliano', username: 'emiliano', firstName: 'Emiliano', lastName: 'Lesende', emailAddresses: ['emiliano.lesende@mulesoft.com'] },
//         { id: 'alberto', username: 'alberto', firstName: 'Alberto', lastName: 'Pose', emailAddresses: ['alberto.pose@mulesoft.com'] },
//         { id: 'evangelina', username: 'evangelina', firstName: 'Evangelina', lastName: 'Martinez', emailAddresses: ['evangelina.martinez@mulesoft.com'] },
//         { id: 'alejo', username: 'alejo', firstName: 'Alejo', lastName: 'Fernandez', emailAddresses: ['alejo.fernandez@mulesoft.com'] },
//         { id: 'carlos', username: 'carlos', firstName: 'Carlos', lastName: 'Latugaye', emailAddresses: ['carlos@code54.com', 'carlos.latugaye@gmail.com'] }
//     ],
//     data: function () {
//         return { users: this.get('records') };
//     }.property()
// });

// App.MockContractAdapter = App.MockAdapter.extend({
//     records: [
//         { id: '1', createdFromTier: { id: 'Silver'.dasherize(), name: 'Silver' }, service: { id: 'Brew Coffee'.dasherize(), name: 'Brew Coffee', summary: 'Lorem ipsum dolor sit amet', version: { id: '1.1.0', major: 1, minor: 1, revision: '0' } }, consumer: { id: 'Windows Backup'.dasherize(), name: 'Windows Backup (*)', summary: 'The best app for backing up your Windows OS', version: { id: '1.1.0', major: 1, minor: 1, revision: '0' } }, serviceLevelAgreement: { id: '1',  maximumRequests: 10, timePeriodInMilliseconds: 1000 } },
//         { id: '2', createdFromTier: { id: 'Gold'.dasherize(), name: 'Gold' }, service: { id: 'Units Converter'.dasherize(), name: 'Units Converter', summary: 'Lorem ipsum dolor sit amet', version: { id: '1.1.0', major: 1, minor: 1, revision: '0' } }, consumer: { id: 'Sample Consumer 2'.dasherize(), name: 'Sample Consumer 2 (*)', summary: 'Lorem ipsum dolor sit amet', version: { id: '1.1.0', major: 1, minor: 1, revision: '0' } }, serviceLevelAgreement: { id: '1',  maximumRequests: 10, timePeriodInMilliseconds: 60000 } }
//     ],
//     data: function () {
//         return { contracts: this.get('records') };
//     }.property()
// });

// App.MockSlaTierAdapter = App.MockAdapter.extend({
//     records: [
//         { id: 'silver', name: 'Silver', summary: 'Lorem ipsum dolor sit amet', serviceLevelAgreement: { id: '1',  maximumRequests: 10, timePeriodInMilliseconds: 1000 } },
//         { id: 'gold', name: 'Gold', summary: 'Lorem ipsum dolor sit amet', serviceLevelAgreement: { id: '1',  maximumRequests: 10, timePeriodInMilliseconds: 1000 } }
//     ],
//     data: function () {
//         return { tiers: this.get('records') };
//     }.property()
// });

// App.MockArtifactAdapter = App.MockAdapter.extend({
//     records: [
//         { id: 'test.png', name: 'test.png', size: 1345623, description: 'Lorem ipsum dolor sit amet', type: 'PNG image' },
//         { id: 'MuleSoft-Blueprint-LB-for-Availability.pdf', name: 'MuleSoft-Blueprint-LB-for-Availability.pdf', size: 312326713632, description: 'Lorem ipsum dolor sit amet', type: 'PNG image' },
//         { id: 'MuleError.docx', name: 'MuleError.docx', size: 345624, description: 'Lorem ipsum dolor sit amet', type: 'Word document' },
//         { id: 'Loan-calculator.xlsx', name: 'Loan-calculator.xlsx', size: 307, description: 'Lorem ipsum dolor sit amet', type: 'Excel spreadsheet' }
//     ],
//     data: function () {
//         return { artifacts: this.get('records') };
//     }.property()
// });

// App.MockRESTApiAdapter = App.MockAdapter.extend({
//     records: [
//         { id: '1', apiVersion: 'Mocked' }
//     ]
// });

// if (config.USE_MOCKS) {

//     App.MockContractAdapter.map(App.Contract, {
//         service: { embedded: 'always' },
//         consumer: { embedded: 'always' },
//         serviceLevelAgreement: { embedded: 'always' },
//         createdFromTier: { embedded: 'always' },
//         createdBy: { embedded: 'load' },
//         lastUpdatedBy: { embedded: 'load' }
//     });

//     App.MockServicesAdapter.map(App.Service, {
//         createdBy: { embedded: 'load' },
//         lastUpdatedBy: { embedded: 'load' },
//         taxonomies: { embedded: 'load' }
//     });

//     App.MockServicesAdapter.map(App.ServiceHeader, {
//         createdBy: { embedded: 'load' },
//         lastUpdatedBy: { embedded: 'load' }
//     });

//     App.MockConsumersAdapter.map(App.Consumer, {
//         createdBy: { embedded: 'load' },
//         lastUpdatedBy: { embedded: 'load' },
//         taxonomies: { embedded: 'load' }
//     });

//     App.MockConsumersAdapter.map(App.ConsumerHeader, {
//         createdBy: { embedded: 'load' },
//         lastUpdatedBy: { embedded: 'load' }
//     });

//     App.MockVersionsAdapter.map(App.Version, {
//         createdBy: { embedded: 'load' },
//         lastUpdatedBy: { embedded: 'load' }
//     });

//     App.MockConsumerVersionsAdapter.map(App.ConsumerVersion, {
//         createdBy: { embedded: 'load' },
//         lastUpdatedBy: { embedded: 'load' }
//     });

//     App.MockSlaTierAdapter.map(App.SlaTier, {
//         serviceLevelAgreement: { embedded: 'always' },
//         createdBy: { embedded: 'load' },
//         lastUpdatedBy: { embedded: 'load' }
//     });

//     App.MockPoliciesAdapter.map(App.Policy, {
//         endpoints: { embedded: 'always' }
//     });

//     App.MockContractAdapter.map(App.EmbeddedService, {
//         version: { embedded: 'always' }
//     });

//     App.MockContractAdapter.map(App.EmbeddedConsumer, {
//         version: { embedded: 'always' }
//     });

//     App.Store.registerAdapter(App.EmbeddedTaxonomy, App.MockAdapter);
//     App.Store.registerAdapter(App.EmbeddedUser, App.MockAdapter);
//     App.Store.registerAdapter(App.EmbeddedService, App.MockAdapter);
//     App.Store.registerAdapter(App.EmbeddedConsumer, App.MockAdapter);
//     App.Store.registerAdapter(App.EmbeddedVersion, App.MockAdapter);
//     App.Store.registerAdapter(App.EmbeddedServiceLevelAgreement, App.MockAdapter);
//     App.Store.registerAdapter(App.EmbeddedPolicyTemplate, App.MockAdapter);
//     App.Store.registerAdapter(App.EmbeddedSlaTier, App.MockAdapter);
//     App.Store.registerAdapter(App.Service, App.MockServicesAdapter);
//     App.Store.registerAdapter(App.ServiceHeader, App.MockServicesAdapter);
//     App.Store.registerAdapter(App.Consumer, App.MockConsumersAdapter);
//     App.Store.registerAdapter(App.ConsumerHeader, App.MockConsumersAdapter);
//     App.Store.registerAdapter(App.Version, App.MockVersionsAdapter);
//     App.Store.registerAdapter(App.ConsumerVersion, App.MockConsumerVersionsAdapter);
//     App.Store.registerAdapter(App.Endpoint, App.MockEndpointsAdapter);
//     App.Store.registerAdapter(App.Policy, App.MockPoliciesAdapter);
//     App.Store.registerAdapter(App.PolicyTemplate, App.MockPolicyTemplatesAdapter);
//     App.Store.registerAdapter(App.RESTApi, App.MockRESTApiAdapter);
//     App.Store.registerAdapter(App.Contract, App.MockContractAdapter);
//     App.Store.registerAdapter(App.SlaTier, App.MockSlaTierAdapter);
//     App.Store.registerAdapter(App.User, App.MockUsersAdapter);
//     App.Store.registerAdapter(App.Artifact, App.MockArtifactAdapter);
// }

