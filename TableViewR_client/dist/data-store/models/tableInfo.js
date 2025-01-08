store.registerModel("tableInfo", {


    id: Lyte.attr("number", { primaryKey: true }),
    tableName: Lyte.attr("string"),
    delimiter: Lyte.attr("string"),
    pkColumn: Lyte.attr("number"),
    firstLineRecord: Lyte.attr("boolean"),
    columnCount: Lyte.attr("number"),
    columnNames: Lyte.attr("array"),
    dateFormats: Lyte.attr("array"),
    columnDataTypes: Lyte.attr("array"),
    length1: Lyte.attr("array"),
    length2: Lyte.attr("array")


});
store.registerAdapter("tableInfo", {


    host: `http://${window.location.hostname}:8080/api`,

    headersForRequest: function (type, queryParams, customData, actionName, key) {

        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!user) {
            $L('lyte-alert.error-response')[0].ltProp('heading', "Request failed");
            $L('lyte-alert.error-response')[0].ltProp('primaryMessage', " Can't send your request ");
            $L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "you may not logged in or your session timed out , login again");
            $L('lyte-alert.error-response')[0].ltProp('show', true);
            Lyte.Router.transitionTo('login');
            return
        }

        return {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + user.token,
            'X-Table-Id': user.tableId
        }

    },


}).extends("application");