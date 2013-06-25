var App = require('app');

App.KeyPressListener = Em.Mixin.create({
    didInsertElement: function () {
        this._super();
        this._setupDocumentKeyHandler();
    },

    willDestroyElement: function () {
        this._super();
        this._removeDocumentKeyHandler();
    },

    keyPress: function (event) {
        this._super(event);
    },

    _setupDocumentKeyHandler: function () {
        var cc = this,
            handler = function (event) {
                cc.keyPress(event);
            };

        $(window.document).bind('keyup', handler);
        this._keyUpHandler = handler;
    },

    _removeDocumentKeyHandler: function () {
        $(window.document).unbind('keyup', this._keyUpHandler);
    }
});