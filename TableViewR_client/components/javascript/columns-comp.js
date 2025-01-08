Lyte.Component.register("columns-comp", {


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

