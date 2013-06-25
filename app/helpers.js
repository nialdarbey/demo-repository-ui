var App = require('app'),
    config = require('config');

String.prototype.endsWith = function () {
    var suffixes = Array.prototype.slice.call(arguments),
        result = false;

    suffixes.forEach(function (suffix) {
        if (this.indexOf(suffix, this.length - suffix.length) !== -1) {
            result = true;
        }
    }, this);
    return result;
};

DS.JSONTransforms.array = {
    deserialize: function (serialized) {
        return serialized;
    },
    serialize: function (deserialized) {
        return deserialized;
    }
};

App.Helpers = Em.Object.extend({
    cloneEmObject: function (emObject) {
        return JSON.parse(JSON.stringify(emObject));
    },
    getGravatar: function (email) {
        email = email || '';
        return 'https://www.gravatar.com/avatar/' + hexMd5(email) + '.jpg';
    },
    toTimeAgoString: function (date) {
        //return moment(date || 0).fromNow();
        return moment(date || 0).format('MMM Do YYYY');
    },
    emptyRecordArray: function () {
        return DS.RecordArray.create({
            isLoaded: true
        });
    },
    incrementProperty: function (propertyName, target) {
        var propValue;
        target = target || App;
        propValue = target.get(propertyName);
        target.set(propertyName, propValue + 1);
    },
    decrementProperty: function (propertyName, target) {
        var propValue;
        target = target || App;
        propValue = target.get(propertyName);
        target.set(propertyName, propValue - 1);
    },
    sanitizeUri: function (uri) {
        return uri.replace(/^\/\/*/, '').replace(/\/\/*$/, '');
    },
    generateGuid: function () {
        var S4 = function () {
            return Math.floor(
            Math.random() * 0x10000 /* 65536 */ ).toString(16);
        };

        return (
        S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
    },

    applyServiceVersionMetadata: function (record, service, version, id) {
        var metaDataKey = '_metaData',
            metadata = {};

        service = service || App.get('globals.service');
        version = version || App.get('globals.version');

        metadata.serviceId = service.get('id');
        metadata.versionId = version.get('id');
        if (id) {
            metadata.id = id;
        }

        record[metaDataKey] = JSON.stringify(metadata);
    },

    applyConsumerVersionMetadata: function (record, consumer, version, id) {
        var metaDataKey = '_metaData',
            metadata = {};

        consumer = consumer || App.get('globals.consumer');
        version = version || App.get('globals.consumerVersion');

        metadata.consumerId = consumer.get('id');
        metadata.versionId = version.get('id');
        if (id) {
            metadata.id = id;
        }

        record[metaDataKey] = JSON.stringify(metadata);
    },

    observeRecordEvent: function (records, event, context) {
        var deferreds = [];

        event = event || 'didUpdate';
        if (records && !Em.isArray(records)) {
            records = Em.makeArray(records);
        }

        records.forEach(function (record) {
            var deferred = jQuery.Deferred();
            deferreds.push(deferred);
            record.one(event, function () {
                deferred.resolveWith(context, [this]);
            });
            record.one('commitCalled', function () {
                deferred.notifyWith(context, [this]);
            });
            record.one('becameInvalid', function () {
                //Begin height hack
                if (this.get('isNew')) {
                    this.send('becameValid');
                    DS.defaultStore.defaultTransaction.buckets.created.add(this);
                } else if (this.get('isDirty')) {
                    this.send('becameValid');
                    DS.defaultStore.defaultTransaction.buckets.updated.add(this);
                }
                //End height hack
                deferred.rejectWith(context, [this]);
            });
        });
        return jQuery.when.apply($, deferreds);
    },

    saveMultipleRecords: function (records) {
        var deferreds = [];

        if (records && !Em.isArray(records)) {
            records = Em.makeArray(records);
        }

        records.forEach(function (record) {
            deferreds.push(record.save());
        });

        return jQuery.when.apply($, deferreds);
    },

    isValidJSON: function (str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    },

    extractErrorsFromRecords: function () {
        var errors = [],
            records = Array.prototype.slice.call(arguments);

        records.forEach(function (record) {
            var recordErrors = record.get('errors');

            recordErrors.forEach(function (recordError) {
                errors.push(recordError);
            }, this);
        }, this);

        return errors;
    },

    roundNumber: function (number, decimalPlaces) {
        var factor = Math.pow(10, decimalPlaces || 0);
        return Math.round(number * factor) / factor;
    },

    retrieveRecordCount: function (type, query, context) {
        var deferred = jQuery.Deferred(),
            array;

        array = type.where(query).paginate({ page: 1 }).findMany(),

        array.done(function (results) {
            deferred.resolveWith(context, [results.get('totalRecords')]);
        });

        return deferred;
    },

    getTimeFrameFilter: function (timeFrame, includeUnit) {
        var format = 'YYYY-MM-DDTHH:mm:ssZZ',
            result = {
                from: '',
                to: ''
            };

        if (timeFrame === 'last24Hours') {

            result.to = moment().minutes(59).seconds(59).milliseconds(999).format(format);
            result.from = moment().minutes(0).seconds(0).milliseconds(0).subtract('hours', 23).format(format);
            if (includeUnit) {
                result.timeUnit = 'hour';
            }

        } else if (timeFrame === 'lastWeek') {

            result.to = moment().hours(23).minutes(59).seconds(59).milliseconds(999).format(format);
            result.from = moment().hours(0).minutes(0).seconds(0).milliseconds(0).subtract('days', 6).format(format);
            if (includeUnit) {
                result.timeUnit = 'dayOfMonth';
            }

        } else if (timeFrame === 'lastMonth') {

            result.to = moment().hours(23).minutes(59).seconds(59).milliseconds(999).format(format);
            result.from = moment().hours(0).minutes(0).seconds(0).milliseconds(0).add('days', 1).subtract('months', 1).format(format);
            if (includeUnit) {
                result.timeUnit = 'dayOfMonth';
            }

        } else if (timeFrame === 'lastYear') {

            result.to = moment().day(1).hours(0).minutes(0).seconds(0).milliseconds(0).add('months', 1).subtract('milliseconds', 1).format(format);
            result.from = moment().day(1).hours(0).minutes(0).seconds(0).milliseconds(0).add('months', 1).subtract('years', 1).format(format);
            if (includeUnit) {
                result.timeUnit = 'month';
            }

        }

        return result;
    },

    getTimeFrameSeries: function (params) {
        var unit = params.timeUnit.replace('hour', 'hours').replace('dayOfWeek', 'days').replace('dayOfMonth', 'days').replace('month', 'months'),
            from = moment(params.from),
            to = moment(params.to),
            diff = to.diff(from, unit),
            increment = moment(params.from),
            result = [];

        for (var i = 1; i <= diff; i++) {
            result.push(increment.clone().toDate());
            increment.add(unit, 1);
        }

        return result;
    },

    sizeInBytes: function (size) {
        var sizeInKb = size / 1024,
            sizeInMb = sizeInKb / 1024,
            sizeInGb = sizeInMb / 1024,
            sizeInTb = sizeInGb / 1024;

        if (sizeInTb >= 1) {
            return App.helpers.roundNumber(sizeInTb, 2) + ' TB';
        } else if (sizeInGb >= 1) {
            return App.helpers.roundNumber(sizeInGb) + ' GB';
        } else if (sizeInMb >= 1) {
            return App.helpers.roundNumber(sizeInMb, 2) + ' MB';
        } else if (sizeInKb >= 1) {
            return App.helpers.roundNumber(sizeInKb) + ' KB';
        } else {
            return size + ' Bytes';
        }
    },

    ajax: function (url, data, method, cacheFlag, dataType, accept, contentType, includeToken) {
        /*jshint camelcase:false */
        var accessToken = App.authProvider.getAccessToken(),
            headers = {
                accept: accept || 'application/vnd.mulesoft.habitat+json'
            };

        if ('undefined' === typeof includeToken) {
            includeToken = true;
        }

        if (accessToken && includeToken) {
            headers.authorization = 'Bearer ' + accessToken.access_token;
        }

        if ('undefined' === typeof cacheFlag) {
            cacheFlag = true;
        }

        if ('undefined' === typeof dataType) {
            dataType = (method || 'GET') === 'GET' ? 'json' : 'text';
        }

        url = url.replace(/\?$|&$/, '');

        App.authProvider.setLastActivity();

        /*jshint camelcase:true */
        return jQuery.ajax({
            contentType: contentType || 'application/vnd.mulesoft.habitat+json',
            type: method || 'GET',
            dataType: dataType,
            data: data ? (dataType === 'text' ? JSON.stringify(data) : data) : '',
            url: url,
            headers: headers,
            cache: cacheFlag,
            timeout: config.LOGIN_TIMEOUT
        })
            .fail(function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 403) {
                App.authProvider.expireToken();
                App.set('globals.applicationError', Em.Object.create({
                    errors: [{
                        message: 'Session expired'
                    }]
                }));
            }
        });
    },

    oauth20Ajax: function (url, data) {
        return this.ajax(url, data, 'POST', false, 'json', 'application/json', 'application/x-www-form-urlencoded', false);
    }
});

App.helpers = App.Helpers.create();

//// Handlebars Helpers
require('helpers/handlebars/breaklines');
require('helpers/handlebars/defaultRenderer');
require('helpers/handlebars/listRenderer');
require('helpers/handlebars/timeUnitRenderer');
require('helpers/handlebars/markdown');
require('helpers/handlebars/highlight');
require('helpers/handlebars/safeString');
require('helpers/handlebars/tendencyRenderer');
require('helpers/handlebars/dateFormater');

//// Validation Helpers
require('helpers/validations/checkUniqueFromList');
require('helpers/validations/endsWithALetterOrNumber');
require('helpers/validations/resourceNameValidation');
require('helpers/validations/startsWithALetter');

//// Ember Helpers
require('helpers/ember/viewExtensions');