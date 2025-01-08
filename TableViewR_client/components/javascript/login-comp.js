Lyte.Component.register("login-comp", {
	data: function () {
		return {

		}
	},
	actions: {


		register: function (event) {



			Lyte.Router.transitionTo('register');



		},

		login: function (event) {
			if ((event instanceof KeyboardEvent)) {
				if (!(event.code === 'Enter')) return;
			}

			var userName = $L('lyte-input.username')[0].ltProp('value');
			var password = $L('lyte-input.password')[0].ltProp('value');

			if (!userName || !password) {

				$L('lyte-alert.error-response')[0].ltProp('heading', "Login error");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Username or password can't be empty");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;
			}






			$L.ajax({
				url: `http://${window.location.hostname}:8080/api/login`,
				type: 'POST',
				headers: {
					'X-User-Name': userName,
					'X-User-Password': password,
					'X-User-Request': "login"
				},
				processData: false,
				contentType: false,
				withCredentials: true,
				success: function (response) {

					console.log(response);

					const user = {

						token: response.token,
						tableId: -1
					}

					sessionStorage.setItem("user", JSON.stringify(user));

					$L('lyte-messagebox.success-response')[0].ltProp('message', response.message);
					$L('lyte-messagebox.success-response')[0].ltProp('show', true);

					Lyte.Router.transitionTo('home');
				},

				error: function (response) {

					const message = JSON.parse(response.responseText).message;

					$L('lyte-input.username')[0].ltProp('value', "");
					$L('lyte-input.password')[0].ltProp('value', "");

					$L('lyte-alert.error-response')[0].ltProp('heading', "Login error");
					$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Can't login , try again");
					$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', message);
					$L('lyte-alert.error-response')[0].ltProp('show', true);
				}
			});



		}



	},
	methods: {
	}



});
