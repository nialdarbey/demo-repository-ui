var App = require('app');
require('helpers');

App.Slider = Em.Mixin.create({
    routesOrder: ['ServicesIndex', 'ServiceDetails', 'ServiceDetailsVersion', 'ConsumersIndex',
        'ConsumerDetails', 'ConsumerDetailsVersion', 'PoliciesIndex', 'ContractsIndex',
        'TaxonomiesIndex', 'AgentTokensIndex', 'UsersIndex'],
    offset: 2000,
    delay: 200,

    didInsertElement: function () {
        var el = this.$();
        el.css({ position: 'relative', left: this.calculateDirectionOnInsert() });
        el.animate({ left: 0 }, this.delay);
        this._super();
    },
    willDestroyElement: function () {
        var clone = this.$().clone();
        clone.find('[data-ember-action]').remove();
        this.$().find('[data-ember-action]').remove();
        this.$().find('[type="text/x-placeholder"]').remove();
        this.$().replaceWith(clone);
        clone.css({ position: 'relative' });
        clone.animate({ left: this.calculateDirectionOnDestroy() }, this.delay, function () {
            clone.empty();
        });
        this._super();
    },
    calculateDirectionOnInsert: function () {
        var lastRoute = App.get('globals.lastRoute');
        var currentRoute = App.get('globals.route');

        return this.calcuateDirection(lastRoute, currentRoute);
    },
    calculateDirectionOnDestroy: function () {
        var lastRoute = App.get('globals.lastRoute');
        var currentRoute = App.get('globals.route');

        return this.calcuateDirection(currentRoute, lastRoute);
    },
    calcuateDirection: function (lastRoute, currentRoute) {
        var lastIndex = this.routesOrder.indexOf(lastRoute);
        var currentIndex = this.routesOrder.indexOf(currentRoute);

        if (lastIndex <= currentIndex) {
            return this.offset;
        } else if (lastIndex > currentIndex) {
            return -1 * this.offset;
        } else {
            throw new Error('Route not added. Please add the following route to ' +
                    'the routesOrder array: ', currentRoute);
        }
    }
});
