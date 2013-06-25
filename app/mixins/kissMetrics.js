var App = require('app'),
    config = require('config');

if (window.mochaPhantomJS) {

    App.KISSMetrics = Em.Mixin.create({
        init: function () {
        },
        track: function (event, properties) {
        }
    });

} else {

    // XXX Hack, sorry I can't make this variable local :(. Blame KISSMetrics.
    window._kmq = [];

    (function () {
        var _kmk = config.KISSMETRICS_KEY;
        var _kms = function (u) {
            setTimeout(function () {
                var d = document, f = d.getElementsByTagName('script')[0],
                    s = d.createElement('script');
                s.type = 'text/javascript';
                s.async = true;
                s.src = u;
                f.parentNode.insertBefore(s, f);
            }, 1);
        };

        _kms('//i.kissmetrics.com/i.js');
        _kms('//doug1izaerwt3.cloudfront.net/' + _kmk + '.1.js');

        var _KISSMetrics = Em.Object.extend({
            _id: null,
            identify: function () {
                var id = App.get('user.username'), organization = App.get('user.organization');
                var formerId = this.get('_id');
                if (id !== formerId) {
                    if (id === null) {
                        this.set('_id', null);
                        this.track('Logged out', {'username': formerId});
                        window._kmq.push(['clearIdentity']);
                        return;
                    }

                    this.set('_id', id);
                    window._kmq.push(['identify', id]);
                    this.track('Logged in', {'username': id, 'organization': organization});
                }
            }.observes('App.user'),

            enter: function () {
                var loc = App.get('router.location.lastSetURL');
                if (loc) {
                    this.track('Entered', {Where: loc});
                }
            }.observes('App.router.location.lastSetURL'),

            track: function (event, properties) {
                var newProperties = {};
                Object.keys(properties).forEach(function (propertyName) {
                    var newPropertyName = propertyName.dasherize().replace(/-/g, ' ').titleize();
                    newProperties[newPropertyName] = properties[propertyName];
                });
                if (window._kmq.push(['record', 'SR ' + event, newProperties])) {
                    window._kmq.push(['record', 'SR KM error', {message: 'KM Event: ' + event + ' properties: ' + JSON.stringify(newProperties)}]);
                }
            }
        });

        var km;

        App.KISSMetrics = Em.Mixin.create({
            init: function () {
                if (!km) {
                    km = _KISSMetrics.create();
                }
                this._super();
            },
            track: function (event, properties) {
                km.track(event, properties);
            }
        });
    }());

}

