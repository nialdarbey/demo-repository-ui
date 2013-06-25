var App = require('app');

jQuery.validator.addMethod('checkUniqueFromList', function (value, element, params) {
    var i, selector = $(params),
        flag = true;

    for (i = 0; i <= selector.length; i++) {
        if (value === $(selector[i]).text()) {
            flag = false;
            break;
        }
    }

    return flag;
}, 'checkUniqueFromList');