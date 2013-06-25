var App = require('app');

App.Sortable = Em.Mixin.create({
    sort: function (field, order) {
        order = order === 1 ? 'asc' : 'desc';

        if (order === 'desc') {
            this.set('content', this.get('content.query').orderByDescending(field).findMany());
        } else {
            this.set('content', this.get('content.query').orderBy(field).findMany());
        }
    },
    disableSort: function () {
        delete this.get('content.query').orderByClause;

        this.set('content', this.get('content.query').findMany());
    }
});