Lyte.Component.register("columns-comp", {
_template:"<template class=\"columns-container\" tag-name=\"columns-comp\"> <div class=\"modal-row1\"> <div class=\"info-name\"> <span class=\"table-label\">Table name : </span> <lyte-input class=\"tableNaam\" lt-prop-value=\"{{tableInfo.tableName}}\" lt-prop-appearance=\"box\" lt-prop-direction=\"horizontal\" lt-prop-placeholder=\"your table name \"> </lyte-input> </div> <div class=\"info-exit\"> <lyte-button class=\"exit\" lt-prop-class=\"exit-button\" onclick=\"{{action('exitConfig')}}\"> <template is=\"registerYield\" yield-name=\"text\"> ✕ </template> </lyte-button> </div> </div> <div class=\"modal-row2\"> <div class=\"primary-key\"> <span class=\"pk-label\">Primary key column index : </span> <lyte-number class=\"pk-column\" lt-prop-max=\"{{tableInfo.columnCount}}\" lt-prop-controls=\"true\"> </lyte-number> </div> <div class=\"checkbox\"> <span class=\"checkbox-label\">File includes headers</span> <lyte-checkbox class=\"headers\" lt-prop-name=\"isFirstLineRecord\" lt-prop-checked=\"{{expHandlers(tableInfo.firstLineRecord,'!')}}\" lt-prop-value=\"val\" onchange=\"{{action('headersChange')}}\"> </lyte-checkbox> </div> </div> <div class=\"modal-row3\"> <span class=\"index\">Index</span> <span class=\"column-name\">Column Names</span> <span class=\"datatype\">Datatypes</span> <span class=\"parameters\"> Parameters</span> </div> <div class=\"modal-row4\"> <template is=\"for\" items=\"{{tableInfo.columnDataTypes}}\" item=\"name\" index=\"index\"> <column-comp class=\"rowX\" idx=\"{{expHandlers(index,'+',1)}}\" column-name=\"{{columnNames[index]}}\" data-type=\"{{name}}\" date-format=\"{{tableInfo.dateFormats[index]}}\" length1=\"{{getNumber(tableInfo.length1[index])}}\" length2=\"{{getNumber(tableInfo.length2[index])}}\"></column-comp> <br> </template> </div> <div class=\"modal-row5\"> <lyte-button lt-prop-type=\"submit\" class=\"submit-button\" lt-prop-class=\"submit-button2\" onclick=\"{{action('sendData')}}\"> <template is=\"registerYield\" yield-name=\"text\"> Create table </template> </lyte-button> </div> </template>\n<style>.modal {\n\n    display: none;\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    background-color: rgba(0, 0, 0, 0.6);\n    justify-content: center;\n    align-items: center;\n    z-index: 10;\n}\n\n.modal-content {\n\n    background-image: url('config.jpg');\n    background-size: cover;\n    background-position: center;\n    background-repeat: no-repeat;\n    filter: brightness(90%);\n\n\n    background-color: white;\n    padding: 30px;\n    border-radius: 5px;\n    width: 60%;\n    height: 80%;\n    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);\n    overflow: hidden;\n}\n\n.columns-container {\n\n\n\n\n    display: grid;\n\n    grid-template-columns: 1fr;\n\n    grid-template-rows: 1fr 0.9fr 0.6fr 10fr 1fr;\n    gap: 2%;\n\n    height: 100%;\n\n    width: 100%;\n\n    margin: 0px;\n    padding: 0px;\n    overflow: hidden;\n\n\n}\n\n.columns-container> :nth-child(4) {\n\n    background-color: rgba(255, 255, 255, 0.25);\n    box-shadow: 0 0 10px 5px rgba(208, 55, 206, 0.3);\n}\n\n.columns-container> :nth-child(4):hover {\n\n    background-color: rgba(255, 255, 255, 0.35);\n    box-shadow: 0 0 10px 5px rgba(208, 55, 206, 0.8);\n}\n\n.modal-row1 {\n    display: grid;\n    grid-row: 1/2;\n    grid-column: 1/2;\n    height: 100%;\n    width: 100%;\n    grid-template-rows: 1fr;\n    grid-template-columns: 8.5fr 1.5fr;\n    justify-content: center;\n    align-items: center;\n    overflow: hidden;\n\n}\n\n.info-name {\n    display: grid;\n    height: 100%;\n    width: 100%;\n    grid-row: 1/2;\n    grid-column: 1/2;\n    grid-template-rows: 1fr;\n    grid-template-columns: 3fr 7fr;\n    justify-content: center;\n    align-self: center;\n}\n\n.table-label {\n\n    display: flex;\n    height: 100%;\n    width: 100%;\n    grid-row: 1/2;\n    grid-column: 1/2;\n    align-items: center;\n    justify-content: center;\n    font-size: 1.3rem;\n    font-weight: 700;\n    color: rgb(216, 160, 244);\n    font-style: oblique;\n\n}\n\n.lyteInputBox input {\n\n\n    color: rgb(0, 0, 0);\n    font-family: \"Outfit\", serif;\n    font-optical-sizing: auto;\n    font-size: 1.17rem;\n    font-weight: 400;\n    background: rgba(255, 255, 255, 0.3);\n\n\n}\n\ninput {\n    color: rgb(0, 0, 0);\n    font-family: \"Kanit\", serif;\n    font-size: 1.17rem;\n    font-weight: 500;\n    background: rgba(255, 255, 255, 0.3);\n\n\n\n\n}\n\n.lyteInputBox:hover input:hover,\n.lyteInputBox input:focus {\n\n\n    color: rgb(0, 0, 0);\n    font-family: \"Kanit\", serif;\n    font-size: 1.17rem;\n    font-weight: 600;\n    background: rgba(255, 255, 255, 0.75);\n\n\n}\n\n\n\n\n\n.tableNaam {\n\n    width: 70%;\n    height: 100%;\n}\n\n.info-exit {\n\n    display: flex;\n    width: 100%;\n    height: 100%;\n    align-items: flex-start;\n    justify-content: flex-end;\n}\n\n\n\n.modal-row2 {\n    display: grid;\n    grid-row: 2/3;\n    grid-column: 1/2;\n    height: 100%;\n    width: 100%;\n    grid-template-rows: 1fr;\n    grid-template-columns: 1fr 1fr;\n    justify-content: center;\n    align-items: center;\n    overflow: hidden;\n}\n\n.primary-key {\n\n    display: grid;\n    height: 100%;\n    width: 100%;\n    grid-row: 1/2;\n    grid-column: 1/2;\n    grid-template-rows: 1fr;\n    grid-template-columns: 2fr 1fr 0.5fr;\n    justify-content: center;\n    align-items: center;\n\n}\n\n.pk-label {\n\n    display: flex;\n    height: 100%;\n    width: 100%;\n    grid-row: 1/2;\n    grid-column: 1/2;\n    align-items: center;\n    justify-content: center;\n    font-weight: 600;\n    font-size: 1.1rem;\n    color: rgb(216, 160, 244);\n    font-style: oblique;\n\n}\n\n.pk-column {\n\n    display: flex;\n    height: 90%;\n    width: 100%;\n    grid-row: 1/2;\n    grid-column: 2/3;\n\n\n}\n\n.checkbox-label {\n\n    display: flex;\n    height: 100%;\n    width: 100%;\n    grid-row: 1/2;\n    grid-column: 2/3;\n    align-items: center;\n    justify-content: start;\n    font-weight: 600;\n    font-size: 1.1rem;\n    color: rgb(216, 160, 244);\n    font-style: oblique;\n\n}\n\n\n.checkbox {\n\n    display: grid;\n    height: 100%;\n    width: 100%;\n    grid-row: 1/2;\n    grid-column: 2/3;\n    grid-template-rows: 1fr;\n    gap: 2%;\n    grid-template-columns: 0.3fr 2fr 2fr;\n    justify-content: center;\n    align-items: center;\n\n}\n\n.headers {\n\n    display: flex;\n    height: 100%;\n    width: 100%;\n    grid-row: 1/2;\n    grid-column: 1/2;\n    align-items: center;\n    justify-content: start;\n\n\n}\n\n\n\n\n.modal-row3 {\n    display: grid;\n    grid-row: 3/4;\n    grid-column: 1/2;\n    height: 100%;\n    width: 100%;\n    grid-template-rows: 1fr;\n    grid-template-columns: 0.4fr 1fr 1fr 1fr;\n    justify-content: center;\n    align-items: center;\n    overflow: hidden;\n\n}\n\n.index,\n.column-name,\n.datatype,\n.parameters {\n\n    display: flex;\n    height: 100%;\n    width: 100%;\n    align-items: center;\n    justify-content: center;\n    font-weight: 600;\n    font-size: 1rem;\n    color: rgb(141, 206, 236);\n    font-style: oblique;\n}\n\n\n\n\n.modal-row4 {\n\n    display: grid;\n    grid-template-rows: repeat(auto-fill, 1fr);\n    grid-template-columns: 1fr;\n    grid-row: 4/5;\n    grid-column: 1/2;\n    height: 100%;\n    width: 100%;\n    overflow-x: hidden;\n    overflow-y: auto;\n}\n\n.rowX {\n\n    display: grid;\n    grid-template-rows: 1fr;\n    grid-template-columns: 0.4fr 1fr 1fr 1fr;\n    height: 100%;\n    width: 100%;\n    align-items: center;\n    justify-content: center;\n\n}\n\n.index2 {\n\n\n    grid-row: 1/2;\n    grid-column: 1/2;\n\n    font-size: 1.25rem;\n    font-weight: bolder;\n    color: rgb(127, 221, 237);\n    font-style: oblique;\n    display: flex;\n    height: 100%;\n    width: 100%;\n    align-items: center;\n    justify-content: center;\n\n}\n\n\n.column-name2 {\n\n    grid-row: 1/2;\n    grid-column: 2/3;\n    display: flex;\n    height: 100%;\n    width: 100%;\n    align-items: center;\n    justify-content: center;\n\n}\n\n\n\n\n.data-type2 {\n\n    grid-row: 1/2;\n    grid-column: 3/4;\n\n    display: flex;\n    flex-direction: column;\n    height: 100%;\n    width: 100%;\n    align-items: center;\n    justify-content: center;\n}\n\n.datatype2 {\n\n\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    height: 100%;\n    width: 90%;\n}\n\n\n[class^=\"format-String_\"] {\n\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    grid-row: 1/2;\n    /* grid-column: 4/5; */\n\n}\n\n[class^=\"numeric-length_\"] {\n\n    display: flex;\n    flex-direction: row;\n    justify-content: center;\n    align-items: center;\n    grid-row: 1/2;\n    grid-column: 4/5;\n    gap: 3%;\n\n\n}\n\n\n[class^=\"length_a_\"] {\n\n    width: 40%\n}\n\n[class^=\"length_b_\"] {\n\n    width: 40%\n}\n\n.modal-row5 {\n    display: flex;\n    grid-column: 1/2;\n    grid-row: 5/6;\n    overflow: hidden;\n    height: 100%;\n    width: 100%;\n    align-items: center;\n    justify-content: flex-end;\n\n}\n\n\n.exit-button {\n\n    display: flex;\n    justify-self: center;\n    font-family: \"Arimo\", serif;\n    background-color: #a83114;\n    font-weight: bold;\n    border-radius: 100px;\n    font-size: 20px;\n    color: white;\n    border: none;\n\n\n\n\n}\n\n.lyteNumberUpArrow,\n.lyteNumberDownArrow {\n\n    width: 15px;\n}\n\n.lyteNumberArrowContainer {\n    background: rgba(255, 255, 255, 0.555);\n}\n\n.exit-button:hover {\n\n    display: flex;\n    justify-self: center;\n    font-family: \"Arimo\", serif;\n    background-color: #ef5858;\n\n    border-radius: 100px;\n    font-size: 26px;\n    font-weight: bolder;\n    color: rgb(8, 6, 6);\n    border: none;\n\n\n\n\n}\n\n\n.submit-button2 {\n\n\n    display: flex;\n    justify-self: center;\n    font-family: \"Arimo\", serif;\n    background-color: #afb509;\n    padding: 10px 25px;\n    border-radius: 100px;\n    font-size: 18px;\n    color: white;\n    border: none;\n\n\n\n\n\n}\n\n.submit-button2:hover {\n\n    font-weight: 1000;\n    font-family: \"Arimo\", serif;\n    color: rgb(74, 69, 69);\n    padding: 13px 28px;\n    border-radius: 100px;\n    background-color: #f3fa76;\n    border: none;\n    box-shadow: -5px 5px 10px rgb(0, 0, 0);\n\n}\n\n/*.info-name {\n\n    grid-column: 1;\n    display: flex;\n    width: 100%;\n    height: 100%;\n    align-self: center;\n    justify-self: center;\n\n}\n\n.info-exit {\n    grid-column: 2;\n    display: flex;\n    width: 100%;\n    height: 100%;\n    align-self: start;\n    justify-self: right;\n\n\n}\n\n\n\n.checkbox1 {\n    grid-column: 1;\n    display: flex;\n    width: 100%;\n    height: 100%;\n    align-self: center;\n    justify-self: center;\n\n\n}\n\n.checkbox2 {\n\n    grid-column: 2;\n    display: flex;\n    width: 100%;\n    height: 100%;\n    align-self: center;\n    justify-self: center;\n\n}\n\n\n\n\n.modal-row3 {\n    display: flex;\n    align-self: center;\n    justify-self: center;\n    grid-row: 3;\n}\n\n.modal-row4 {\n    display: grid;\n    overflow-y: auto;\n    overflow-x: auto;\n    grid-template-rows: repeat(auto-fill, 1fr);\n    grid-row: 4;\n}\n\n.rowX {\n\n    display: grid;\n    grid-template-rows: 100%;\n    grid-template-columns: 40% 40% 10% 10%;\n    width: 100%;\n    height: 100%\n}\n\n.column-name {\n\n\n\n    grid-column: 1/2;\n    width: 100%;\n\n\n}\n\n.data-type {\n\n    grid-column: 2;\n\n\n}\n\n.length-i {\n\n    grid-column: 3;\n\n\n}\n\n.length-ii {\n\n    grid-column: 4;\n\n\n} */</style>",
_dynamicNodes : [{"type":"attr","position":[1,1,3]},{"type":"componentDynamic","position":[1,1,3]},{"type":"attr","position":[1,3,1]},{"type":"registerYield","position":[1,3,1,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[1,3,1]},{"type":"attr","position":[3,1,3]},{"type":"componentDynamic","position":[3,1,3]},{"type":"attr","position":[3,3,3]},{"type":"componentDynamic","position":[3,3,3]},{"type":"attr","position":[7,1]},{"type":"for","position":[7,1],"dynamicNodes":[{"type":"attr","position":[1]},{"type":"componentDynamic","position":[1]}]},{"type":"attr","position":[9,1]},{"type":"registerYield","position":[9,1,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[9,1]}],



    data: function () {
        return {

        }
    },
    actions: {

        headersChange: function () {



            var firstLine = $L('lyte-checkbox.headers')[0].ltProp('checked');
            var elements = document.querySelectorAll('[column-name2]');
            var tableInfo = store.peekRecord('tableInfo', 1);

            console.log(tableInfo.columnNames);

            if (!firstLine) {
                $L.each($L('column-comp'), function (index, element) {


                    $L('lyte-input.columnName2')[index].ltProp('value', 'Column_' + (index + 1));

                });

            } else {
                $L.each($L('column-comp'), function (index, element) {

                    $L('lyte-input.columnName2')[index].ltProp('value', tableInfo.columnNames[index]);

                });
            }





        },

        exitConfig: function () {
            document.getElementById('modal').style.display = 'none';
            $L('lyte-fileupload.filedata')[0].ltProp('reset', true);
            Lyte.Router.transitionTo('home');
        },




        sendData: function () {


            document.querySelector('.page-thing').style.filter = 'brightness(40%)';
            document.querySelector('.loading').style.display = 'flex';

            $L('lyte-button.submit-button')[0].ltProp('disabled', true);

            var data = {};
            data.tableName = $L('lyte-input.tableNaam')[0].ltProp('value');
            data.firstLineRecord = !($L('lyte-checkbox.headers')[0].ltProp('checked'));
            data.columnCount = store.peekRecord('tableInfo', 1).columnCount;
            data.delimiter = store.peekRecord('tableInfo', 1).delimiter;

            if (!$L('lyte-number.pk-column')[0].ltProp('value')) {
                data.pkColumn = -1;
            }
            else {
                data.pkColumn = Number($L('lyte-number.pk-column')[0].ltProp('value'));
            }

            console.log("pkColumn: " + Number($L('lyte-number.pk-column')[0].ltProp('value')))

            let columnNames = [], dataTypes = [], len1 = [], len2 = [], dateFormats = [];
            $L.each($L('column-comp'), function (index, element) {



                columnNames[index] = $L('lyte-input.columnName2')[index].ltProp('value');
                dataTypes[index] = $L('lyte-dropdown.datatype2')[index].ltProp('selected');
                len1[index] = $L('lyte-number.length1')[index].ltProp('value');
                len2[index] = $L('lyte-number.length2')[index].ltProp('value');
                dateFormats[index] = $L('lyte-input.dateformat')[index].ltProp('value');

            });
            console.log("param 1 :" + len1);
            console.log("param 2 :" + len2);

            if (new Set(columnNames).size !== columnNames.length) {
                document.querySelector('.loading').style.display = 'none';
                document.querySelector('.page-thing').style.filter = 'brightness(100%)';
                $L('lyte-button.submit-button')[0].ltProp('disabled', false);
                $L('lyte-alert.error-response')[0].ltProp('heading', "Table creation error");
                $L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Can't create a table with uploaded file content , sorry");
                $L('lyte-alert.error-response')[0].ltProp('secondaryMessage', 'Duplicate column names not allowed. Use unique column names');
                $L('lyte-alert.error-response')[0].ltProp('show', true);
                return
            }

            if (columnNames.includes(data.tableName)) {
                document.querySelector('.loading').style.display = 'none';
                document.querySelector('.page-thing').style.filter = 'brightness(100%)';
                $L('lyte-button.submit-button')[0].ltProp('disabled', false);
                $L('lyte-alert.error-response')[0].ltProp('heading', "Table creation error");
                $L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Can't create a table with uploaded file content , sorry");
                $L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "Don't use a table name as a column name , to remove ambiguity");
                $L('lyte-alert.error-response')[0].ltProp('show', true);
                return
            }

            let paramError = false;

            for (let i = 0; i < len1.length; i++) {
                if (Number(len1[i]) < Number(len2[i])) {
                    paramError = true;
                    break;
                }
            }

            if (paramError) {
                document.querySelector('.loading').style.display = 'none';
                document.querySelector('.page-thing').style.filter = 'brightness(100%)';
                $L('lyte-button.submit-button')[0].ltProp('disabled', false);
                $L('lyte-alert.error-response')[0].ltProp('heading', "Table creation error");
                $L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Can't create a table with uploaded file content , sorry");
                $L('lyte-alert.error-response')[0].ltProp('secondaryMessage', 'Precision should be greater than or equal to scale for a DECIMAL type');
                $L('lyte-alert.error-response')[0].ltProp('show', true);
                return;
            }

            for (let i = 0; i < len1.length; i++) {
                if (dataTypes[i] === 'VARCHAR' && Number(len1[i]) < 1) {
                    paramError = true;
                    break;
                }
            }

            if (paramError) {
                document.querySelector('.loading').style.display = 'none';
                document.querySelector('.page-thing').style.filter = 'brightness(100%)';
                $L('lyte-button.submit-button')[0].ltProp('disabled', false);
                $L('lyte-alert.error-response')[0].ltProp('heading', "Table creation error");
                $L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Can't create a table with uploaded file content , sorry");
                $L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "Parameter can't be less than 1 for a VARCHAR type");
                $L('lyte-alert.error-response')[0].ltProp('show', true);
                return;
            }


            for (let i = 0; i < len1.length; i++) {
                if (dataTypes[i] === 'DECIMAL' && (Number(len1[i]) < 1 || Number(len2[i]) < 0)) {
                    paramError = true;
                    break;
                }
            }

            if (paramError) {
                document.querySelector('.loading').style.display = 'none';
                document.querySelector('.page-thing').style.filter = 'brightness(100%)';
                $L('lyte-button.submit-button')[0].ltProp('disabled', false);
                $L('lyte-alert.error-response')[0].ltProp('heading', "Table creation error");
                $L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Can't create a table with uploaded file content , sorry");
                $L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "Precision shouldn't be less than 1 and Scale shouldn't  be less than 0 for a DECIMAL type.");
                $L('lyte-alert.error-response')[0].ltProp('show', true);
                return;
            }

            data.columnDataTypes = dataTypes;
            data.columnNames = columnNames;
            data.dateFormats = dateFormats;
            data.length1 = len1;
            data.length2 = len2;

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
            var formdata = new FormData();
            formdata.append("tableInfo", JSON.stringify(store.peekRecord("tableInfo", 1)));
            const tableInfoWrapper = {
                tableInfo: data
            };
            $L.ajax({
                url: `http://${window.location.hostname}:8080/api/tableInfo`,
                type: 'POST',
                data: JSON.stringify(tableInfoWrapper),
                headers: {

                    'Authorization': 'Bearer ' + user.token,
                    'X-Table-Id': user.tableId,
                },
                withCredentials: true,
                processData: false,
                contentType: "application/json",
                success: function (response) {
                    $L('lyte-button.submit-button')[0].ltProp('disabled', false);
                    $L('lyte-messagebox.success-response')[0].ltProp('message', response.message);
                    $L('lyte-messagebox.success-response')[0].ltProp('show', true);
                    console.log("hi in after table successfully created");
                    Lyte.Router.transitionTo('table');
                    console.log("should be  table route");
                },
                error: function (response) {

                    document.querySelector('.loading').style.display = 'none';
                    document.querySelector('.page-thing').style.filter = 'brightness(100%)';
                    $L('lyte-button.submit-button')[0].ltProp('disabled', false);
                    const message = JSON.parse(response.responseText).message;
                    console.log(message);
                    $L('lyte-alert.error-response')[0].ltProp('heading', "Table creation error");
                    $L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Can't create a table with uploaded file content , sorry");
                    $L('lyte-alert.error-response')[0].ltProp('secondaryMessage', message);
                    $L('lyte-alert.error-response')[0].ltProp('show', true);

                    if (response.status === 401) {
                        Lyte.Router.transitionTo('login');
                    }


                    $L('lyte-fileupload.filedata')[0].ltProp('reset', true);

                }
            });
        }

    },


    methods: {



    }
});

