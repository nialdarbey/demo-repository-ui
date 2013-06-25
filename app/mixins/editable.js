var App = require('app');

App.Editable = Em.Mixin.create({
    editableConfig: {
        fields: [],
        validationRules: null,
        sourceType: null
    },

    init: function () {
        this._super();

        $.each(this.editableConfig.fields, $.proxy(function (i, field) {
            var methodName = '%@EditHandler'.fmt(field);

            this[methodName] = $.proxy(function (e) {
                var type = $(e.currentTarget).data('type').toLowerCase(),
                    valueType = $(e.currentTarget).data('value-type'),
                    allowCreation = $(e.currentTarget).data('allow-creation'),
                    allowDuplicates = $(e.currentTarget).data('allow-duplicates'),
                    fieldName = field,
                    fieldSelector = '#%@'.fmt(fieldName),
                    viewContainer = '_%@View'.fmt(fieldName);

                $.each(this.editableConfig.fields, $.proxy(function (j, val) {
                    var container = '_%@View'.fmt(val),
                        selector = '#%@'.fmt(val);

                    if (val !== fieldName) {
                        if (this[container]) {
                            this[container].destroy();
                            $(selector).show();
                        }
                    }
                }, this));

                valueType = valueType === undefined ? null : valueType.toLowerCase();

                this[viewContainer] = App.InlineEditView.create({
                    validationRules: this.editableConfig.validationRules,
                    controller: this.controller,
                    fieldName: fieldName,
                    templateType: type,
                    dataType: valueType,
                    autocomplete: this.editableConfig.autocomplete,
                    allowCreation: allowCreation || false,
                    allowDuplicates: allowDuplicates || false,
                    dependency: this.editableConfig.dependency,
                    sourceType: this.editableConfig.sourceType
                });

                this[viewContainer]._insertElement(function () {
                    $(fieldSelector).hide();
                    this.$().insertAfter(fieldSelector);
                });
            }, this);
        }, this));
    }
});
