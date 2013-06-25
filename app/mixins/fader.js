var App = require('app');
require('helpers');

App.Fader = Em.Mixin.create({
    delay: 200,

    didInsertElement: function () {
        var el = this.$();
        el.css({ position: 'relative' });
        el.hide().fadeIn(this.delay);
        this._super();
    },

    willDestroyElement: function () {
        var clone = this.$().clone();
        clone.find('[data-ember-action]').remove();
        this.$().find('[data-ember-action]').remove();
        this.$().replaceWith(clone);
        clone.css({ position: 'relative' });
        clone.fadeOut(this.delay, function () {
            clone.empty();
        });
        this._super();
    }
});
