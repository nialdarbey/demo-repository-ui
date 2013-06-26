var App = require('app');

App.UserDetailsController = Em.ObjectController.extend({
	userDetails: null,

	loadUserDetails: function (userId) {
		var user = Api.User.where({
			id: userId
		}).findOne();

		// if (user.get('isLoaded')) {
		// user.reload();
		// }

		this.set('userDetails', user);
	}
});