var App = require('app');

App.OwnershipView = App.BaseView.extend(App.Validatable, App.ErrorListener, App.KeyPressListener, App.Modal, {
    errorListenerErrorProperty: 'controller.errors',
    errorListenerDisplayInCurrentView: true,
    errorListenerOutletName: 'modal-notifications',
    errorListenerClassNames: ['alert-modal'],
    templateName: require('templates/common/ownership'),

    keyPress: function (event) {
        if (event.keyCode === 27) {
            this._hide({
                close: true
            }, event);
        }
    },

    click: function (event) {
        var target = event.target,
            targetRel = target.getAttribute('rel');

        if (targetRel === 'close') {
            this.get('controller').clear();
            this._hide({
                close: true
            }, event);
        }
    },

    addOwner: function (event) {
        this.get('controller').addOwner(event);
    },

    didInsertElement: function () {
        $('.typeahead.user-search').typeahead({
            minLength: 3,
            autoUpdate: true,
            menu: '<div class="dropdown-menu users-typeahead"></div>',
            source: function (query, process) {
                Api.User.where({
                    q: query
                }).findMany().done(function (results) {
                    var arr = [];

                    results.forEach(function (user) {
                        arr.push({
                            value: user.get('username'),
                            label: '%@ (%@ %@)'.fmt(user.get('username'), user.get('firstName'), user.get('lastName'))
                        });
                    }.bind(this));

                    process(arr);
                });
            },
            hide: function () {
                this.$menu.hide();
                this.shown = false;

                return this;
            },
            render: function (items) {
                var that = this;

                items = $(items).map(function (i, item) {
                    i = $(that.options.item).attr('data-value', item.value);
                    i.find('a').html(that.highlighter(item.label));
                    return i[0];
                });

                items.first().addClass('active');
                this.$menu.html(items);

                return this;
            },
            matcher: function (item) {
                return true;
            },
            sorter: function (items) {
                return items;
            }
        });

        this._super();
    }
});