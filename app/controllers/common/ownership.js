var App = require('app');

App.OwnershipController = Em.ObjectController.extend({
    owner: Em.Object.create(),

    owners: function () {
        var context = this.get('content'),
            query = context.get('query'),
            ownerType = context.get('ownerType');

        return ownerType.where(query).findMany();
    }.property('content', 'onReload'),

    createOwnerRecord: function () {
        var context = this.get('content'),
            ownerType = context.get('ownerType');

        if (this.get('scope') === 'service') {
            return ownerType.create({
                serviceId: App.get('globals.service.id')
            });
        } else {
            return ownerType.create({
                consumerId: App.get('globals.consumer.id')
            });
        }
    },

    reload: function () {
        this.set('onReload', App.helpers.generateGuid());
        if (this.get('scope') === 'consumer') {
            App.set('globals.consumer', Api.Consumer.where({
                id: App.get('globals.consumer.id')
            }).findOne());
        } else {
            App.set('globals.service', Api.Service.where({
                id: App.get('globals.service.id')
            }).findOne());
        }
    },

    isLastOwner: function () {
        return this.get('owners.length') === 1 && this.get('content.type') === 'owners';
    }.property('owners.length'),

    addOwner: function (event) {
        var owner = this.createOwnerRecord();

        owner.set('username', this.get('owner.username'));
        this.set('newRecord', owner);

        owner.save().done(function () {
            this.reload();
            this.clear();
        }.bind(this)).fail(function (record) {
            // this.set('errors', App.helpers.extractErrorsFromRecords(record));
            // App.HabitatApiAdapter.rollback();
        });
    },

    removeRecord: function (owner) {
        owner.set('serviceId', App.get('globals.service.id'));

        owner.remove().done(function () {
            this.reload();
            this.clear();
        }.bind(this)).fail(function (record) {
            // this.set('errors', App.helpers.extractErrorsFromRecords(record));
            // App.HabitatApiAdapter.rollback();
        });
    },

    clear: function () {
        this.set('owner', Em.Object.create());
        this.set('errors', null);
    }
});