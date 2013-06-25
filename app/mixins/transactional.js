var App = require('app');

App.Transactional = Em.Mixin.create({
    commit: function () {
        // TO BE IMPLEMENTED
    },

    rollback: function () {
        if (this.get('content.isDirty')) {
            this.get('content').rollback();
        }

        if (this.get('content.errors') !== null && this.get('content.errors') !== undefined) {
            this.get('content').set('errors', null);
        }
    }
});
