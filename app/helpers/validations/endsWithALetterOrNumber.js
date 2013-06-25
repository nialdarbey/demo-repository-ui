jQuery.validator.addMethod("endsWithALetterOrNumber", function (value, element) {
    return this.optional(element) || /[a-z0-9]$/i.test(value);
}, "should-end-with-a-letter-or-number");
