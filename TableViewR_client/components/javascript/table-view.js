Lyte.Component.register("table-view", {
	data: function () {


		return {

			dropData: Lyte.attr('array', { default: [] }),
			selectedData: Lyte.attr('array', { default: [] }),
			fileFormats: Lyte.attr('array', {
				default: [
					{
						"Excel formats": [
							{
								"name": ".xlsx",
								"value": "xlsx"
							},
							{
								"name": ".xls",
								"value": "xls"
							}
						]
					},
					{
						"Mark-up language formats": [
							{
								"name": ".JSON",
								"value": "json"
							},
							{
								"name": ".xml",
								"value": "xml"
							}
						]
					},
					{
						"Delimiter separated files": [
							{
								"name": "CSV (,)",
								"value": ","
							},
							{
								"name": "SSV (;)",
								"value": ";"
							},
							{
								"name": "TSV (\\t)",
								"value": "tsv"
							},
							{
								"name": "PSV (|)",
								"value": "psv"
							},
							{
								"name": "HSV (#)",
								"value": "hsv"
							}
						]
					}
				]

			})

		}


	},
	actions: {
		fileUpload: function () {

			Lyte.Router.transitionTo('home');

		},

		deleteTables: function () {

			const user = JSON.parse(sessionStorage.getItem("user"));
			if (!user) {
				$L('lyte-alert.error-response')[0].ltProp('heading', "Request failed");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', " Can't send your request ");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "you may not logged in or your session timed out , login again");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				Lyte.Router.transitionTo('login');
				return
			}


			const values = $L('lyte-multi-dropdown.user-drop-tables')[0].ltProp('selected').map(item => item.value);

			if (values.length === 0) {

				$L('lyte-alert.error-response')[0].ltProp('heading', "Drop tables error");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Didn't selected any tables to drop");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;

			}

			//	console.log($L('lyte-multi-dropdown.user-drop-tables')[0].ltProp('selected'));
			$L('lyte-multi-dropdown.user-drop-tables')[0].ltProp('selected', []);

			//	console.log($L('lyte-multi-dropdown.user-drop-tables')[0].ltProp('selected'));

			var component = this;
			$L.ajax({
				url: `http://${window.location.hostname}:8080/api/drop`,
				type: 'post',
				processData: false,
				data: JSON.stringify(values),
				headers: {

					'Authorization': 'Bearer ' + user.token,
					'Content-Type': 'application/json'

				},
				contentType: false,
				withCredentials: true,
				success: function (response) {

					$L('lyte-messagebox.success-response')[0].ltProp('message', response.message);
					$L('lyte-messagebox.success-response')[0].ltProp('show', true);
					if (values.includes(String(user.tableId))) {
						Lyte.Router.transitionTo('home');
					}

					component.setData('dropData', []);


				},
				error: function (response) {


					const message = JSON.parse(response.responseText).message;

					$L('lyte-alert.error-response')[0].ltProp('heading', "Drop tables error");
					$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Can't drop the tables , sorry .. try again");
					$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', message);
					$L('lyte-alert.error-response')[0].ltProp('show', true);
					if (response.status === 401) {
						Lyte.Router.transitionTo('login');
					}



				}
			});







		}
		,
		executeQuery: function () {

			const user = JSON.parse(sessionStorage.getItem("user"));
			if (!user) {
				$L('lyte-alert.error-response')[0].ltProp('heading', "Request failed");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', " Can't send your request ");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "you may not logged in or your session timed out , login again");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				Lyte.Router.transitionTo('login');
				return
			}


			var query = $L('lyte-input.queryInput')[0].ltProp('value').trim();

			if (query.length === 0) {


				$L('lyte-alert.error-response')[0].ltProp('heading', "Couldn't execute");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Problem in executing your query !!");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', `Empty query , enter some valid SQL query to process further`);
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;


			}

			var allowedKeywords = ["CREATE", "SELECT", "UPDATE", "INSERT", "DELETE", "ALTER", "DESCRIBE", "DESC", "SHOW", "DROP"];


			var firstKeyword = query.split(/\s+/)[0].toUpperCase();


			if (!allowedKeywords.includes(firstKeyword)) {

				$L('lyte-alert.error-response')[0].ltProp('heading', "Couldn't execute");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Problem in executing your query !!");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', `Your query may not be allowed to execute or starting part might contain incorrect syntax. Allowed operations are: ${allowedKeywords.join(", ")}`);
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;
			}

			if (firstKeyword === "DROP" && query.split(/\s+/)[1]?.toUpperCase() === "TABLE") {

				$L('lyte-alert.error-response')[0].ltProp('heading', "Couldn't execute");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Problem in executing your query !!");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "Sorry, you cannot drop tables by executing a query. However, you can use the 'Drop' option on the page to remove tables after selecting them.");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;
			}

			if (firstKeyword === "CREATE" && query.split(/\s+/)[1]?.toUpperCase() === "TABLE") {

				$L('lyte-alert.error-response')[0].ltProp('heading', "Couldn't execute");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Problem in executing your query !!");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "Sorry, you cannot create tables by executing a query. However, you can create tables by uploading files with tabular content ");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;
			}

			if (firstKeyword === "CREATE" && query.split(/\s+/)[1]?.toUpperCase() === "DATABASE") {

				$L('lyte-alert.error-response')[0].ltProp('heading', "Couldn't execute");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Problem in executing your query !!");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "Sorry, you are not allowed to create a database.");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;
			}

			if (firstKeyword === "ALTER" && query.split(/\s+/)[1]?.toUpperCase() === "DATABASE") {

				$L('lyte-alert.error-response')[0].ltProp('heading', "Couldn't execute");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Problem in executing your query !!");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "Sorry, you are not allowed to change database structure.");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;
			}

			if (firstKeyword === "DROP" && query.split(/\s+/)[1]?.toUpperCase() === "DATABASE") {
				$L('lyte-alert.error-response')[0].ltProp('heading', "Couldn't execute");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Problem in executing your query !!");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "Sorry, you are not allowed to drop a database.");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;
			}

			if (firstKeyword === "SHOW" && query.split(/\s+/)[1]?.toUpperCase() === "DATABASES") {
				$L('lyte-alert.error-response')[0].ltProp('heading', "Couldn't execute");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Problem in executing your query !!");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "Sorry, you are not allowed to view database details.");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;
			}

			var tableView = store.peekRecord('tableView', 1);
			if (!tableView) {
				console.log('in new tableView 2')
				store.createRecord("tableView", { id: 1 });
				var tableView = store.peekRecord('tableView', 1);
			}

			//query = `?query=${query}`;
			var goTo = $L('lyte-number.GoTo')[0].ltProp('value');
			return new Promise((resolve, reject) => {
				$L.ajax({
					url: `http://${window.location.hostname}:8080/api/tableData`,
					type: 'post',
					data: JSON.stringify({ query: query, page: goTo }),
					processData: false,
					contentType: "application/json",
					headers: {

						'Authorization': 'Bearer ' + user.token,
						'X-Table-Id': user.tableId,
					},
					withCredentials: true,
					success: function (response) {

						tableView.$.set('totalPages', response.totalPages);
						tableView.$.set('currentQuery', response.currentQuery);
						tableView.$.set('contentJSON', response.contentJSON);
						tableView.$.set('headerJSON', response.headerJSON);
						tableView.$.set('currentPage', response.currentPage);

						$L('lyte-input.queryInput')[0].ltProp('value', response.currentQuery);

					},
					error: function (response) {


						const message = JSON.parse(response.responseText).message;

						$L('lyte-alert.error-response')[0].ltProp('heading', "Query execute error");
						$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Can't execute the given Query , sorry");
						$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', message);
						$L('lyte-alert.error-response')[0].ltProp('show', true);
						if (response.status === 401) {
							Lyte.Router.transitionTo('login');
						}

					}
				});
			});
		},
		goto: function (view, event) {

			const user = JSON.parse(sessionStorage.getItem("user"));
			if (!user) {
				$L('lyte-alert.error-response')[0].ltProp('heading', "Request failed");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', " Can't send your request ");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "you may not logged in or your session timed out, login again");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				Lyte.Router.transitionTo('login');
				return
			}


			if ((event instanceof KeyboardEvent))
				if (!(event.code === 'Enter')) return;




			var totalPages = Number($L('lyte-number.GoTo')[0].ltProp('max'));
			var goTo = Number($L('lyte-number.GoTo')[0].ltProp('value'));


			if (view === 'current') {

				goTo = Math.min(Math.max(goTo, 1), totalPages);
			} else if (view === 'prev') {

				goTo = Math.max(goTo - 1, 1);
			} else if (view === 'next') {

				goTo = Math.min(goTo + 1, totalPages);
			}

			var query = $L('lyte-input.queryInput')[0].ltProp('value').trim();

			if (query.length === 0) {

				$L('lyte-alert.error-response')[0].ltProp('heading', "Couldn't execute");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Problem in executing your query !!");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', `Empty query , enter some valid SQL query to process further`);
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;

			}


			var allowedKeywords = ["CREATE", "SELECT", "UPDATE", "INSERT", "DELETE", "ALTER", "DESCRIBE", "DESC", "SHOW", "DROP"];


			var firstKeyword = query.split(/\s+/)[0].toUpperCase();


			if (!allowedKeywords.includes(firstKeyword)) {

				$L('lyte-alert.error-response')[0].ltProp('heading', "Couldn't execute");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Problem in executing your query !!");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', `Your query may not be allowed to execute or starting part might contain incorrect syntax. Allowed operations are: ${allowedKeywords.join(", ")}`);
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;
			}

			if (firstKeyword === "DROP" && query.split(/\s+/)[1]?.toUpperCase() === "TABLE") {

				$L('lyte-alert.error-response')[0].ltProp('heading', "Couldn't execute");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Problem in executing your query !!");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "Sorry, you cannot drop tables by executing a query. However, you can use the 'Drop' option on the page to remove tables after selecting them.");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;
			}

			if (firstKeyword === "CREATE" && query.split(/\s+/)[1]?.toUpperCase() === "TABLE") {

				$L('lyte-alert.error-response')[0].ltProp('heading', "Couldn't execute");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Problem in executing your query !!");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "Sorry, you cannot create tables by executing a query. However, you can create tables by uploading files with tabular content ");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;
			}

			if (firstKeyword === "CREATE" && query.split(/\s+/)[1]?.toUpperCase() === "DATABASE") {

				$L('lyte-alert.error-response')[0].ltProp('heading', "Couldn't execute");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Problem in executing your query !!");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "Sorry, you are not allowed to create a database.");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;
			}

			if (firstKeyword === "ALTER" && query.split(/\s+/)[1]?.toUpperCase() === "DATABASE") {

				$L('lyte-alert.error-response')[0].ltProp('heading', "Couldn't execute");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Problem in executing your query !!");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "Sorry, you are not allowed to change database structure.");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;
			}

			if (firstKeyword === "DROP" && query.split(/\s+/)[1]?.toUpperCase() === "DATABASE") {
				$L('lyte-alert.error-response')[0].ltProp('heading', "Couldn't execute");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Problem in executing your query !!");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "Sorry, you are not allowed to drop a database.");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;
			}

			if (firstKeyword === "SHOW" && query.split(/\s+/)[1]?.toUpperCase() === "DATABASES") {
				$L('lyte-alert.error-response')[0].ltProp('heading', "Couldn't execute");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Problem in executing your query !!");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "Sorry, you are not allowed to view database details.");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;
			}


			var tableView = store.peekRecord('tableView', 1);
			if (!tableView) {
				console.log('in new tableView 2')
				store.createRecord("tableView", { id: 1 });
				var tableView = store.peekRecord('tableView', 1);
			}


			//query = `?query=${query}`;
			var page = String(goTo);
			return new Promise((resolve, reject) => {



				$L.ajax({
					url: `http://${window.location.hostname}:8080/api/tableData`,
					type: 'post',
					contentType: "application/json",
					data: JSON.stringify({ query: query, page: page }),
					headers: {
						'Authorization': 'Bearer ' + user.token,
						'X-Table-Id': user.tableId,
					},

					processData: false,

					withCredentials: true,
					success: function (response) {

						tableView.$.set('totalPages', response.totalPages);
						tableView.$.set('currentQuery', response.currentQuery);
						tableView.$.set('contentJSON', response.contentJSON);
						tableView.$.set('headerJSON', response.headerJSON);
						tableView.$.set('currentPage', response.currentPage);

						$L('lyte-input.queryInput')[0].ltProp('value', response.currentQuery);

					},
					error: function (response) {
						const message = JSON.parse(response.responseText).message;

						$L('lyte-alert.error-response')[0].ltProp('heading', "Page move failded");
						$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Can't move to another page , try again ");
						$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', message);
						$L('lyte-alert.error-response')[0].ltProp('show', true);

						if (response.status === 401) {
							Lyte.Router.transitionTo('login');
						}
					}
				});
			});
		},


		logout: function () {

			const user = JSON.parse(sessionStorage.getItem("user"));
			if (!user) {
				$L('lyte-alert.error-response')[0].ltProp('heading', "Request failed");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', " Can't send your request ");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "you may not logged in or your session timed out , login again");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				Lyte.Router.transitionTo('login');
				return
			}

			$L.ajax({
				url: `http://${window.location.hostname}:8080/api/logout`,
				type: 'get',
				headers: {
					'Authorization': 'Bearer ' + user.token,
				},
				processData: false,
				contentType: false,
				success: function (response) {

					sessionStorage.removeItem("user");
					$L('lyte-messagebox.success-response')[0].ltProp('message', response.message);
					$L('lyte-messagebox.success-response')[0].ltProp('show', true);
					Lyte.Router.transitionTo('login');
				},
				error: function (response) {
					const message = JSON.parse(response.responseText).message;

					$L('lyte-alert.error-response')[0].ltProp('heading', "Logout failed");
					$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Can't logout , try again");
					$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', message);
					$L('lyte-alert.error-response')[0].ltProp('show', true);
					if (response.status === 401) {
						Lyte.Router.transitionTo('login');
					}
				}
			});
		}

	},
	methods: {


		tablesList: function () {



			const user = JSON.parse(sessionStorage.getItem("user"));
			if (!user) {
				$L('lyte-alert.error-response')[0].ltProp('heading', "Request failed");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', " Can't send your request ");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "you may not logged in or your session timed out , login again");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				Lyte.Router.transitionTo('login');
				return
			}

			var component = this;
			$L.ajax({
				url: `http://${window.location.hostname}:8080/api/userTables`,
				type: 'get',
				headers: {
					'Authorization': 'Bearer ' + user.token,
				},
				processData: false,
				contentType: false,
				success: function (response) {
					//$L('lyte-multi-dropdown.user-drop-tables')[0].ltProp('data', response.tableList);
					console.log(response.tableList);
					// component.setData('dropData', response.tableList);
					//console.log(component.getData('dropData'));

					for (var i = 0; i < response.tableList.length; i++) {
						if (!component.getData('dropData').map(item => item.value).includes(response.tableList[i].value)) {
							Lyte.arrayUtils(component.getData('dropData'), 'push', response.tableList[i]);
						}
					}

					console.log(component.getData('dropData'));


				},
				error: function (response) {

					const message = JSON.parse(response.responseText).message;
					$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', message);
					$L('lyte-alert.error-response')[0].ltProp('show', true);
					if (response.status === 401) {
						Lyte.Router.transitionTo('login');
					}


				}
			});
			return true;
		},







		download: function () {

			document.querySelector('.loading').style.display = 'flex';
			document.querySelector('.page-thing').style.filter = 'brightness(40%)';
			const user = JSON.parse(sessionStorage.getItem("user"));
			if (!user) {
				document.querySelector('.loading').style.display = 'none';
				document.querySelector('.page-thing').style.filter = 'brightness(100%)';
				$L('lyte-alert.error-response')[0].ltProp('heading', "Request failed");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', " Can't send your request ");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "you may not logged in or your session timed out , login again");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				Lyte.Router.transitionTo('login');
				return
			}

			if (!$L('lyte-input.fileName')[0].ltProp('value').trim()) {
				document.querySelector('.loading').style.display = 'none';
				document.querySelector('.page-thing').style.filter = 'brightness(100%)';
				$L('lyte-dropdown.export')[0].ltProp('displayValue', 'select format');
				$L('lyte-alert.error-response')[0].ltProp('heading', "File download failure");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Can't download the file , try again");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "File name shouldn't be left empty !!");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;
			}

			console.log($L('lyte-dropdown.export')[0].ltProp('selected'));


			var query = $L('lyte-input.queryInput')[0].ltProp('value').trim();


			if (query.length === 0) {


				$L('lyte-alert.error-response')[0].ltProp('heading', "Couldn't execute");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Problem in executing your query !!");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', `Empty query , enter some valid SQL query to process further`);
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;


			}


			var allowedKeywords = ["CREATE", "SELECT", "UPDATE", "INSERT", "DELETE", "ALTER", "DESCRIBE", "DESC", "SHOW", "DROP"];


			var firstKeyword = query.split(/\s+/)[0].toUpperCase();


			if (!allowedKeywords.includes(firstKeyword)) {

				document.querySelector('.loading').style.display = 'none';
				document.querySelector('.page-thing').style.filter = 'brightness(100%)';
				$L('lyte-dropdown.export')[0].ltProp('displayValue', 'select format');
				$L('lyte-alert.error-response')[0].ltProp('heading', "Couldn't execute");

				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Problem in executing your query !!");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', `Your query may not be allowed to execute or starting part might contain incorrect syntax. Allowed operations are: ${allowedKeywords.join(", ")}`);
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;
			}

			if (firstKeyword === "DROP" && query.split(/\s+/)[1]?.toUpperCase() === "TABLE") {

				document.querySelector('.loading').style.display = 'none';
				document.querySelector('.page-thing').style.filter = 'brightness(100%)';
				$L('lyte-dropdown.export')[0].ltProp('displayValue', 'select format');
				$L('lyte-alert.error-response')[0].ltProp('heading', "Couldn't execute");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Problem in executing your query !!");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "Sorry, you cannot drop tables by executing a query. However, you can use the 'Drop' option on the page to remove tables after selecting them.");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;
			}

			if (firstKeyword === "CREATE" && query.split(/\s+/)[1]?.toUpperCase() === "TABLE") {

				document.querySelector('.loading').style.display = 'none';
				document.querySelector('.page-thing').style.filter = 'brightness(100%)';
				$L('lyte-dropdown.export')[0].ltProp('displayValue', 'select format');
				$L('lyte-alert.error-response')[0].ltProp('heading', "Couldn't execute");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Problem in executing your query !!");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "Sorry, you cannot create tables by executing a query. However, you can create tables by uploading files with tabular content ");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;
			}

			if (firstKeyword === "CREATE" && query.split(/\s+/)[1]?.toUpperCase() === "DATABASE") {

				document.querySelector('.loading').style.display = 'none';
				document.querySelector('.page-thing').style.filter = 'brightness(100%)';
				$L('lyte-dropdown.export')[0].ltProp('displayValue', 'select format');
				$L('lyte-alert.error-response')[0].ltProp('heading', "Couldn't execute");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Problem in executing your query !!");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "Sorry, you are not allowed to create a database.");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;
			}

			if (firstKeyword === "ALTER" && query.split(/\s+/)[1]?.toUpperCase() === "DATABASE") {
				document.querySelector('.loading').style.display = 'none';
				document.querySelector('.page-thing').style.filter = 'brightness(100%)';
				$L('lyte-dropdown.export')[0].ltProp('displayValue', 'select format');
				$L('lyte-alert.error-response')[0].ltProp('heading', "Couldn't execute");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Problem in executing your query !!");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "Sorry, you are not allowed to change database structure.");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;
			}

			if (firstKeyword === "DROP" && query.split(/\s+/)[1]?.toUpperCase() === "DATABASE") {

				document.querySelector('.loading').style.display = 'none';
				document.querySelector('.page-thing').style.filter = 'brightness(100%)';
				$L('lyte-dropdown.export')[0].ltProp('displayValue', 'select format');
				$L('lyte-alert.error-response')[0].ltProp('heading', "Couldn't execute");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Problem in executing your query !!");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "Sorry, you are not allowed to drop a database.");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;
			}

			if (firstKeyword === "SHOW" && query.split(/\s+/)[1]?.toUpperCase() === "DATABASES") {
				document.querySelector('.loading').style.display = 'none';
				document.querySelector('.page-thing').style.filter = 'brightness(100%)';
				$L('lyte-dropdown.export')[0].ltProp('displayValue', 'select format');
				$L('lyte-alert.error-response')[0].ltProp('heading', "Couldn't execute");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Problem in executing your query !!");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "Sorry, you are not allowed to view database details.");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;
			}





			var fileFormat = $L('lyte-dropdown.export')[0].ltProp('selected');
			var fileName = $L('lyte-input.fileName')[0].ltProp('value');



			return new Promise((resolve, reject) => {


				$L.ajax({
					url: `http://${window.location.hostname}:8080/api/export`,
					type: 'post',
					headers: {
						'Authorization': 'Bearer ' + user.token,
					},
					data: JSON.stringify({ query: query, fileName: fileName, fileFormat: fileFormat }),
					processData: false,
					contentType: "application/json",
					withCredentials: true,
					success: function (response) {

						$L('lyte-input.fileName')[0].ltProp('value', "");
						$L('lyte-dropdown.export')[0].ltProp('displayValue', 'select format');
						const downloadPath = response.downloadedPath; // Get download path from the response

						if (!downloadPath) {
							document.querySelector('.loading').style.display = 'none';
							document.querySelector('.page-thing').style.filter = 'brightness(100%)';
							throw new Error('Download path not provided in the response.');
						}

						// Construct the download URL
						const downloadUrl = `http://${window.location.hostname}:8080/api/download?filePath=${encodeURIComponent(downloadPath)}`;



						fetch(downloadUrl, {
							method: 'GET',
							headers: {
								'Authorization': 'Bearer ' + user.token,
							},
						})
							.then(response => {
								if (!response.ok) {
									throw new Error(`HTTP error! status: ${response.status}`);
								}
								return response.blob();
							})
							.then(blob => {

								const blobUrl = window.URL.createObjectURL(blob);


								const anchor = document.createElement('a');
								anchor.href = blobUrl;


								const fileName = downloadPath.split('/').pop();
								anchor.download = fileName;
								document.body.appendChild(anchor);
								document.querySelector('.loading').style.display = 'none';
								document.querySelector('.page-thing').style.filter = 'brightness(100%)';
								anchor.click();
								document.body.removeChild(anchor);


								window.URL.revokeObjectURL(blobUrl);


								$L('lyte-messagebox.success-response')[0].ltProp('message', "File has been downloaded.");
								$L('lyte-messagebox.success-response')[0].ltProp('show', true);
							})
							.catch(error => {
								console.error('Download failed:', error);
								document.querySelector('.loading').style.display = 'none';
								document.querySelector('.page-thing').style.filter = 'brightness(100%)';

								$L('lyte-alert.error-response')[0].ltProp('heading', "File download failure");
								$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Can't download the file, try again.");
								$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', error.message);
								$L('lyte-alert.error-response')[0].ltProp('show', true);
							});





					},
					error: function (response) {

						$L('lyte-input.fileName')[0].ltProp('value', "");
						$L('lyte-dropdown.export')[0].ltProp('displayValue', 'select format');
						document.querySelector('.loading').style.display = 'none';
						document.querySelector('.page-thing').style.filter = 'brightness(100%)';
						const message = JSON.parse(response.responseText).message;

						$L('lyte-alert.error-response')[0].ltProp('heading', "File download failure");
						$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Can't download the file , try again");
						$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', message);
						$L('lyte-alert.error-response')[0].ltProp('show', true);
						if (response.status === 401) {
							Lyte.Router.transitionTo('login');
						}
					}
				});
			});
		}



	}
});


