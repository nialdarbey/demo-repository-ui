jQuery.validator.addMethod("resourceNameValidation", function (value, element) {
    return this.optional(element) || /^[a-z0-9\s\-]*$/i.test(value);
}, "invalid-resource-name");


