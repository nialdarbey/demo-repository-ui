var App = require('app');

App.RecordStatusListener = Em.Mixin.create({
    observeRecordStatus: function (record) {
        record.addObserver('isSaving', this, this.handleIsSaving);
    },
    handleIsSaving: function (record) {
        if (record.get('isSaving')) {
            this.recordUpdating();
        } else if (!record.get('isSaving') && !record.get('isDirty')) {
            this.recordUpdated();
            record.removeObserver('isSaving', this);
        }
    },
    recordUpdating: function (record) {
        this._super(record);
    },
    recordUpdated: function (record) {
        this._super(record);
    }
});
