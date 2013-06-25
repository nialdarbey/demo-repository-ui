var App = require('app');

App.Owned = Em.Mixin.create({
	owners: DS.attr('array', {
		defaultValue: []
	}),
	isOwner: function () {
		return App.authProvider.getCurrentUser().get('organizationOwner') || this.get('owners').contains(App.authProvider.getCurrentUser().get('username'));
	}.property('owners')
});


Api.Owned = Em.Mixin.create({
	owners: Milo.property('array', {
		defaultValue: [],
		operations: []
	}),
	isOwner: function () {
		return App.authProvider.getCurrentUser().get('organizationOwner') || this.get('owners').contains(App.authProvider.getCurrentUser().get('username'));
	}.property('owners')
});