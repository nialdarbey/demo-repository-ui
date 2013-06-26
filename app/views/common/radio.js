/* Adapted from the Ember.Select component */
// XXX Unhack me
// TODO Test what happens if the radios should start with a default
// or preset value (that has not been tested)

var App = require('app');

require('helpers');

var set = Em.set,
        get = Em.get,
        indexOf = Em.EnumerableUtils.indexOf,
        indexesOf = Em.EnumerableUtils.indexesOf,
        replace = Em.EnumerableUtils.replace,
        isArray = Em.isArray,
        precompileTemplate = Em.Handlebars.compile;

/*jshint eqeqeq:false */

App.RadioButtonGroup = Em.View.extend({

    tagName: 'div',
    classNames: ['btn-group'],
    defaultTemplate: precompileTemplate('{{#each view.content}}{{view App.RadioButton classBinding="isFirst:active" contentBinding="this"}}{{/each}}'),
    attributeBindings: ['tabindex', 'data-toggle'],

    content: null,
    selection: null,
    value: Em.computed(function (key, value) {
        if (arguments.length === 2) { return value; }
        var valuePath = get(this, 'optionValuePath').replace(/^content\.?/, '');
        return valuePath ? get(this, 'selection.' + valuePath) : get(this, 'selection');
    }).property('selection'),

    optionLabelPath: 'content',
    optionLabelDescriptionPath: '',
    optionLabelSubDescriptionPath: '',

    optionValuePath: 'content',

    selectionDidChange: Em.observer(function () {
        var selection = get(this, 'selection');
        var el = this.get('element');
        if (!el) { return; }

        var content = get(this, 'content'),
                selectionIndex = content ? indexOf(content, selection) : -1,
                prompt = get(this, 'prompt');

        if (prompt) { selectionIndex += 1; }
        if (el) { el.selectedIndex = selectionIndex; }
    }, 'selection.@each'),

    valueDidChange: Em.observer(function () {
        var content = get(this, 'content'),
                value = get(this, 'value'),
                valuePath = get(this, 'optionValuePath').replace(/^content\.?/, ''),
                selectedValue = (valuePath ? get(this, 'selection.' + valuePath) : get(this, 'selection')),
                selection;

        if (value !== selectedValue) {
            selection = content.find(function (obj) {
                return value === (valuePath ? get(obj, valuePath) : obj);
            });

            this.set('selection', selection);
        }
    }, 'value'),


    _triggerChange: function () {
        var selection = get(this, 'selection');
        var value = get(this, 'value');

        if (selection) { this.selectionDidChange(); }
        if (value) { this.valueDidChange(); }

        this._change();
    },

    _change: function () {
        var content = this.$().find('.active').data('content');
        set(this, 'selection', content);
    },

    init: function () {
        this._super();
        this.on('didInsertElement', this, this._triggerChange);
        this.on('click', this, this._change);

        this.get('content').objectAt(0).set('isFirst', true);
    }
});

App.RadioButton = Em.View.extend({
    tagName: 'button',
    type: 'button',
    style: 'text-align: left;',
    attributeBindings: ['value', 'selected', 'type', 'style'],
    classNames: ['btn btn-primary'],

    defaultTemplate: precompileTemplate('<div class="title">{{view.label}}</div><div class="description">{{view.description}}</div><div class="subdescription">{{view.subdescription}}</div>'),

    _click: function () {
        this.$().parent().find(this.get('tagName')).removeClass('active');
        this.$().addClass('active');
    },

    init: function () {
        this.labelPathDidChange();
        this.valuePathDidChange();

        this.on('click', this, this._click);
        this._super();
    },
    didInsertElement: function () {
        this.$().data('content', this.get('content'));
    },
    selected: Em.computed(function () {
        var content = get(this, 'content'),
                selection = get(this, 'parentView.selection');
        // Primitives get passed through bindings as objects... since
        // `new Number(4) !== 4`, we use `==` below
        return content == selection;
    }).property('content', 'parentView.selection').volatile(),

    labelPathDidChange: Em.observer(function () {
        var labelPath = get(this, 'parentView.optionLabelPath'),
            labelDescriptionPath = get(this, 'parentView.optionLabelDescriptionPath'),
            slaPath = get(this, 'parentView.optionLabelSubDescriptionPath');

        if (!labelPath) { return; }

        Em.defineProperty(this, 'label', Em.computed(function () {
            return get(this, labelPath);
        }).property(labelPath));
        
        Em.defineProperty(this, 'description', Em.computed(function () {
            return get(this, labelDescriptionPath);
        }).property(labelDescriptionPath));
        
        Em.defineProperty(this, 'subdescription', Em.computed(function () {
            return get(this, slaPath);
        }).property(slaPath));

    }, 'parentView.optionLabelPath'),

    valuePathDidChange: Em.observer(function () {
        var valuePath = get(this, 'parentView.optionValuePath');

        if (!valuePath) { return; }

        Em.defineProperty(this, 'value', Em.computed(function () {
            return get(this, valuePath);
        }).property(valuePath));
    }, 'parentView.optionValuePath')
});
