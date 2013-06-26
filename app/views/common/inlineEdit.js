var App = require('app');

require('mixins');

App.InlineEditView = Em.View.extend(App.Validatable, App.KISSMetrics, {
    containerType: 'text',
    editableValue: null,
    fieldName: null,
    classNames: ['editable-inline', 'editable-container'],
    tagName: 'span',
    template: null,
    dataType: null,
    controlId: null,
    arrayValue: Em.A(),
    deletedValues: Em.A(),
    autocomplete: null,
    allowCreation: false,
    allowDuplicates: false,
    sourceType: null,

    source: function () {
        return this.get('sourceType').findMany();
    }.property(),

    init: function () {
        if (this.get('dependency') && App.get(this.get('dependency'))) {
            this.set('editableValue', App.get(this.get('dependency')).get(this.get('fieldName')));
            this.controller.content.set(this.get('fieldName'), this.get('editableValue'));
        } else {
            this.set('editableValue', this.controller.content.get(this.get('fieldName')));
        }

        this.set('controlId', '%@EditableTags'.fmt(this.get('fieldName')));

        if (this.get('dataType') !== 'array') {
            this.addObserver('editableValue', this, this.valueUpdated);
        }

        this.loadTemplate();

        this.set('validationOptions', {
            config: this.get('validationRules'),
            formSelector: '.editableform'
        });

        this.set('arrayValue', Em.A());
        this.set('deletedValues', Em.A());

        this._super();
    },

    didInsertElement: function () {
        if (this.get('templateType') === 'tags') {
            this.setupTagIt();
        }

        this._super();
    },

    valueUpdated: function () {
        this.controller.content.set(this.get('fieldName'), this.get('editableValue'));
    },

    save: function () {
        var containerSelector = '#%@'.fmt(this.get('fieldName')),
            embedded = null,
            dirtyElement = this.controller.get('content');

        if (this.get('autocomplete') && this.get('autocomplete')[this.get('fieldName')]) {
            embedded = this.get('autocomplete')[this.get('fieldName')].embedded;
        }

        if (this.get('dataType') === 'array') {
            this.controller.content.get(this.get('fieldName')).pushObjects(this.get('arrayValue'));

            $.each(this.get('deletedValues'), $.proxy(function (i, val) {
                if (embedded) {
                    var toRemove = this.controller.content.get(this.get('fieldName')).filterProperty('id', val.dasherize());

                    this.controller.content.get(this.get('fieldName')).removeObjects(toRemove);
                } else {
                    this.controller.content.get(this.get('fieldName')).removeObject(val);
                }
            }, this));

            this.get('arrayValue').toArray().forEach(function (e) {
                if (e.get) {
                    this.track('Applied Taxonomy', {taxonomyId: e.get('fullPath')});
                } else {
                    this.track('Applied Tag', {tagId: e});
                }
            }, this);
        }

        if (!embedded) {
            var temp = this.controller.content.get(this.get('fieldName'));

            if (Em.Copyable.detect(temp)) {
                temp = Em.copy(temp);
            }

            if (this.get('dependency') && App.get(this.get('dependency'))) {
                App.get(this.get('dependency')).set(this.get('fieldName'), temp);

                dirtyElement = App.get(this.get('dependency'));

                //// HIGH HACK
                if (temp.constructor.toString() === 'Api.Environment') {
                    var tempName = temp.get('id').replace(/-/g, ' ').titleize();
                    App.get(this.get('dependency')).get('environment').set('name', tempName);
                }
            } else {
                this.controller.content.set(this.get('fieldName'), temp);
            }
        }

        // DS.defaultStore.commit();
        dirtyElement.save();

        $(containerSelector).show();
        this.destroy();
    },

    cancel: function () {
        var containerSelector = '#%@'.fmt(this.get('fieldName')),
            record = this.get('controller.content');

        if (this.get('dependency') && App.get(this.get('dependency'))) {
            record = App.get(this.get('dependency'));
        }

        if (record.get('isDirty')) {
            record.rollback();
        }

        $(containerSelector).show();
        this.destroy();
    },

    willDestroyElement: function () {
        this.removeObserver('editableValue', this, this.valueUpdated);
    },

    setupTagIt: function () {
        var that = this,
            selector = '#%@EditableTags'.fmt(this.get('fieldName'));

        $(selector).tagit({
            allowSpaces: true,
            allowDuplicates: this.get('allowDuplicates'),
            caseSensitive: false,
            removeConfirmation: true,
            autocomplete: {
                selectFirst: true,
                minLength: 2,
                autoFocus: true,
                source: function (request, response) {
                    var result = [],
                        config = that.get('autocomplete')[that.get('fieldName')],
                        entityModel = config.model,
                        embedded = config.embedded,
                        currentValue = that.controller.content.get(that.get('fieldName')).get('content');

                    entityModel.where({ q: request.term }).findMany().done(function (results) {
                        results.forEach(function (val, index) {
                            var materialized = val;
                            var matches = that.get('arrayValue').filterProperty('id', materialized.get('id')).length;

                            if (that.get('fieldName') === 'taxonomies') {
                                // currentValue = that.controller.content.get(that.get('fieldName'));
                                // matches += currentValue.filterProperty('id', materialized.get('id')).length;
                                matches += that.controller.content.get(that.get('fieldName')).filterProperty('id', materialized.get('id')).length;
                            }

                            if (matches > 0) {
                                return;
                            }

                            result.push({
                                label: materialized.get(config.source),
                                value: materialized
                            });
                        });

                        response(result);
                    });
                },
                select: function (evt, ui) {
                    var id = ui.item.value.id,
                        contains = that.controller.content.get(that.get('fieldName')).filterProperty('id', id),
                        record,
                        config = that.get('autocomplete')[that.get('fieldName')],
                        embedded = config.embedded;

                    if (contains.length === 0) {
                        if (embedded) {
                            record = embedded.type.create(ui.item.value.getProperties(embedded.properties));
                        } else {
                            record = ui.item.value.get(config.source);
                        }

                        if (!that.get('allowCreation')) {
                            that.get('arrayValue').pushObject(record);
                            that.get('deletedValues').removeObject(record.get('id'));
                        }
                    }
                }
            },
            afterTagAdded: function  (evt, ui) {
                if (!ui.duringInitialization) {
                    if (that.get('allowCreation')) {
                        that.get('arrayValue').pushObject(ui.tagLabel.toLowerCase());
                        that.get('deletedValues').removeObject(ui.tagLabel.toLowerCase());
                    }
                }
            },
            beforeTagAdded: function (evt, ui) {
                var label = ui.tagLabel.split('::'),
                    identifier = ui.tagLabel;

                if (label.length > 1) {
                    ui.tag.find('.tagit-label').text(label[1]);
                }

                ui.tag.attr('data-id', identifier);
            },
            afterTagRemoved: function (evt, ui) {
                var tag = ui.tag.data('id');

                if (that.get('fieldName') === 'taxonomies') {
                    that.controller.content.get(that.get('fieldName')).removeObject(that.controller.content.get(that.get('fieldName')).findProperty('id', tag));
                } else {
                    that.get('arrayValue').removeObject(tag);
                }

                that.get('deletedValues').pushObject(tag);
            }
        });

        $(selector).find('.tagit-new').find('input').focus();
    },

    loadTemplate: function () {
        if (this.get('templateType') === 'text') {
            this.set('template', Em.TEMPLATES[require('templates/common/textEditorTemplate')]);
        } else if (this.get('templateType') === 'textarea') {
            this.set('template', Em.TEMPLATES[require('templates/common/textareaEditorTemplate')]);
        } else if (this.get('templateType') === 'markdown') {
            this.set('template', Em.TEMPLATES[require('templates/common/markdownEditorTemplate')]);
        } else if (this.get('templateType') === 'tags') {
            this.set('template', Em.TEMPLATES[require('templates/common/tagsEditorTemplate')]);
        } else if (this.get('templateType') === 'list') {
            this.set('template', Em.TEMPLATES[require('templates/common/dropdownEditorTemplate')]);
        }
    }
});
