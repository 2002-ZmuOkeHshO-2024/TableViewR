Lyte.Router.registerRoute('index', {


	redirect: function (model, paramsObject) {

		this.transitionTo('login');
	}


});
