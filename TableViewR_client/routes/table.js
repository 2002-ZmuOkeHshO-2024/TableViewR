Lyte.Router.registerRoute("table", {
    // 	getResources  : function (paramsObject ){ 
    //         /* View related files should be returned as resources(HTML, CSS, components etc). It will be available before 'renderTemplate' hook. */
    // },
    // getDependencies  : function (paramsObject ){ 
    //         /* Files returned as dependencies will be downloaded at once and will be available before 'beforeModel' hook. */
    // },
    // beforeModel  : function (paramsObject ){ 
    //         /* Pre processing stage where you can decide whether to abort/redirect the current transition(e.g Permission check). */
    // },
    model: function (paramsObject) {



        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!user) {
            $L('lyte-alert.error-response')[0].ltProp('heading', "Request failed");
            $L('lyte-alert.error-response')[0].ltProp('primaryMessage', " Can't send your request ");
            $L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "you may not logged in or your session timed out , login again");
            $L('lyte-alert.error-response')[0].ltProp('show', true);
            Lyte.Router.transitionTo('login');
            return
        }

        if (user.tableId === -1) {
            $L('lyte-alert.error-response')[0].ltProp('heading', "Request failed");
            $L('lyte-alert.error-response')[0].ltProp('primaryMessage', " Can't send your request ");
            $L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "you didn't selected any table to view");
            $L('lyte-alert.error-response')[0].ltProp('show', true);
            Lyte.Router.transitionTo('home');
            return
        }

        return new Promise((resolve, reject) => {



            var tableView = store.peekRecord('tableView', 1);
            if (!tableView) {
                console.log("in new tableView");
                store.createRecord("tableView", { id: 1 });
                var tableView = store.peekRecord('tableView', 1);
            }

            var query = '';
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

                    document.querySelector('.loading').style.display = 'none';
                    document.querySelector('.page-thing').style.filter = 'brightness(100%)';
                    tableView.$.set('totalPages', response.totalPages);
                    tableView.$.set('currentQuery', response.currentQuery);
                    tableView.$.set('contentJSON', response.contentJSON);
                    tableView.$.set('headerJSON', response.headerJSON);
                    tableView.$.set('currentPage', response.currentPage);
                    console.log("tableId :" + response.tableId);

                    resolve({
                        'tableView': tableView,
                    });
                },
                error: function (response) {

                    const message = JSON.parse(response.responseText).message;

                    $L('lyte-alert.error-response')[0].ltProp('heading', "Can't view table");
                    $L('lyte-alert.error-response')[0].ltProp('primaryMessage', "You didn't selected any available tables to view or recently uploaded file failed to createas table");
                    $L('lyte-alert.error-response')[0].ltProp('secondaryMessage', message);
                    $L('lyte-alert.error-response')[0].ltProp('show', true);

                    if (response.status === 401) {
                        Lyte.Router.transitionTo('login');
                    }

                    document.getElementById('modal').style.display = 'none';
                    $L('lyte-fileupload.filedata')[0].ltProp('reset', true);
                    Lyte.Router.transitionTo('home');
                }
            });
        });
    },
    afterModel: function (model, paramsObject) {

    },
    // redirect  : function (model, paramsObject ){ 
    //         /* Redirections based on data fetched. */
    // },
    renderTemplate: function (model, paramsObject) {
        return { outlet: "#outlet", component: "table-view" }
    },
    // afterRender  : function (model, paramsObject ){ 
    //         /* Post processing of rendered page. */
    // },
    // beforeExit  : function (model, paramsObject ){ 
    //         /* Will be invoked before a route is removed from view. */
    // },
    // didDestroy  : function (model, paramsObject ){ 
    //         /* Will be invoked when a route is completly destroyed(remove residues of route. eg: file cache removal). */
    // },
    // actions  : { 
    //        onBeforeLoad  : function (paramsObject ){ 
    //                 /* Triggered once route transition starts. */
    //         },
    //        onError  : function (error, pausedTrans, paramsObject ){ 
    //                 /* Triggered by error on file load or on data request. */
    //         },
    //        willTransition  : function (transition ){ 
    //                 /* Triggered before a transition is going to change. */
    //         },
    //        didTransition  : function (paramsObject ){ 
    //                 /* Triggered after completion of transition. */
    //         },
    // }
});
