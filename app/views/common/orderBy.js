var App = require('app');

require('helpers');
        
var precompileTemplate = Em.Handlebars.compile;

(function () {
    var iconClasses = ['icon-sort', 'icon-sort-up', 'icon-sort-down'];

    App.SortableTableRowView = App.BaseView.extend({
        tagName: 'tr',
        sortingView: null,
        controller: null,
        init: function () {
            this._super();
        },
        didInsertElement: function () {
            this.get('childViews').forEach(function (childView) {
                childView.on('sortingCriteriaChanged', this.sortingCriteriaChanged.bind(this));
            }.bind(this));
        },
        sortingCriteriaChanged: function (who, field, order) {
            var oldSortingView = this.get('sortingView'), controller = this.get('controller');
            
            if (oldSortingView && oldSortingView !== who) {
                oldSortingView.reset();
            }

            this.set('sortingView', who);
            
            // No order, disable it
            if (order === 0) {
                controller.disableSort();
            } else {
                controller.sort(field, order);
            }
        }
    });

    App.SortableTableColumnView = App.BaseView.extend({
        tagName: 'th',
        isSorting: false,
        classNames: ['order-by'],
        classNameBindings: ['isSorting:sorting'],
        iconClassIndex: 0,
        iconClass: function () {
            return iconClasses[this.get('iconClassIndex')];
        }.property('iconClassIndex'),
        templateName: require('templates/common/orderByField'),
        reset: function () {
            this.set('isSorting', false);
            this.set('iconClassIndex', 0);
        },
        click: function (event) {
            var iconClassIndex = (this.get('iconClassIndex') + 1) % iconClasses.length;
            this.set('iconClassIndex', iconClassIndex);
            this.set('isSorting', iconClassIndex !== 0);
            this.trigger('sortingCriteriaChanged', this, this.get('field'),
                iconClassIndex);
            return false;
        }
    });
}());
