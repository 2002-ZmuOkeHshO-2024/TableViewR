Lyte.Component.register("user-comp", {
_template:"<template tag-name=\"user-comp\"> <lyte-dropdown class=\"usertables\" lt-prop-placeholder=\"your tables\" lt-prop-class=\"class-check\" lt-prop-user-value=\"name\" lt-prop-system-value=\"value\" on-option-selected=\"{{method('fetchTable',fromWhere)}}\" on-before-show=\"{{method('getTableList')}}\"> </lyte-dropdown> </template>",
_dynamicNodes : [{"type":"attr","position":[1]},{"type":"componentDynamic","position":[1]}],

	data: function () {
		return {

		}
	},
	actions: {
	},
	methods: {

		fetchTable: function (fromWhere) {

			const user = JSON.parse(sessionStorage.getItem("user"));
			if (!user) {
				$L('lyte-alert.error-response')[0].ltProp('heading', "Request failed");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', " Can't send your request ");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "you may not logged in or your session timed out , login again");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				Lyte.Router.transitionTo('login');
				return
			}

			var tableId = Number($L('lyte-dropdown.usertables')[0].ltProp('selected'));
			user.tableId = tableId
			sessionStorage.setItem("user", JSON.stringify(user));

			if (fromWhere === 'home') {

				Lyte.Router.transitionTo('table');
			}

			else {


				var tableView = store.peekRecord('tableView', 1);
				if (!tableView) {
					store.createRecord("tableView", { id: 1 });
					var tableView = store.peekRecord('tableView', 1);
				}

				let query = "";
				var page = '1';

				$L.ajax({
					url: `http://${window.location.hostname}:8080/api/tableData`,
					type: 'post',
					headers: {
						'Authorization': 'Bearer ' + user.token,
						'X-Table-Id': user.tableId,
					},
					data: JSON.stringify({ query: query, page: page }),
					processData: false,
					contentType: "application/json",
					success: function (response) {

						console.log("using it ....");
						tableView.$.set('totalPages', response.totalPages);
						tableView.$.set('currentQuery', response.currentQuery);
						tableView.$.set('contentJSON', response.contentJSON);
						tableView.$.set('headerJSON', response.headerJSON);
						tableView.$.set('currentPage', response.currentPage);

						$L('lyte-input.queryInput')[0].ltProp('value', response.currentQuery);


					},
					error: function (response) {

						const message = JSON.parse(response.responseText).message;
						$L('lyte-alert.error-response')[0].ltProp('heading', "Request table error ");
						$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Can't view the table requested , try again");
						$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', message);
						$L('lyte-alert.error-response')[0].ltProp('show', true);
						if (response.status === 401) {
							Lyte.Router.transitionTo('login');
						}

					}
				});



			}

		},

		getTableList: function () {

			const user = JSON.parse(sessionStorage.getItem("user"));
			if (!user) {
				$L('lyte-alert.error-response')[0].ltProp('heading', "Request failed");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', " Can't send your request ");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "you session timed out , login again");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				Lyte.Router.transitionTo('login');
				return
			}



			$L.ajax({
				url: `http://${window.location.hostname}:8080/api/userTables`,
				type: 'get',
				headers: {
					'Authorization': 'Bearer ' + user.token,
				},
				processData: false,
				contentType: false,
				success: function (response) {
					$L('lyte-dropdown.usertables')[0].ltProp('options', response.tableList);
				},
				error: function (response) {

					console.log(response);
					const message = JSON.parse(response.responseText).message;

					$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', message);
					$L('lyte-alert.error-response')[0].ltProp('show', true);
					if (response.status === 401) {
						Lyte.Router.transitionTo('login');
					}

				}
			});



			return true;




		}



	}
});
