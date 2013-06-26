var App = require('app');

App.PagerView = App.BaseView.extend({
    templateName: require('templates/common/pager'),
    classNames: ['habitat-pager'],
    numberOfPages: 7,
    controllerTotalPages: null,
    controllerCurrentPage: 1,
    pages: null,
    disablePrev: null,
    disableNext: null,

    loadPages: function () {
        var result = [],
            totalPages = this.get('controller.totalPages'),
            currentPage = this.get('controller.currentPage'),
            length = (totalPages >= this.get('numberOfPages')) ? this.get('numberOfPages') : totalPages,
            startPos;

        if (!totalPages) {
            return;
        }

        if (currentPage <= Math.floor(this.get('numberOfPages') / 2) + 1 || totalPages <= this.get('numberOfPages')) {
            startPos = 1;
        } else {
            // Check to see if in the last section of pages
            if (currentPage >= totalPages - (Math.ceil(this.get('numberOfPages') / 2) - 1)) {
                // Start pages so that the total number of pages is shown and the last page number is the last page
                startPos = totalPages - ((this.get('numberOfPages') - 1));
            } else {
                // Start pages so that current page is in the center
                startPos = currentPage - (Math.ceil(this.get('numberOfPages') / 2) - 1);
            }
        }

        /*jshint plusplus:false */
        for (var i = 0; i < length; i++) {
            result.push(i + startPos);
        }
        /*jshint plusplus:true */

        this.set('pages', result);
    }.observes('controllerTotalPages', 'controllerCurrentPage'),

    setCurrentPage: function () {
        var totalPages = this.get('controller.totalPages'),
            currentPage = this.get('controller.currentPage');

        if (this.get('controller.content.isLoaded')) {
            if (totalPages !== undefined && currentPage !== undefined) {
                this.set('controllerCurrentPage', currentPage);
            }
        }
    }.observes('controller.currentPage', 'controller.content.isLoaded'),

    setTotalPages: function () {
        var totalPages = this.get('controller.totalPages'),
            currentPage = this.get('controller.currentPage');

        if (this.get('controller.content.isLoaded')) {
            if (totalPages !== undefined && currentPage !== undefined) {
                this.set('controllerTotalPages', totalPages);
            }
        }

    }.observes('controller.totalPages', 'controller.content.isLoaded', 'controller.content.query'),

    hasPages: function () {
        var totalPages = this.get('controllerTotalPages') || this.get('controller.totalPages') || 0;
        // XXX Hack
        this.set('controllerTotalPages', totalPages);
        return totalPages > 1;
    }.property('controllerTotalPages'),

    showPageNumbers: function () {
        //return this.get('controllerTotalPages') > 2;
        return true;
    }.property('controllerTotalPages'),

    disablePrevActivator: function () {
        this.set('disablePrev', this.get('controllerCurrentPage') === 1 ? 'disabled' : '');
    }.observes('controllerCurrentPage', 'controllerTotalPages'),

    disableNextActivator: function () {
        this.set('disableNext',
                this.get('controllerCurrentPage') === this.get('controllerTotalPages') ?
            'disabled' : '');
    }.observes('controllerCurrentPage', 'controllerTotalPages'),

    prevPage: function (event) {
        event.preventDefault();
        this.get('controller').previousPage();
    },

    nextPage: function (event) {
        event.preventDefault();
        this.get('controller').nextPage();
    },

    pageButton: Em.View.extend({
        tagName: 'li',
        classNameBindings: ['isCurrent'],

        goToPage: function (event) {
            event.preventDefault();
            this.get('parentView.controller').goToPage(this.get('content'));
        },
        isCurrent: function () {
            return this.get('content') === this.get('parentView.controller.currentPage') ? 'active' : '';
        }.property('parentView.controller.currentPage')
    })
});
