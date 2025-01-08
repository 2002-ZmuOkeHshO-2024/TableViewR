Lyte.Component.register("register-comp", {
_template:"<template class=\"main2-container\" tag-name=\"register-comp\"> <div class=\"register-container\"> <div class=\"input2\"> <lyte-input lt-prop-id=\"new-username\" class=\"new-username\" lt-prop-direction=\"horizontal\" lt-prop-appearance=\"box\" lt-prop-placeholder=\"your username\" onkeydown=\"{{action('register',event)}}\"> </lyte-input> </div> <div class=\"input2\"> <lyte-input lt-prop-id=\"new-password\" class=\"new-password\" lt-prop-type=\"password\" lt-prop-password-icon=\"true\" lt-prop-direction=\"horizontal\" lt-prop-appearance=\"box\" lt-prop-placeholder=\"your password\" onkeydown=\"{{action('register',event)}}\"> </lyte-input> </div> <div class=\"button2\"> <lyte-button lt-prop-class=\"register-button2\" lt-prop-id=\"unique\" onclick=\"{{action('register',event)}}\"> <template is=\"registerYield\" yield-name=\"text\"> Register </template> </lyte-button> </div> </div> </template>\n<style>/* Main container setup */\n.main2-container {\n\n\n    background-image: url('5083957.jpg');\n    background-size: cover;\n    background-position: center;\n    background-repeat: no-repeat;\n\n\n\n\n\n    display: grid;\n    /* Make it a grid */\n    grid-template-columns: 30% 40% 30%;\n    /* Define the columns (1fr, 3fr, 1fr) */\n    grid-template-rows: 33% 34% 33%;\n    /* Define the rows (1fr, 3fr, 1fr) */\n    height: 100vh;\n    /* Full viewport height */\n    width: 100vw;\n    /* Full width */\n    margin: 0;\n    padding: 0;\n}\n\n#new-password,\n#new-username {\n    background-color: rgba(0, 0, 0, 0.6);\n    font-size: 17px;\n    color: aliceblue;\n    height: 100%;\n    padding: 20px;\n    font-style: oblique;\n}\n\n#new-password:focus,\n#new-username:focus {\n    box-shadow: 0 0 10px 5px rgba(140, 78, 215, 0.723);\n}\n\n\n\n\n\n\n.register-container {\n\n    display: grid;\n\n    grid-column: 2 / 3;\n    grid-row: 2 / 3;\n    width: 100%;\n    height: 100%;\n\n\n    grid-template-columns: 1fr;\n    grid-template-rows: 1fr 1fr 1fr;\n\n\n    justify-content: center;\n    align-items: center;\n    border-radius: 8px;\n\n}\n\n.register-container:hover {\n\n    background-color: rgba(255, 255, 255, 0.15);\n}\n\n.new-username,\n.new-password {\n\n\n    align-self: stretch;\n    width: 60%;\n    height: 100%;\n    padding: 0px;\n    margin: 0px;\n\n}\n\n\n.input2,\n.button2 {\n    display: flex;\n    justify-content: center;\n    /* Horizontally center */\n    align-items: center;\n\n\n    margin: 0px;\n    padding: 0px;\n}\n\n\n.button2 {\n\n\n    margin-bottom: 20px;\n\n}\n\n.register-button2 {\n\n    font-family: \"Arimo\", serif;\n    background-color: #969104e9;\n    padding: 13px 25px;\n    font-size: 19px;\n    border-radius: 100px;\n    color: white;\n    border: none\n}\n\n.register-button2:hover {\n\n    font-weight: 1000;\n    font-family: \"Arimo\", serif;\n    background-color: #f4ef69e9;\n    padding: 16px 28px;\n    border-radius: 100px;\n    color: rgb(67, 63, 63);\n    border: none;\n    box-shadow: 5px 5px 10px rgb(0, 0, 0);\n}</style>",
_dynamicNodes : [{"type":"attr","position":[1,1,1]},{"type":"componentDynamic","position":[1,1,1]},{"type":"attr","position":[1,3,1]},{"type":"componentDynamic","position":[1,3,1]},{"type":"attr","position":[1,5,1]},{"type":"registerYield","position":[1,5,1,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[1,5,1]}],

	data: function () {
		return {

		}
	},
	actions: {
		register: function (event) {
			if ((event instanceof KeyboardEvent)) {
				if (!(event.code === 'Enter')) return;
			}

			var userName = $L('lyte-input.new-username')[0].ltProp('value');
			var password = $L('lyte-input.new-password')[0].ltProp('value');

			if (!userName || !password) {

				$L('lyte-alert.error-response')[0].ltProp('heading', "Register error");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Username or password can't be empty");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;
			}



			console.log("the password: " + password);


			$L.ajax({
				url: `http://${window.location.hostname}:8080/api/login`,
				type: 'POST',
				headers: {
					'X-User-Name': userName,
					'X-User-Password': password,
					'X-User-Request': "register"
				},
				processData: false,
				contentType: false,
				withCredentials: true,
				success: function (response) {

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

					$L('lyte-input.new-username')[0].ltProp('value', "");
					$L('lyte-input.new-password')[0].ltProp('value', "");

					$L('lyte-alert.error-response')[0].ltProp('heading', "Register error");
					$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Can't register , try again");
					$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', message);
					$L('lyte-alert.error-response')[0].ltProp('show', true);


				}
			});



		}

	},
	methods: {
		// Functions which can be used as callback in the component.
	}
});
