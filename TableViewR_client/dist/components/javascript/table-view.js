Lyte.Component.register("table-view", {
_template:"<template class=\"table-container\" tag-name=\"table-view\"> <div class=\"options\"> <div class=\"table-list\"> <user-comp from-where=\"{{'table'}}\"></user-comp> </div> <div class=\"delete-option\"> <lyte-button lt-prop-class=\"dropbutton\" onclick=\"{{action('deleteTables')}}\"> <template is=\"registerYield\" yield-name=\"text\"> Drop </template> </lyte-button> <lyte-multi-dropdown class=\"user-drop-tables\" lt-prop-data=\"{{dropData}}\" lt-prop-user-value=\"name\" lt-prop-system-value=\"value\" on-before-show=\"{{method('tablesList')}}\" lt-prop-placeholder=\"select to drop tables\"> </lyte-multi-dropdown> </div> <div class=\"download-option\"> <div class=\"file-name\"> <lyte-input class=\"fileName\" lt-prop-id=\"filename\" lt-prop-direction=\"horizontal\" lt-prop-appearance=\"box\" lt-prop-placeholder=\"file name\" required=\"\"> </lyte-input> </div> <div class=\"file-format\"> <lyte-dropdown lt-prop-placeholder=\"select format\" class=\"export\" lt-prop-options=\"{{fileFormats}}\" on-option-selected=\"{{method('download')}}\" lt-prop-user-value=\"name\" lt-prop-type=\"checkbox\" lt-prop-system-value=\"value\"> </lyte-dropdown> </div> </div> <div class=\"logout1\"> <lyte-button lt-prop-class=\"logout-button\" lt-prop-type=\"secondary\" class=\"logout\" onclick=\"{{action('logout')}}\"> <template is=\"registerYield\" yield-name=\"text\"> Logout </template> </lyte-button> </div> </div> <div class=\"table\"> <div class=\"query-element\"> <div class=\"query-label\"> SQL query </div> <div class=\"query1-element\"> <lyte-input class=\"queryInput\" lt-prop-type=\"textarea\" lt-prop-value=\"{{tableView.currentQuery}}\" lt-prop-text-area-resize=\"{&quot;horizontal&quot; : true, &quot;vertical&quot; : true }\" lt-prop-placeholder=\"Enter your query\"></lyte-input> </div> <div class=\"executebutton\"> <lyte-button lt-prop-class=\"execute-button\" onclick=\"{{action('executeQuery')}}\"> <template is=\"registerYield\" yield-name=\"text\"> execute </template> </lyte-button> </div> </div> <div class=\"tableview\"> <div class=\"table1-view\"> <lyte-table class=\"table2-view\" lt-prop-header=\"{{tableView.headerJSON}}\" lt-prop-content=\"{{tableView.contentJSON}}\" lt-prop-header-label-key=\"name\" lt-prop-body-label-key=\"body\"> </lyte-table> </div> <div class=\"border\"> <div class=\"pagination\"> <div class=\"prev\"> <lyte-button lt-prop-class=\"prev-button\" onclick=\"{{action('goto','prev',event)}}\"> <template is=\"registerYield\" yield-name=\"text\"> <span class=\"prev-arrow\"> ⇽ </span> </template> </lyte-button> </div> <div class=\"view\"> <lyte-number lt-prop-direction=\"horizontal\" lt-prop-min=\"1\" lt-prop-max=\"{{tableView.totalPages}}\" class=\"GoTo\" lt-prop-value=\"{{tableView.currentPage}}\" onkeydown=\"{{action('goto','current',event)}}\"></lyte-number> </div> <div class=\"next\"> <lyte-button lt-prop-class=\"next-button\" onclick=\"{{action('goto','next',event)}}\"> <template is=\"registerYield\" yield-name=\"text\"> <span class=\"next-arrow\">⇾</span> </template> </lyte-button> </div> </div> <div class=\"add-option\"> <lyte-button lt-prop-class=\"add-button\" onclick=\"{{action('fileUpload')}}\"> <template is=\"registerYield\" yield-name=\"text\"> Add Table </template> </lyte-button> </div> </div> </div> </div> </template>\n<style>/* General Fixes and Updates */\n.table-container {\n\n\n    background-image: url('table-view.png');\n    background-size: cover;\n    background-position: center;\n    background-repeat: no-repeat;\n\n\n\n    display: grid;\n    grid-template-rows: 1fr 10fr;\n    grid-template-columns: 1fr;\n    gap: 1%;\n    height: 100vh;\n    width: 100vw;\n    justify-content: center;\n    align-items: center;\n    overflow: hidden;\n}\n\n.table {\n\n    display: grid;\n    grid-template-rows: 1fr;\n    grid-template-columns: 2fr 10fr;\n    grid-row: 2/3;\n    grid-column: 1/2;\n    gap: 1.5%;\n    height: 100%;\n    width: 100%;\n    justify-content: center;\n    align-items: center;\n    overflow: hidden;\n\n}\n\n\n.table> :nth-child(1):hover {\n\n    background-color: rgba(255, 255, 255, 0.15);\n    box-shadow: 0 0 10px 5px rgba(42, 130, 196, 0.689);\n}\n\n\n\n.query-element {\n\n    display: grid;\n    grid-row: 1/2;\n    grid-column: 1/2;\n    height: 100%;\n    width: 100%;\n    grid-template-rows: 0.7fr 11.5fr 1fr;\n    grid-template-columns: 1fr;\n    justify-content: center;\n    align-items: center;\n    margin-left: 10px;\n\n\n}\n\n\n.query-label {\n\n    border: 1px solid rgb(110, 195, 223);\n    padding: 7px 70px;\n    grid-row: 1/2;\n    display: flex;\n    align-self: flex-start;\n    justify-self: center;\n    font-size: 20px;\n    color: rgb(122, 230, 245);\n\n}\n\n.query1-element {\n\n    display: flex;\n    grid-row: 2/3;\n    grid-column: 1/2;\n    height: 100%;\n    width: 100%;\n\n\n}\n\n.queryInput {\n\n\n    height: 100%;\n    width: 100%;\n\n\n}\n\n\n.executebutton {\n\n    display: flex;\n    grid-row: 3/-1;\n    grid-column: 1/2;\n    height: 100%;\n    width: 100%;\n    align-items: center;\n    justify-content: center;\n\n\n\n\n}\n\n\n.execute-button {\n\n    font-family: \"Arimo\", serif;\n    background-color: #6f1660;\n    padding: 10px 30px;\n    border-radius: 100px;\n    font-size: 18px;\n    color: white;\n    border: none\n}\n\n.execute-button:hover {\n\n\n    font-weight: 1000;\n    font-family: \"Arimo\", serif;\n    color: rgb(74, 69, 69);\n    padding: 13px 33px;\n    border-radius: 100px;\n    background-color: #e36ad7;\n    border: none;\n    box-shadow: -5px 5px 10px rgb(0, 0, 0);\n\n\n\n\n}\n\n.tableview {\n\n    display: grid;\n    grid-column: 2/-1;\n    grid-template-rows: 12fr 1fr;\n    grid-template-columns: 1fr;\n    height: 100%;\n    width: 100%;\n    align-items: center;\n    justify-content: center;\n    overflow: hidden;\n\n}\n\n\n\n\n.table1-view {\n\n\n    height: 100%;\n    width: 100%;\n    grid-row: 1/2;\n    grid-column: 1/2;\n\n    overflow-y: auto;\n    overflow-x: auto;\n\n}\n\n.table2-view {\n\n\n\n    margin-right: 1%;\n}\n\n.border {\n\n    display: grid;\n    grid-row: 2/-1;\n    grid-column: 1/2;\n    grid-template-rows: 1fr;\n    grid-template-columns: 3fr 1fr;\n    height: 100%;\n    width: 100%;\n    align-items: center;\n    justify-content: center;\n\n    overflow: hidden;\n\n}\n\n\n.add-option {\n\n    display: flex;\n    grid-column: 2/3;\n    grid-row: 1/2;\n    justify-content: center;\n    align-items: flex-start;\n    width: 100%;\n    height: 100%;\n    margin-top: 22px;\n    margin-right: 10px;\n}\n\n\n.add-button {\n\n\n    font-family: \"Arimo\", serif;\n    background-color: #0f6207;\n    padding: 10px 30px;\n    border-radius: 100px;\n    font-size: 18px;\n    color: white;\n    border: none;\n}\n\n.add-button:hover {\n\n    font-weight: 1000;\n    font-family: \"Arimo\", serif;\n    color: rgb(74, 69, 69);\n    padding: 13px 33px;\n    border-radius: 100px;\n    background-color: #84ec69;\n    border: none;\n    box-shadow: 5px 5px 10px rgb(0, 0, 0);\n\n}\n\n\n\n\n.logout1 {\n    display: flex;\n    grid-column: 4/-1;\n    grid-row: 1/2;\n    justify-self: center;\n    align-self: center;\n    width: 100%;\n    height: 100%;\n}\n\n.pagination {\n\n    display: grid;\n    grid-row: 1/2;\n    grid-column: 1/2;\n    grid-template-rows: 1fr;\n    grid-template-columns: 3fr 1fr 0.8fr 1fr 1fr;\n    gap: 1%;\n    height: 100%;\n    width: 100%;\n    align-items: center;\n    justify-content: center;\n\n}\n\n\n\n.prev {\n\n    display: flex;\n    align-self: center;\n    justify-self: flex-end;\n    grid-column: 2/3;\n\n\n}\n\n.view {\n\n    display: flex;\n    align-self: center;\n    justify-self: center;\n    grid-column: 3/4;\n\n}\n\n\n.next {\n\n    display: flex;\n    align-self: center;\n    justify-self: flex-start;\n    grid-column: 4/5;\n\n\n}\n\n.next-button,\n.prev-button {\n\n    padding: 0px 20px;\n    background-color: #3b36d8c1;\n}\n\n.next-button:hover {\n\n    padding-right: 30px;\n    background-color: #6dd4f0;\n\n\n\n}\n\n.prev-button:hover {\n\n    padding-left: 30px;\n    background-color: #83d7ee;\n}\n\n.prev-arrow,\n.next-arrow {\n\n    font-size: 32px;\n    font-weight: bold;\n    color: #4390ac;\n    font-family: Arial, sans-serif;\n\n}\n\n.prev-button:hover,\n.next-button:hover,\n.prev-arrow:hover,\n.next-arrow:hover {\n    font-stretch: expanded;\n    font-weight: bolder;\n    color: #080d55;\n    font-family: Arial, sans-serif;\n}\n\n.options {\n    display: grid;\n    width: 100%;\n    height: 100%;\n    gap: 2%;\n    grid-row: 1/2;\n    grid-template-columns: 1.5fr 2fr 2.456fr 1fr;\n    grid-template-rows: 1fr;\n    justify-content: center;\n    align-items: center;\n}\n\n.table-list {\n\n    display: flex;\n    width: 100%;\n    height: 100%;\n    grid-row: 1/2;\n    grid-column: 1/2;\n    justify-content: center;\n    align-items: center;\n\n\n}\n\n\n.options> :nth-child(1):hover {\n\n    background-color: rgba(255, 255, 255, 0.15);\n    box-shadow: 0 0 10px 5px rgba(42, 130, 196, 0.689);\n}\n\n\n\n.options> :nth-child(3):hover {\n    width: 100%;\n    background-color: rgba(255, 255, 255, 0.15);\n    box-shadow: 0 0 10px 5px rgba(42, 130, 196, 0.689);\n}\n\n\n.delete-option {\n\n\n    width: 100%;\n    height: 100%;\n    grid-row: 1/2;\n    grid-column: 2/3;\n    display: grid;\n    gap: 2%;\n    grid-template-columns: 1fr 3fr;\n    justify-content: center;\n    align-items: center;\n\n}\n\n.download-option {\n\n    display: grid;\n    grid-row: 1/2;\n    grid-column: 3/4;\n    width: 100%;\n    height: 100%;\n    gap: 1%;\n    grid-template-columns: 2fr 1fr;\n    grid-template-rows: 1fr;\n    justify-content: center;\n    align-items: center;\n\n}\n\n.file-name {\n\n    display: flex;\n    width: 100%;\n    height: 100%;\n    justify-content: flex-end;\n    align-items: center;\n\n\n}\n\n#filename {\n    display: flex;\n    background-color: rgba(0, 0, 0, 0.6);\n    font-size: 17px;\n    color: rgb(227, 229, 230);\n    height: 100%;\n    width: 100%;\n    padding: 11px 50px;\n    font-style: oblique;\n    align-self: center;\n    justify-self: center;\n}\n\n#filename:focus {\n    box-shadow: 0 0 10px 5px rgba(42, 130, 196, 0.689);\n}\n\n.user-drop-tables {\n    display: flex;\n    justify-self: center;\n    align-self: center;\n    width: 100%;\n}\n\n\n#lyteMultiDropButton0 {\n\n    padding: 10px 60px;\n}\n\n.lyteDropPlaceholderMultiple {\n\n\n    font-size: 18px;\n    padding: 10px 60px;\n    color: rgba(140, 242, 255, 0.775);\n    font-style: oblique;\n\n}\n\n\n.dropbutton {\n\n    display: flex;\n    justify-self: center;\n    font-family: \"Arimo\", serif;\n    background-color: #965506;\n    padding: 10px 30px;\n    border-radius: 100px;\n    font-size: 18px;\n    color: white;\n    border: none;\n\n\n}\n\n.dropbutton:hover {\n\n    font-weight: 1000;\n    font-family: \"Arimo\", serif;\n    color: rgb(74, 69, 69);\n    padding: 13px 33px;\n    border-radius: 100px;\n    background-color: #efad61;\n    border: none;\n    box-shadow: -5px 5px 10px rgb(0, 0, 0);\n\n}\n\n\n.lyteDropdownLabel {\n\n    padding: 4px 10px;\n    font-size: 1.2rem;\n    color: rgb(4, 226, 255);\n    font-style: oblique;\n\n\n\n\n}\n\n\nlyte-input textarea {\n\n    color: rgb(0, 0, 0);\n    font-family: \"Nunito\", serif;\n    font-optical-sizing: auto;\n    font-size: 20px;\n    font-weight: 700;\n    padding: 10px;\n    background: rgba(255, 255, 255, 0.2);\n    margin-left: 5px;\n    min-width: 18vw;\n    min-height: 78.5vh;\n    max-height: 78.5vh;\n    max-width: 50vw;\n    resize: horizontal;\n    box-sizing: border-box;\n    width: 100%;\n    height: 100%;\n\n    /* Allow resizing only horizontally */\n\n}\n\nlyte-input textarea:focus {\n\n    color: rgb(0, 0, 0);\n    font-family: \"Nunito\", serif;\n    font-optical-sizing: auto;\n    font-size: 20px;\n    font-weight: 800;\n    background: rgba(255, 255, 255, 0.5);\n    min-width: 18vw;\n    min-height: 78.5vh;\n    max-height: 78.5vh;\n    max-width: 50vw;\n    resize: horizontal;\n    box-sizing: border-box;\n    width: 100%;\n    height: 100%;\n}\n\n\n\n\n\n\n\nlyte-table {\n\n    font-weight: bold;\n    color: white;\n\n}\n\n\nlyte-th {\n\n    background: rgb(4, 111, 234);\n\n}\n\nlyte-tbody {\n\n    background: rgba(164, 26, 26, 0);\n\n}\n\n\nlyte-table-structure {\n\n\n    background: rgba(23, 215, 236, 0);\n\n\n}\n\n\nlyte-td {\n\n    background: rgba(6, 109, 227, 0.6);\n    color: white;\n\n}\n\n\nlyte-tbody:hover {\n\n    background: rgb(45, 198, 225);\n\n}</style>",
_dynamicNodes : [{"type":"attr","position":[1,1,1]},{"type":"componentDynamic","position":[1,1,1]},{"type":"attr","position":[1,3,1]},{"type":"registerYield","position":[1,3,1,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[1,3,1]},{"type":"attr","position":[1,3,3]},{"type":"componentDynamic","position":[1,3,3]},{"type":"componentDynamic","position":[1,5,1,1]},{"type":"attr","position":[1,5,3,1]},{"type":"componentDynamic","position":[1,5,3,1]},{"type":"attr","position":[1,7,1]},{"type":"registerYield","position":[1,7,1,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[1,7,1]},{"type":"attr","position":[3,1,3,1]},{"type":"componentDynamic","position":[3,1,3,1]},{"type":"attr","position":[3,1,5,1]},{"type":"registerYield","position":[3,1,5,1,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[3,1,5,1]},{"type":"attr","position":[3,3,1,1]},{"type":"componentDynamic","position":[3,3,1,1]},{"type":"attr","position":[3,3,3,1,1,1]},{"type":"registerYield","position":[3,3,3,1,1,1,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[3,3,3,1,1,1]},{"type":"attr","position":[3,3,3,1,3,1]},{"type":"componentDynamic","position":[3,3,3,1,3,1]},{"type":"attr","position":[3,3,3,1,5,1]},{"type":"registerYield","position":[3,3,3,1,5,1,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[3,3,3,1,5,1]},{"type":"attr","position":[3,3,3,3,1]},{"type":"registerYield","position":[3,3,3,3,1,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[3,3,3,3,1]}],
_observedAttributes :["dropData","selectedData","fileFormats"],

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


