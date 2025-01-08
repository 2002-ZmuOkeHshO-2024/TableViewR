//Lyte.Router.configureDefaults({ baseURL: '', history: "html5" });
//loader
Lyte.Router.configureRoutes(function () {
	this.route('index', { path: '/' });
	this.route('home', {}, function () {
		this.route('config');
	});

	this.route("login");
	this.route("table");

	this.route("register");
});

Lyte.Router.beforeRouteTransition = function () {

}

Lyte.Router.afterRouteTransition = function () {
	//console.log('after Route Change');
}

