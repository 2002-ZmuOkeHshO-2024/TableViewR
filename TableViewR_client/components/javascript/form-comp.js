Lyte.Component.register("form-comp", {

    data: function () {

        return {}

    },
    actions: {

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


    }
    ,

    methods: {


        onFileFailure: function (response) {



            const message = JSON.parse(response.responseText).message;
            $L('lyte-alert.error-response')[0].ltProp('heading', "Upload error");
            $L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Failed to upload your file . Please try again");
            $L('lyte-alert.error-response')[0].ltProp('secondaryMessage', message);
            $L('lyte-alert.error-response')[0].ltProp('show', true);


            $L('lyte-fileupload.filedata')[0].ltProp('reset', true);


        },


        onFileSuccess: function (event, fileDetail, element) {


            const user = JSON.parse(sessionStorage.getItem("user"));
            if (!user) {
                $L('lyte-alert.error-response')[0].ltProp('heading', "Request failed");
                $L('lyte-alert.error-response')[0].ltProp('primaryMessage', " Can't send your request ");
                $L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "you may not logged in or your session timed out , login again");
                $L('lyte-alert.error-response')[0].ltProp('show', true);
                Lyte.Router.transitionTo('login');
                return
            }
            var formdata = new FormData();
            formdata.append("fileId", fileDetail.id);
            formdata.append("fileName", fileDetail.name);
            $L.ajax({
                url: `http://${window.location.hostname}:8080/api/mergingChunks`,
                type: 'POST',
                data: formdata,
                headers: {
                    'Authorization': 'Bearer ' + user.token
                },
                withCredentials: true,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log(response.tableId);
                    user.tableId = Number(response.tableId);
                    sessionStorage.setItem("user", JSON.stringify(user));

                    Lyte.Router.transitionTo('home.config');


                },
                error: function (response) {

                    const message = JSON.parse(response.responseText).message;
                    $L('lyte-alert.error-response')[0].ltProp('heading', "Upload error");
                    $L('lyte-alert.error-response')[0].ltProp('primaryMessage', " Can't upload your file , sorry ...  try reuploading ");
                    $L('lyte-alert.error-response')[0].ltProp('secondaryMessage', message);
                    $L('lyte-alert.error-response')[0].ltProp('show', true);
                    if (response.status === 401) {
                        Lyte.Router.transitionTo('login');
                    }

                    $L('lyte-fileupload.filedata')[0].ltProp('reset', true);
                }


            });


        },

        onRemove: function (event, currentItem, component) {


            Lyte.Router.transitionTo('home');
        }

    }

})

