jQuery.validator.addMethod("startsWithALetter", function (value, element) {
    return this.optional(element) || /^[a-z]/i.test(value);
}, "should-start-with-a-letter");
