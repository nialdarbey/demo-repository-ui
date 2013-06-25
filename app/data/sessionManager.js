var App, config;
App = require('app');
config = require('config');

require('helpers');
require('models');

App.SessionManager = Em.Object.extend({
    sessionId: '',

    init: function () {
        var sessionId = $.cookie('habitat_session_id'),
            isNew = false;

        if (!sessionId) {
            sessionId = App.helpers.generateGuid();
            $.cookie('habitat_session_id', sessionId);
            isNew = true;
            this.clear();
        }

        this.set('sessionId', sessionId);
    },
    formatKey: function (key) {
        return this.get('sessionId') + '_' + key;
    },
    getItem: function (key) {
        var value = window.sessionStorage.getItem(this.formatKey(key));

        if (value) {
            return JSON.parse(value);
        } else {
            return null;
        }
    },
    setItem: function (key, value) {
        if (Em.typeOf(value) !== 'string') {
            value = JSON.stringify(value);
        }

        window.sessionStorage.setItem(this.formatKey(key), value);
    },
    removeItem: function (key) {
        window.sessionStorage.removeItem(this.formatKey(key));
    },
    clear: function () {
        window.sessionStorage.clear();
    },
    isEmpty: function () {
        return window.sessionStorage.length === 0;
    }
});

App.sessionManager = App.SessionManager.create();