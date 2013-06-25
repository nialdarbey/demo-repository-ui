var App = require('app'),
    get = Em.get,
    modalPaneBackdrop = '<div class="modal-backdrop"></div>';

require('helpers');

App.Wizard = Em.Mixin.create({
    stepViewNames: [],
    backBtnText: '&larr;',
    nextBtnText: '&rarr;',
    didInsertElement: function () {
        this._super();
        this.$().bwizard({
            backBtnText: this.backBtnText,
            nextBtnText: this.nextBtnText
        });
        this.$().bind('bwizardvalidating', $.proxy(this.bwizardValidating, this));
    },
    bwizardValidating: function (event, params) {
        var currentView = Em.View.views[this.stepViewNames[params.index]],
            backClicked = params.index > params.nextIndex;

        if (currentView) {
            if (backClicked) {
                return $.proxy(currentView.back, currentView)(params);
            } else {
                return $.proxy(currentView.next, currentView)(params);
            }
        }
    }
});

App.WizardStep = Em.Mixin.create({
    tagName: 'form',
    validations: null,
    didInsertElement: function () {
        this._super();
        //// TODO: revert validations
        if (this.validations) {
            this.$().validate(this.validations);
        }
    },
    isValid: function () {
        return this.$().valid();
    },
    next: function (params) {
        return true;
    },
    back: function (params) {
        return true;
    }
});