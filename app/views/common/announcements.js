var App = require('app');
var groups = {}, activeItem = false, activeIndicator = false;

App.AnnouncementsView = App.BaseView.extend({
    group: null,
    templateName: require('templates/common/announcements')
});

    
App.AnnouncementIndicator = App.BaseView.extend({
    tagName: 'li',
    attributeBindings: ['data-target', 'data-slide-to'],
    group: null,
    'data-slide-to': null,
    'data-target': null,
    // XXX Unhack me
    willDestroyElement: function () {
        var group = this.get('group');
        
        if (!group) {
            return;
        }

        delete groups[group].indicators;

    },
    init: function (val) {
        this._super(val);
        var group = this.get('data-target');
        if (!group) {
            throw 'Error: "group" property must be set in App.AnnouncementIndicator';
        }
        if (!groups[group] || !groups[group].indicators) {
            groups[group] = groups[group] || {};
            groups[group].indicators = [];
            this.set('classNames', ['active']);
        }
        groups[group].indicators.push(this);
        this.set('data-slide-to', groups[group].indicators.length - 1);
        this.set('group', this.get('data-target'));
    }
});


App.AnnouncementItem = App.BaseView.extend({
    classNames: ['item'],
    group: null,
    // XXX Unhack me
    willDestroyElement: function () {
        var group = this.get('group');
        
        if (!group) {
            return;
        }

        delete groups[group].items;

    },
    init: function (val) {
        this._super(val);
        var group = this.get('group');
        
        if (!group) {
            throw 'Error: "group" property must be set in App.AnnouncementIndicator';
        }

        if (!groups[group] || !groups[group].items) {
            groups[group] = groups[group] || {};
            groups[group].items = [];
            this.set('classNames', ['item', 'active']);
        }
        groups[group].items.push(this);
    }
});
