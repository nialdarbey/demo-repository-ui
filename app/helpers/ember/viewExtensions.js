var App = require('app');

App.TextField = Em.TextField.extend({
	attributeBindings: ['field', 'rel', 'data-placement', 'data-title'],

	valueChanged: function () {
		if (this.get('field')) {
			this.get('field').set(this.get('name'), this.get('value'));
		}
	}.observes('value')
});

Em.TextField.reopen({
    attributeBindings: ['name', 'autofocus', 'autocomplete']
});

Em.TextArea.reopen({
    attributeBindings: ['name']
});