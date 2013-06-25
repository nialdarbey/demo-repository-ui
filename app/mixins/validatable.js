var App = require('app');

App.Validatable = Em.Mixin.create({
    validationOptions: {
        config: {},
        formSelector: '',
        associatedForms: [],
        interceptsSave: 'save',
        interceptsUpdate: 'update'
    },

    init: function () {
        this._super();

        this.configureValidation(this.validationOptions);

        if (this.validationOptions.embeddedValidation) {
            this.configureValidation(this.validationOptions.embeddedValidation);
        }
    },

    configureValidation: function (options) {
        var interceptsSave = options.interceptsSave || 'save',
            interceptsUpdate = options.interceptsUpdate || 'update',
            saveMethod = this[interceptsSave],
            updateMethod = this[interceptsUpdate];

        this.addValidationAspect(interceptsSave, saveMethod, options.formSelector);
        this.addValidationAspect(interceptsUpdate, updateMethod, options.formSelector);
    },

    addValidationAspect: function (interceptedMethodName, method, formSelector) {
        this[interceptedMethodName] = function () {
            if (this.$().find(formSelector).valid() && this.validateAssociatedForms()) {
                if (typeof method === 'function') {
                    $.proxy(method, this).call();
                }
                return true;
            } else {
                return false;
            }
        };
    },

    validateAssociatedForms: function () {
        var that = this,
            isValid = true;

        if (typeof this.validationOptions.associatedForms !== 'undefined') {
            $.each(this.validationOptions.associatedForms, function (i, val) {
                if ($(val).length > 0) {
                    isValid = isValid && $(val).valid();
                }
            });
        }

        return isValid;
    },

    setupValidations: function () {
        if (this.$()) {
            this.$().find(this.validationOptions.formSelector)
                .validate({
                rules: this.validationOptions.config.rules,
                messages: this.validationOptions.config.messages,
                errorPlacement: function (error, element) {
                    var validationMessage = $(element).closest('.controls');
                    if (validationMessage && validationMessage.length) {
                        validationMessage.addClass(error.html());
                    }
                },
                highlight: function (element) {
                    $(element).closest('.control-group').removeClass('success');
                    $(element).closest('.control-group').addClass('error');
                },
                unhighlight: function (element) {
                    $(element).closest('.control-group').removeClass('error');
                    $(element).closest('.control-group').addClass('success');
                    var validationMessage = $(element).closest('.controls');
                    if (validationMessage && validationMessage.length) {
                        validationMessage[0].className = 'controls';
                    }
                }
            });
        }
    },

    refreshValidations: function () {
        this.setupValidations();
    },

    didInsertElement: function () {
        this._super();
        this.setupValidations();

        if (this.validationOptions.embeddedValidation) {
            this.$().find(this.validationOptions.embeddedValidation.formSelector)
                .validate({
                rules: this.validationOptions.embeddedValidation.config.rules,
                messages: this.validationOptions.embeddedValidation.config.messages,
                errorPlacement: function (error, element) {
                    var validationMessage = $(element).closest('.controls');
                    if (validationMessage && validationMessage.length) {
                        validationMessage.addClass(error.html());
                    }
                },
                highlight: function (element) {
                    $(element).closest('.control-group').removeClass('success');
                    $(element).closest('.control-group').addClass('error');
                },
                unhighlight: function (element) {
                    $(element).closest('.control-group').removeClass('error');
                    $(element).closest('.control-group').addClass('success');
                    var validationMessage = $(element).closest('.controls');
                    if (validationMessage && validationMessage.length) {
                        validationMessage[0].className = 'controls';
                    }
                }
            });
        }

        $.validator.addMethod('customIpAddress', function (value, element) {
            var full, partial, cidr;

            full = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.test(value);
            partial = /^(\d{1,3})(\.(\d{1,3})(\.(\d{1,3})(\.(\d{1,3}))?)?)?$/.test(value);
            cidr = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,3})$/.test(value);

            return value === '' || full || partial || cidr;
        },
            '<p>This field accepts an IP address, a partial IP address or CIDR notation for ranges.</p><p>Examples:<br/>192.168.1.222 or 10.5 or 122.5.10.51/16</p>');
    }
});