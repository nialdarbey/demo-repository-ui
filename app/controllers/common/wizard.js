var App = require('app');

App.WizardController = Em.ObjectController.extend({
    wizardController: null,

    start: function () {
        var controllerClass = App.get(this.get('content.controller') + 'Controller');
        this.set('wizardController', controllerClass.create());
        this.set('wizardController.wizard', this.get('content'));
        this.showStep(1);
    }.observes('content'),

    showStep: function (stepNumber) {
        var step = this.get('content.steps')[stepNumber - 1],
            view, viewName;

        viewName = step.get('view');

        view = this.connectOutlet({
            outletName: 'current-step',
            viewClass: App.get(viewName + 'View'),
            controller: this.get('wizardController')
        });

        this.set('content.currentStep', step);
        this.set('content.currentStepNumber', stepNumber);
        this.set('currentView', view);
    },

    isLastStep: function () {
        return this.get('content.currentStepNumber') >= this.get('content.steps.length');
    }.property('content.currentStepNumber'),

    isFirstStep: function () {
        return (this.get('content.currentStepNumber') === 1);
    }.property('content.currentStepNumber'),

    cancel: function () {
        var returnUri = this.get('content.returnUri'),
            wizardController = this.get('wizardController');

        DS.defaultStore.defaultTransaction.rollback();
        if (wizardController.onCancel) {
            wizardController.onCancel.apply(wizardController, arguments);
        } else {
            window.location.href = returnUri;
        }
    },

    previous: function () {
        this.showStep(this.get('content.currentStepNumber') - 1);
    },

    next: function () {
        this.showStep(this.get('content.currentStepNumber') + 1);
    },

    finish: function () {
        var returnUri = this.get('content.returnUri'),
            wizardController = this.get('wizardController'),
            that = this;

        this.set('isSaving', true);

        wizardController.finish()
            .done(function () {
                if (wizardController.onSuccess) {
                    wizardController.onSuccess.apply(wizardController, arguments);
                } else {
                    window.location.href = returnUri;
                }
            })
            .fail(function (errors) {
                // var errors = App.helpers.extractErrorsFromRecords.apply(null, arguments);
                that.set('errors', errors);
                if (wizardController.onError) {
                    wizardController.onError.apply(wizardController, arguments);
                }
            })
            .always(function () {
                that.set('isSaving', false);
            });
    }
});
