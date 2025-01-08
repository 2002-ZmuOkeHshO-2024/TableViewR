Lyte.Component.register("login-comp", {
_template:"<template class=\"main-container\" tag-name=\"login-comp\"> <div class=\"login-container\"> <div class=\"input\"> <lyte-input lt-prop-id=\"username\" class=\"username\" lt-prop-direction=\"horizontal\" lt-prop-appearance=\"box\" lt-prop-placeholder=\"your username\" onkeydown=\"{{action('login',event)}}\"> </lyte-input> </div> <div class=\"input\"> <lyte-input lt-prop-id=\"password\" class=\"password\" lt-prop-type=\"password\" lt-prop-password-icon=\"true\" lt-prop-direction=\"horizontal\" lt-prop-appearance=\"box\" lt-prop-placeholder=\"your password\" onkeydown=\"{{action('login',event)}}\"> </lyte-input> </div> <div class=\"button\"> <lyte-button lt-prop-class=\"login-button\" lt-prop-id=\"unique\" onclick=\"{{action('login',event)}}\"> <template is=\"registerYield\" yield-name=\"text\"> Login </template> </lyte-button> </div> <div class=\"register-text\"> <span class=\"label-register\"> new user ?</span> <lyte-button lt-prop-class=\"register-button\" onclick=\"{{action('register',event)}}\" lt-prop-yield=\"true\"> <template is=\"registerYield\" yield-name=\"text\"> register </template> </lyte-button> </div> </div> </template>\n<style>/* Main container setup */\n*,\nhtml,\nbody {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}\n\nbody {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    min-height: 100vh;\n    background: #222;\n}\n\n.loading {\n\n    position: absolute;\n    z-index: 20;\n    display: none;\n}\n\n.loading span {\n    position: relative;\n    width: 20px;\n    height: 5px;\n\n}\n\n.loading span::before {\n    content: '';\n    position: absolute;\n    inset: 0;\n    background: rgb(106, 216, 235);\n    box-shadow: 0 0 5px rgb(106, 216, 235),\n        0 0 15px rgb(106, 216, 235),\n        0 0 30px rgb(106, 216, 235),\n        0 0 50px rgb(106, 216, 235);\n    animation: animate 5s linear infinite;\n    animation-delay: calc(var(--i)*0.1s);\n}\n\n@keyframes animate {\n\n    0% {\n        transform-origin: 0 20px;\n        filter: hue-rotate(0deg);\n    }\n\n    20% {\n        transform: rotate(calc(-90deg * var(--i)));\n\n    }\n\n    60% {\n        transform: rotate(calc(0deg * var(--i)));\n\n    }\n\n    100% {\n\n        filter: hue-rotate(360deg);\n    }\n\n}\n\n.main-container {\n\n    background-image: url('60574852.jpg');\n    background-size: cover;\n    background-position: center;\n    background-repeat: no-repeat;\n\n\n    display: grid;\n    /* Make it a grid */\n    grid-template-columns: 30% 40% 30%;\n    /* Define the columns (1fr, 3fr, 1fr) */\n    grid-template-rows: 32% 36% 32%;\n    /* Define the rows (1fr, 3fr, 1fr) */\n    height: 100vh;\n    /* Full viewport height */\n    width: 100vw;\n    /* Full width */\n    margin: 0px;\n    padding: 0px;\n}\n\n\n\n\n.login-container {\n\n\n    /* White with 50% transparency */\n\n\n    grid-column: 2 / 3;\n    grid-row: 2 / 3;\n    width: 100%;\n    height: 100%;\n    display: grid;\n\n    grid-template-columns: 1fr;\n    grid-template-rows: 30% 30% 20% 20%;\n\n    justify-content: center;\n    align-items: center;\n    border-radius: 8px;\n\n}\n\n.login-container:hover {\n\n    background-color: rgba(255, 255, 255, 0.15);\n\n}\n\n\n.input,\n.button,\n.register-text {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n\n    height: 100%;\n    width: 100%;\n    margin: 0px;\n    padding: 0px;\n}\n\n#password,\n#username {\n    background-color: rgba(0, 0, 0, 0.6);\n    font-size: 17px;\n    color: aliceblue;\n    height: 100%;\n    padding: 20px;\n    font-style: oblique;\n}\n\n#password:focus,\n#username:focus {\n    box-shadow: 0 0 10px 5px rgba(42, 130, 196, 0.689);\n}\n\n\n\n\n\n.username,\n.password {\n\n    align-self: stretch;\n    width: 60%;\n    height: 100%;\n    padding: 0px;\n    margin: 0px;\n\n}\n\n\n.label-input,\n.label-register {\n\n    font-weight: 400;\n    font-size: 18px;\n    margin-right: 20px;\n    color: rgba(0, 170, 221, 0.868);\n}\n\n.login-button {\n\n    font-family: \"Arimo\", serif;\n    background-color: #21875B;\n    padding: 10px 30px;\n    border-radius: 100px;\n    font-size: 18px;\n    color: white;\n    border: none\n}\n\n\n.login-button:hover {\n\n    font-weight: 1000;\n    font-family: \"Arimo\", serif;\n    color: rgb(74, 69, 69);\n    padding: 13px 33px;\n    border-radius: 100px;\n    background-color: #79EA5D;\n    border: none;\n    box-shadow: 5px 5px 10px rgb(0, 0, 0);\n\n}\n\n.register-text {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n\n\n\n.register-button:hover {\n    border: none;\n    font-size: 20px;\n    color: #6edce8e3;\n    text-decoration: underline;\n    font-family: \"Arimo\", serif;\n}\n\n.register-button {\n\n    width: 100%;\n    padding: 20px;\n    font-size: 16px;\n    background: none;\n    border: none;\n    color: grey;\n    font-family: \"Arimo\", serif;\n}</style>",
_dynamicNodes : [{"type":"attr","position":[1,1,1]},{"type":"componentDynamic","position":[1,1,1]},{"type":"attr","position":[1,3,1]},{"type":"componentDynamic","position":[1,3,1]},{"type":"attr","position":[1,5,1]},{"type":"registerYield","position":[1,5,1,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[1,5,1]},{"type":"attr","position":[1,7,3]},{"type":"registerYield","position":[1,7,3,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[1,7,3]}],

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
