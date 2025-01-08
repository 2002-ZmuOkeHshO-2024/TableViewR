Lyte.Router.registerRoute('home.config', {
    // 	getResources  : function (paramsObject ){ 
    //         /* View related files should be returned as resources(HTML, CSS, components etc). It will be available before 'renderTemplate' hook. */
    // },
    // getDependencies  : function (paramsObject ){ 
    //         /* Files returned as dependencies will be downloaded at once and will be available before 'beforeModel' hook. */
    // },

    // beforeRender: function (model, paramsObject) {
    //     document.getElementById('modal').style.display = 'flex';
    // },
    // beforeModel: function (paramsObject) {
    //     document.getElementById('modal').style.display = 'flex';
    // },
    model: function () {

        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user.tableId === -1) {
            $L('lyte-alert.error-response')[0].ltProp('heading', "Request failed");
            $L('lyte-alert.error-response')[0].ltProp('primaryMessage', " Can't send your request ");
            $L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "you didn't uploaded any file to config");
            $L('lyte-alert.error-response')[0].ltProp('show', true);
            Lyte.Router.transitionTo('home');
            return
        }

        return store.findAll("tableInfo").then(function (records) {

        }, function (response) {

            const message = JSON.parse(response.responseText).message;

            $L('lyte-alert.error-response')[0].ltProp('heading', "Upload failed");
            $L('lyte-alert.error-response')[0].ltProp('primaryMessage', " Can't process the uploaded file ");
            $L('lyte-alert.error-response')[0].ltProp('secondaryMessage', message);
            $L('lyte-alert.error-response')[0].ltProp('show', true);

            $L('lyte-fileupload.filedata')[0].ltProp('reset', true);
            Lyte.Router.transitionTo('home');

        });

    },
    afterModel: function (model, paramsObject) {

        var tableInfo = store.peekRecord('tableInfo', 1);
        var columns = [];
        if (tableInfo.firstLineRecord) {

            for (var i = 1; i <= tableInfo.columnCount; i++) {
                columns[i - 1] = "Column_" + i;
            }
        } else {
            columns = tableInfo.columnNames;
        }

        this.currentModel = { "tableInfo": tableInfo, "columnNames": columns };

    },
    // redirect  : function (model, paramsObject ){ 
    //         /* Redirections based on data fetched. */
    // },
    renderTemplate: function () {

        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!user) {
            $L('lyte-alert.error-response')[0].ltProp('heading', "Request failed");
            $L('lyte-alert.error-response')[0].ltProp('primaryMessage', " Can't send your request ");
            $L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "you may not logged in or your session timed out , login again");
            $L('lyte-alert.error-response')[0].ltProp('show', true);
            Lyte.Router.transitionTo('login');
            return
        }

        return { outlet: "#configPage", component: "columns-comp" }
    },
    afterRender: function (model, paramsObject) {
        document.getElementById('modal').style.display = 'flex';
        document.addEventListener("DOMContentLoaded", function () {
            const rows = document.querySelectorAll(".rowX");

            rows.forEach((row, index) => {
                // Dynamically assign grid-row based on index (starting from 1)
                row.style.gridRow = index + 1; // +1 because CSS grid uses 1-based index
            });
        });

    },
    // beforeExit  : function (model, paramsObject ){ 
    //         /* Will be invoked before a route is removed from view. */
    // },
    // didDestroy  : function (model, paramsObject ){ 
    //         /* Will be invoked when a route is completly destroyed(remove residues of route. eg: file cache removal). */
    // },

    actions: {


        onBeforeLoad: function (paramsObject) {
            /* Triggered once route transition starts. */
        },
        onError: function (error, pausedTrans, paramsObject) {
            /* Triggered by error on file load or on data request. */
        },
        willTransition: function (transition) {
            /* Triggered before a transition is going to change. */
        },
        didTransition: function (paramsObject) {
            /* Triggered after completion of transition. */
        },
    }
});
