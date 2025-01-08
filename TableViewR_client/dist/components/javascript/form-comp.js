Lyte.Component.register("form-comp", {
_template:"<template class=\"form-container\" tag-name=\"form-comp\"> <div class=\"user-tables\"> <user-comp class=\"user-dropdown\" from-where=\"{{'home'}}\"></user-comp> </div> <div class=\"file-upload\"> <div class=\"file-input\"> <lyte-fileupload class=\"filedata\" lt-prop-yield=\"false\" lt-prop-multiple=\"false\" lt-prop-chunk=\"true\" lt-prop-chunk-size=\"10000000\" on-file-success=\"{{method('onFileSuccess')}}\" on-file-failure=\"{{method('onFileFailure')}}\" on-remove=\"{{method('onRemove')}}\"> </lyte-fileupload> </div> </div> <div class=\"logout\"> <lyte-button lt-prop-class=\"logout-button\" lt-prop-type=\"secondary\" class=\"logout\" onclick=\"{{action('logout')}}\"> <template is=\"registerYield\" yield-name=\"text\"> Logout </template> </lyte-button> </div> <div class=\"modal\" id=\"modal\"> <div class=\"modal-content\" id=\"configPage\"> </div> </div> </template>\n<style> .form-container {\n\n     background-image: url('file-upload.png');\n     background-size: cover;\n     background-position: center;\n     background-repeat: no-repeat;\n\n\n\n     overflow: hidden;\n     display: grid;\n     grid-template-columns: 1fr 1fr 1fr;\n     height: 100vh;\n     width: 100vw;\n     justify-content: center;\n     align-items: center;\n }\n\n .user-tables {\n\n     display: grid;\n     grid-column: 1/2;\n     grid-template-columns: 1fr 2fr 1fr;\n     justify-content: center;\n     align-items: center;\n     height: 100%;\n     width: 100%\n }\n\n .user-dropdown {\n\n     height: 100%;\n     width: 100%;\n     display: grid;\n     grid-template-rows: 4.5fr 1fr 3fr;\n     justify-self: center;\n     align-items: center;\n     grid-column: 2/3;\n\n }\n\n\n\n .usertables {\n\n\n     display: flex;\n     grid-row: 2/3;\n     justify-self: center;\n     align-self: center;\n\n }\n\n\n\n\n\n .logout {\n     display: flex;\n     grid-column: 3/-1;\n     height: 100%;\n     width: 100%;\n     justify-content: end;\n     align-items: start;\n     margin-top: 10px;\n     margin-right: 10px;\n\n\n\n }\n\n\n .file-upload {\n     display: grid;\n     grid-column: 2/3;\n     grid-template-rows: 2fr 4fr;\n     grid-template-columns: 1fr;\n     width: 100%;\n     height: 100%;\n     justify-content: center;\n     align-items: center;\n }\n\n .file-input {\n     display: grid;\n     grid-row: 2/-1;\n     width: 100%;\n     height: 100%;\n     grid-template-rows: 1fr 2fr 1fr;\n     grid-template-columns: 1fr;\n     align-items: center;\n     justify-items: center;\n\n }\n\n .file-input>*:nth-child(1):hover {\n     background-color: rgba(255, 255, 255, 0.15);\n     width: 100%;\n     height: 100%;\n     align-items: center;\n     justify-content: center;\n     /* Apply style to the first row */\n }\n\n .filedata {\n\n\n     display: flex;\n\n\n }\n\n .filedata:hover {\n\n\n     display: flex;\n     box-shadow: 0 0 10px 5px rgba(42, 130, 196, 0.689);\n\n\n }\n\n\n\n .logout-button {\n\n     font-family: \"Arimo\", serif;\n     background-color: #c92614;\n     padding: 10px 30px;\n     border-radius: 100px;\n     font-size: 18px;\n     color: white;\n     border: none\n }\n\n\n\n .logout-button:hover {\n\n     font-weight: 1000;\n     font-family: \"Arimo\", serif;\n     color: rgb(74, 69, 69);\n     padding: 13px 33px;\n     border-radius: 100px;\n     background-color: #ff4e4e;\n     border: none;\n     box-shadow: 5px 5px 10px rgb(0, 0, 0);\n\n }\n\n lyte-drop-button {\n     background: rgba(255, 255, 255, 0.15);\n     color: black;\n }\n\n .lyteDropPlaceholderNormal {\n\n\n     padding: 5px 20px;\n     font-size: 20px;\n     font-style: oblique;\n     color: rgba(140, 242, 255, 0.775);\n\n }\n\n .lyteDropButtonDown {\n\n     background-color: rgba(255, 255, 255, 0.15);\n }\n\n .lyteFileUpdMsgWrap,\n .lyteFileUpdListFile,\n .lyteFileError {\n     width: 100%;\n     height: 100%;\n     background-color: rgba(255, 255, 255, 0.15);\n\n }\n\n .lyteFileUpdMsg {\n\n     font-size: 20px;\n     color: rgba(140, 242, 255, 0.775);\n     font-style: oblique;\n }\n\n lyte-drop-body {\n     background-color: rgb(48, 219, 241);\n\n\n }\n\n .user-dropdown>*:nth-child(1):hover {\n     background-color: rgba(255, 255, 255, 0.15);\n     width: 100%;\n     height: 100%;\n     align-items: center;\n     justify-content: center;\n     box-shadow: 0 0 10px 5px rgba(42, 130, 196, 0.689);\n     /* Apply style to the first row */\n }\n\n\n [id^=\"Lyte_Drop_Item_\"] {\n     background-color: rgba(0, 0, 0, 0);\n     font-style: oblique;\n     color: black\n }\n\n [id^=\"Lyte_Drop_Item_\"]:hover {\n     background-color: rgba(16, 76, 180, 0.811);\n     color: white;\n\n }\n\n lyte-drop-button {\n     width: 100%;\n     height: 100%;\n }\n\n\n .tooltip {\n     position: absolute;\n     display: inline-block;\n     cursor: pointer;\n     padding: 10px 20px;\n     font-size: 16px;\n     border: none;\n     background-color: #007bff;\n     color: white;\n     border-radius: 5px;\n }\n\n\n .tooltip .tooltip-text {\n     visibility: hidden;\n     width: auto;\n     max-width: 200px;\n     background-color: black;\n     color: white;\n     text-align: center;\n     border-radius: 5px;\n     padding: 8px;\n     position: absolute;\n     z-index: 1;\n     bottom: 125%;\n     left: 50%;\n     transform: translateX(-50%);\n     opacity: 0;\n     border: 2px solid white;\n     transition: opacity 0.1s;\n }\n\n\n .tooltip:hover .tooltip-text {\n     visibility: visible;\n     opacity: 1;\n }</style>",
_dynamicNodes : [{"type":"attr","position":[1,1]},{"type":"componentDynamic","position":[1,1]},{"type":"attr","position":[3,1,1]},{"type":"componentDynamic","position":[3,1,1]},{"type":"attr","position":[5,1]},{"type":"registerYield","position":[5,1,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[5,1]}],


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

