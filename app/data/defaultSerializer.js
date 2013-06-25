var App, config;
App = require('app');
config = require('config');

require('helpers');

App.DefaultSerializer = DS.JSONSerializer.extend({
    metaDataKey: '_metaData',
    extract: function (loader, json, type, record) {
        var root = this.rootForType(type),
            object = type.extractSingleRecord(json),
            newJson = {}, metadata;

        newJson[root] = object;

        metadata = json[this.metaDataKey];
        object[this.metaDataKey] = metadata;

        this.sideload(loader, type, newJson, root);
        this.extractMeta(loader, type, newJson);

        if (object) {
            if (record) { loader.updateId(record, object); }
            this.extractRecordRepresentation(loader, type, object);
        }
    },
    extractMany: function (loader, json, type, records) {
        var root = this.rootForType(type),
            objects = type.extractMultipleRecords(json),
            references = [], newJson = {}, metadata;

        root = type.pluralRootForType || this.pluralize(root);
        newJson[root] = objects;

        metadata = json[this.metaDataKey];
        objects.forEach(function (item) {
            item[this.metaDataKey] = metadata;
        }, this);

        this.sideload(loader, type, newJson, root);
        this.extractMeta(loader, type, newJson);

        if (objects) {
            if (records) { records = records.toArray(); }

            for (var i = 0; i < objects.length; i++) {
                if (records) { loader.updateId(records[i], objects[i]); }
                var reference = this.extractRecordRepresentation(loader, type, objects[i]);
                references.push(reference);
            }

            loader.populateArray(references);
        }
    },
    rootForType: function (type) {
        var typeString = type.toString();

        if (type.rootForType) {
            return type.rootForType;
        }

        Em.assert('Your model must not be anonymous. It was ' + type, typeString.charAt(0) !== '(');
        // use the last part of the name as the URL
        var parts = typeString.split('.');
        var name = parts[parts.length - 1];
        return name.replace(/([A-Z])/g, '_$1').toLowerCase().slice(1);
    }
});