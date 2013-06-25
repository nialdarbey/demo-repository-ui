var App = require('app');
require('helpers');
require('views/base');
require('views/common/pager');
require('controllers/common/pager');

App.Paginable = Em.Mixin.create({
    currentPage: 1,

    totalPages: function () {
        return this.get('content.pageCount');
    }.property('content.pageCount'),

    totalRecords: function () {
        return this.get('content.totalRecords');
    }.property('content.totalRecords'),

    showRecords: function () {
        return this.get('content.showRecords');
    }.property('content.showRecords'),

    nextPage: function () {
        var query = this.get('content.query');
        if (this.get('currentPage') === this.get('totalPages')) {
            return null;
        }

        App.helpers.incrementProperty('currentPage', this);
        this.reload();
    },

    goToPage: function (page) {
        var query = this.get('content.query');
        if (page < 1 && page > this.get('pageCount')) {
            return null;
        }

        this.set('currentPage', page);
        this.reload();
    },

    previousPage: function () {
        var query = this.get('content.query');
        if (this.get('currentPage') === 1) {
            return null;
        }

        App.helpers.decrementProperty('currentPage', this);
        this.reload();
    },

    reload: function () {
    }
});