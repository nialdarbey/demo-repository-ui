var App = require('app');

Api.Auditable = Em.Mixin.create({
    createdAt: Milo.property('string', { operations: [] }),
    createdBy: Milo.property('Api.User', { operations: [] }),
    lastUpdated: Milo.property('string', { operations: [] }),
    lastUpdatedBy: Milo.property('Api.User', { operations: [] }),

    isCreator: function () {
        return App.authProvider.getCurrentUser().get('username') === this.get('createdBy.username');
    }.property('createdBy'),

    created: function () {
        return App.helpers.toTimeAgoString(this.get('createdAt'));
    }.property('createdAt'),

    updated: function () {
        return App.helpers.toTimeAgoString(this.get('lastUpdated'));
    }.property('lastUpdated')
});