var App, config;
App = require('app');
config = require('config');
require('helpers');

App.EventSubscription = Em.Object.extend({
    record: null,
    callback: null,
    events: null,
    context: null
});

App.EventEmitter = Em.Object.extend({
    publishers: Em.Map.create(),
    subscriptionsByRecord: Em.Map.create(),
    subscriptions: Em.A(),

    subscribe: function (record, callback, context, events) {
        var subscription = App.EventSubscription.create({
                record: record,
                callback: callback,
                context: context,
                events: events || Em.A()
            });

        this.startListening(record);
        this.addSubscriber(subscription);

        return subscription;
    },

    unsubscribe: function (subscriber) {
        this.removeSubscriber(subscriber);
    },

    addSubscriber: function (subscription) {
        this.get('subscriptions').pushObject(subscription);
        this.subscribersFor(subscription.get('record')).pushObject(subscription);
    },

    removeSubscriber: function (subscription) {
        var record = subscription.get('record'),
            subscribers = this.subscribersFor(record);

        this.get('subscriptions').removeObject(subscription);
        subscribers.removeObject(subscription);

        if (!subscribers.length) {
            this.removePublisher(record);
        }
    },

    subscribersFor: function (record) {
        var subscriptionsByRecord = this.get('subscriptionsByRecord'),
            recordSubscribers = subscriptionsByRecord.get(record);

        if (!recordSubscribers) {
            recordSubscribers = Em.A();
            subscriptionsByRecord.set(record, recordSubscribers);
        }

        return recordSubscribers;
    },

    addPublisher: function (record) {
        this.startListening(record);
    },

    removePublisher: function (record) {
        var subscriptionsByRecord = this.get('subscriptionsByRecord');
        subscriptionsByRecord.remove(record);

        this.stopListening(record);
    },

    startListening: function (record) {
    },

    stopListening: function (record) {
    },

    eventArrived: function (event) {
        var record = event.get('record'),
            eventData = event.get('data'),
            eventType = event.get('type'),
            subscribers = this.subscribersFor(record);

        subscribers.forEach(function (item) {
            var callback = item.get('callback'),
                context = item.get('context') || callback,
                events = item.get('events');

            if (events.length === 0 || events.contains(eventType)) {
                callback.call(context, eventData, eventType);
            }
        }, this);
    }
});

App.WebSocketEventEmitter = App.EventEmitter.extend({
    socketsByRecord: Em.Map.create(),

    startListening: function (record) {
        var socketsByRecord = this.get('socketsByRecord'),
            socket = new WebSocket(config.WEBSOCKET_HOST),
            that = this;

        socket.onopen = function () {
            var subscription = that.buildSubscriptionMessage(record);
            socket.send(subscription);
        };

        socket.onmessage = function (received) {
            var data = JSON.parse(received.data),
                evt;

            evt = Em.Object.create({
                record: record,
                data: data,
                type: data.event || 'message'
            });

            that.eventArrived(evt);
        };

        socket.onclose = function () {
            console.log('connection closed');
        };

        socketsByRecord.set(record, socket);
    },

    buildSubscriptionMessage: function (record) {
        var serviceId = JSON.parse(record.get('_metaData')).serviceId,
            major = record.get('major'),
            minor = record.get('minor'),
            revision = record.get('revision');

        return JSON.stringify({
            accessToken: App.authProvider.getCurrentUser().get('accessToken'),
            entity: {
                type: 'service',
                id: serviceId,
                version: {
                    major: major,
                    minor: minor,
                    revision: revision
                }
            },
            eventTypes: [ 'BEGIN_INVOKE', 'END_INVOKE', 'CHANGED', 'EXCEPTION' ]
        });
    },

    stopListening: function (record) {
        var socketsByRecord = this.get('socketsByRecord'),
            socket = socketsByRecord.get(record);

        if (socket) {
            socket.close();
        }
    }
});
