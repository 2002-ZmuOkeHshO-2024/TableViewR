//Lyte.Router.configureDefaults({ baseURL: '', history: "html5" });
//loader
Lyte.Router.configureRoutes(function () {
	this.route('index', { path: '/' });
	this.route('home', {}, function () {
		this.route('config');
	});

	this.route("login");
	this.route("table");

	this.route("register");
});

Lyte.Router.beforeRouteTransition = function () {

}

Lyte.Router.afterRouteTransition = function () {
	//console.log('after Route Change');
}


Lyte.Router.registerRoute("login", {
    // 	getResources  : function (paramsObject ){ 
    //         /* View related files should be returned as resources(HTML, CSS, components etc). It will be available before 'renderTemplate' hook. */
    // },
    // getDependencies  : function (paramsObject ){ 
    //         /* Files returned as dependencies will be downloaded at once and will be available before 'beforeModel' hook. */
    // },
    // beforeModel  : function (paramsObject ){ 
    //         /* Pre processing stage where you can decide whether to abort/redirect the current transition(e.g Permission check). */
    // },
    // model  : function (paramsObject ){ 
    //         /* Initiate data request that are necessary for the current page. */
    // },
    // afterModel  : function (model, paramsObject ){ 
    //         /* Manipulating data before returning data to component. */
    // },
    // redirect  : function (model, paramsObject ){ 
    //         /* Redirections based on data fetched. */
    // },
    renderTemplate: function (model, paramsObject) {
        return { outlet: "#outlet", component: "login-comp" }
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

Lyte.Router.registerRoute('home', {
    // 	getResources  : function (paramsObject ){ 
    //         /* View related files should be returned as resources(HTML, CSS, components etc). It will be available before 'renderTemplate' hook. */
    // },
    // getDependencies  : function (paramsObject ){ 
    //         /* Files returned as dependencies will be downloaded at once and will be available before 'beforeModel' hook. */
    // },
    // beforeRender: function (model, paramsObject) {
    //    
    // },

    beforeModel: function (paramsObject) {

    },
    // model: function () {




    //     return new Promise((resolve, reject) => {
    //         var user = store.peekRecord('user', 1);
    //         if (!user) {
    //             Lyte.Router.transitionTo('login');
    //             return;
    //         }
    //         var userName = user.userName;
    //         $L.ajax({
    //             url: "http://localhost:8080/api/userTables",
    //             type: 'get',
    //             headers: {
    //                 'X-User-Name': userName,
    //             },
    //             processData: false,
    //             contentType: false,
    //             success: function (response) {
    //                 console.log(response.tableList);
    //                 user.$.set('tableList', response.tableList);
    //                 console.log(response.tableList);
    //                 resolve({
    //                     'tableList': response.tableList,
    //                 });
    //             },
    //             error: function (error) {
    //                 console.error('Error fetching data:', error);
    //                 reject(error);
    //             }
    //         });
    //     });
    // },


    // afterModel: function (model, paramsObject) {
    //     var user = store.peekRecord('user', 1);
    //     this.currentModel = { "user": user };
    // },
    // redirect  : function (model, paramsObject ){ 
    //         /* Redirections based on data fetched. */
    // },
    renderTemplate: function () {

        return { outlet: "#outlet", component: "form-comp" }
    },
    afterRender: function (model, paramsObject) {


        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!user) {
            $L('lyte-alert.error-response')[0].ltProp('heading', "Request failed");
            $L('lyte-alert.error-response')[0].ltProp('primaryMessage', " Can't send your request ");
            $L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "you may not logged in or your session timed out , login again");
            $L('lyte-alert.error-response')[0].ltProp('show', true);
            Lyte.Router.transitionTo('login');
            return
        }


        const ajax = {

            url: `http://${window.location.hostname}:8080/api/chunkUpload`,
            headers: {
                'Authorization': 'Bearer ' + user.token,
            }

        }
        $L('lyte-fileupload')[0].ltProp('ajax', ajax);
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







// import java.util.*;

// import java.util.*;
// import java.util.regex.*;

// public class Main {
  
  
//    public static Map<String, String> getDateFormatMap() {
// 	        Map<String, String> formatMap = new HashMap<>();
	        
	        
	 

	        
// 	        // 1. YYYY-MM-DD
// 	        formatMap.put("\\d{4}-\\d{2}-\\d{2}", "yyyy-MM-dd"); // Example: 2023-12-31  "%Y-%m-%d"
	        
// 	        // 2. DD/MM/YYYY
// 	        formatMap.put("\\d{2}/\\d{2}/\\d{4}", "dd/MM/yyyy"); // Example: 31/12/2023  %d/%m/%Y

// 	        // 3. MM/DD/YYYY
// 	        formatMap.put("\\d{2}/\\d{2}/\\d{4}", "MM/dd/yyyy"); // Example: 12/31/2023   "%m/%d/%Y"
	        
// 	        // 4. DD-MM-YYYY
// 	        formatMap.put("\\d{2}-\\d{2}-\\d{4}", "dd-MM-yyyy"); // Example: 31-12-2023   "%d-%m-%Y"
	        
// 	        // 5. MM-DD-YYYY
// 	        formatMap.put("\\d{2}-\\d{2}-\\d{4}", "MM-dd-yyyy"); // Example: 12-31-2023    "%m-%d-%Y"

// 	        // 6. YYYY/MM/DD
// 	        formatMap.put("\\d{4}/\\d{2}/\\d{2}", "yyyy/MM/dd"); // Example: 2023/12/31

// 	        // 7. DD.MM.YYYY
// 	        formatMap.put("\\d{2}\\.\\d{2}\\.\\d{4}", "dd.MM.yyyy"); // Example: 31.12.2023

// 	        // 8. YYYY.MM.DD
// 	        formatMap.put("\\d{4}\\.\\d{2}\\.\\d{2}", "yyyy.MM.dd"); // Example: 2023.12.31

// 	        // 9. YYYYMMDD
// 	        formatMap.put("\\d{8}", "yyyyMMdd"); // Example: 20231231

// 	        // 10. DD Month YYYY
// 	        formatMap.put("\\d{2} [A-Za-z]+ \\d{4}", "dd MMMM yyyy"); // Example: 31 December 2023

// 	        // 11. Month DD, YYYY
// 	        formatMap.put("[A-Za-z]+ \\d{2}, \\d{4}", "MMMM dd, yyyy"); // Example: December 31, 2023

// 	        // 12. DD-MMM-YYYY
// 	        formatMap.put("\\d{2}-[A-Za-z]{3}-\\d{4}", "dd-MMM-yyyy"); // Example: 31-Dec-2023

// 	        // 13. DD/MMM/YYYY
// 	        formatMap.put("\\d{2}/[A-Za-z]{3}/\\d{4}", "dd/MMM/yyyy"); // Example: 31/Dec/2023

// 	        // 14. DD.MM.YY
// 	        formatMap.put("\\d{2}\\.\\d{2}\\.\\d{2}", "dd.MM.yy"); // Example: 31.12.23

// 	        // 15. MM/YYYY
// 	        formatMap.put("\\d{2}/\\d{4}", "MM/yyyy"); // Example: 12/2023

// 	        // 16. YYYY-MM
// 	        formatMap.put("\\d{4}-\\d{2}", "yyyy-MM"); // Example: 2023-12

// 	        // 17. MMM DD, YYYY
// 	        formatMap.put("[A-Za-z]{3} \\d{2}, \\d{4}", "MMM dd, yyyy"); // Example: Dec 31, 2023

// 	        // 18. DD-MMM-YY
// 	        formatMap.put("\\d{2}-[A-Za-z]{3}-\\d{2}", "dd-MMM-yy"); // Example: 31-Dec-23

// 	        // 19. YYYY/MMM/DD
// 	        formatMap.put("\\d{4}/[A-Za-z]{3}/\\d{2}", "yyyy/MMM/dd"); // Example: 2023/Dec/31

// 	        // 20. D-M-YYYY
// 	        formatMap.put("\\d{1,2}-\\d{1,2}-\\d{4}", "d-M-yyyy"); // Example: 1-1-2023

// 	        // 21. M/D/YYYY
// 	        formatMap.put("\\d{1,2}/\\d{1,2}/\\d{4}", "M/d/yyyy"); // Example: 1/1/2023

// 	        // 22. Weekday, DD Month YYYY
// 	        formatMap.put("[A-Za-z]+, \\d{2} [A-Za-z]+ \\d{4}", "EEEE, dd MMMM yyyy"); // Example: Sunday, 31 December 2023

// 	        // 23. Weekday, MM/DD/YYYY
// 	        formatMap.put("[A-Za-z]+, \\d{2}/\\d{2}/\\d{4}", "EEEE, MM/dd/yyyy"); // Example: Sunday, 12/31/2023

// 	        // 24. Week Number YYYY-Www
// 	        formatMap.put("\\d{4}-W\\d{2}", "yyyy-'W'ww"); // Example: 2023-W52
	        
// 	        // 25. Week Number YYYY-Www-D
// 	        formatMap.put("\\d{4}-W\\d{2}-\\d{1,2}", "yyyy-'W'ww-e"); // Example: 2023-W52-7

// 	        // 26. Day of Year YYYY-DDD
// 	        formatMap.put("\\d{4}-\\d{3}", "yyyy-DDD"); // Example: 2023-365

// 	        // 27. ISO Week Date YYYY-Www-D
// 	        formatMap.put("\\d{4}-W\\d{2}-\\d{1}", "xxxx-'W'ww-e"); // Example: 2023-W52-1

// 	        // 28. Weekday Name, Month DD YYYY
// 	        formatMap.put("[A-Za-z]+, [A-Za-z]+ \\d{2} \\d{4}", "EEEE, MMMM dd yyyy"); // Example: Sunday, December 31 2023

// 	        // 29. Month Name and Year
// 	        formatMap.put("[A-Za-z]+ \\d{4}", "MMMM yyyy"); // Example: December 2023

// 	        // 30. Weekday Shortname DD/MM/YYYY
// 	        formatMap.put("[A-Za-z]{3} \\d{2}/\\d{2}/\\d{4}", "EEE dd/MM/yyyy"); // Example: Sun 31/12/2023

// 	        // 31. Year and Weekday Shortname
// 	        formatMap.put("\\d{4} [A-Za-z]{3}", "yyyy EEE"); // Example: 2023 Sun

// 	        // 32. Weekday, Month DD, YYYY
// 	        formatMap.put("[A-Za-z]+, [A-Za-z]+ \\d{2}, \\d{4}", "EEEE, MMMM dd, yyyy"); // Example: Sunday, December 31, 2023

// 	        // 33. Day of Week, Day Month YYYY
// 	        formatMap.put("[A-Za-z]{3}, \\d{2} [A-Za-z]+ \\d{4}", "EEE, dd MMMM yyyy"); // Example: Sun, 31 December 2023

// 	        // 34. Ddd, D Mmm YYYY
// 	        formatMap.put("[A-Za-z]{3}, \\d{1,2} [A-Za-z]{3} \\d{4}", "EEE, d MMM yyyy"); // Example: Sun, 31 Dec 2023

// 	        // 35. YYYY-DDD
// 	        formatMap.put("\\d{4}-\\d{3}", "yyyy-DDD"); // Example: 2023-365

// 	        // 36. Day of Week, Date, Month, Year
// 	        formatMap.put("[A-Za-z]+, \\d{2} [A-Za-z]+ \\d{4}", "EEEE, dd MMMM yyyy"); // Example: Sunday, 31 December 2023

// 	        // 37. M/D/YY
// 	        formatMap.put("\\d{1,2}/\\d{1,2}/\\d{2}", "M/d/yy"); // Example: 12/31/23

// 	        // 38. YYYY/MMM
// 	        formatMap.put("\\d{4}/[A-Za-z]{3}", "yyyy/MMM"); // Example: 2023/Dec 
	        
// 	        return formatMap;
//    }
  
  
//   public static Map<String, String> getTimeFormatMap() {
// 	        Map<String, String> timeFormatMap = new HashMap<>();
	        
	        
	        
// 	   // 1. HH:mm:ss
// 	        timeFormatMap.put("(\\d{2}):(\\d{2}):(\\d{2})", "HH:mm:ss"); // Example: 14:30:00

// 	        // 2. hh:mm:ss a
// 	        timeFormatMap.put("(\\d{2}):(\\d{2}):(\\d{2})\\s(AM|PM|am|pm)", "hh:mm:ss a"); // Example: 02:30:00 PM

// 	        // 3. HH:mm
// 	        timeFormatMap.put("(\\d{2}):(\\d{2})", "HH:mm"); // Example: 14:30

// 	        // 4. hh:mm a
// 	        timeFormatMap.put("(\\d{2}):(\\d{2})\\s(AM|PM|am|pm)", "hh:mm a"); // Example: 02:30 PM

// 	        // 5. HH:mm:ss.SSS
// 	        timeFormatMap.put("(\\d{2}):(\\d{2}):(\\d{2})\\.(\\d{3})", "HH:mm:ss.SSS"); // Example: 14:30:00.123

// 	        // 6. hh:mm:ss.SSS a
// 	        timeFormatMap.put("(\\d{2}):(\\d{2}):(\\d{2})\\.(\\d{3})\\s(AM|PM|am|pm)", "hh:mm:ss.SSS a"); // Example: 02:30:00.123 PM

// 	        // 7. HH:mm:ss Z
// 	        timeFormatMap.put("(\\d{2}):(\\d{2}):(\\d{2})\\s([+-]\\d{4})", "HH:mm:ss Z"); // Example: 14:30:00 +0530

// 	        // 8. hh:mm:ss a Z
// 	        timeFormatMap.put("(\\d{2}):(\\d{2}):(\\d{2})\\s(AM|PM|am|pm)\\s([+-]\\d{4})", "hh:mm:ss a Z"); // Example: 02:30:00 PM +0530

// 	        // 9. HH:mm:ss.SSS Z
// 	        timeFormatMap.put("(\\d{2}):(\\d{2}):(\\d{2})\\.(\\d{3})\\s([+-]\\d{4})", "HH:mm:ss.SSS Z"); // Example: 14:30:00.123 +0530

// 	        // 10. hh:mm:ss.SSS a Z
// 	        timeFormatMap.put("(\\d{2}):(\\d{2}):(\\d{2})\\.(\\d{3})\\s(AM|PM|am|pm)\\s([+-]\\d{4})", "hh:mm:ss.SSS a Z"); // Example: 02:30:00.123 PM +0530

// 	        // 11. HH:mm:ss.SSSXXX
// 	        timeFormatMap.put("(\\d{2}):(\\d{2}):(\\d{2})\\.(\\d{3})\\s([+-]\\d{2}:\\d{2})", "HH:mm:ss.SSSXXX"); // Example: 14:30:00.123 +05:30

// 	        // 12. hh:mm:ss a XXX
// 	        timeFormatMap.put("(\\d{2}):(\\d{2}):(\\d{2})\\s(AM|PM|am|pm)\\s([+-]\\d{2}:\\d{2})", "hh:mm:ss a XXX"); // Example: 02:30:00 PM +05:30

// 	        // 13. HH:mm:ss.SSSSSS
// 	        timeFormatMap.put("(\\d{2}):(\\d{2}):(\\d{2})\\.(\\d{6})", "HH:mm:ss.SSSSSS"); // Example: 14:30:00.123456

// 	        // 14. hh:mm:ss a.SSSSSS
// 	        timeFormatMap.put("(\\d{2}):(\\d{2}):(\\d{2})\\.(\\d{6})\\s(AM|PM|am|pm)", "hh:mm:ss a.SSSSSS"); // Example: 02:30:00.123456 PM

// 	        // 15. HH:mm:ss.SSSSSS Z
// 	        timeFormatMap.put("(\\d{2}):(\\d{2}):(\\d{2})\\.(\\d{6})\\s([+-]\\d{4})", "HH:mm:ss.SSSSSS Z"); // Example: 14:30:00.123456 +0530

// 	        // 16. hh:mm:ss a.SSSSSS Z
// 	        timeFormatMap.put("(\\d{2}):(\\d{2}):(\\d{2})\\.(\\d{6})\\s(AM|PM|am|pm)\\s([+-]\\d{4})", "hh:mm:ss a.SSSSSS Z"); // Example: 02:30:00.123456 PM +0530

// 	        // 17. HH:mm:ss.SSSSSSXXX
// 	        timeFormatMap.put("(\\d{2}):(\\d{2}):(\\d{2})\\.(\\d{6})\\s([+-]\\d{2}:\\d{2})", "HH:mm:ss.SSSSSSXXX"); // Example: 14:30:00.123456 +05:30

// 	        // 18. hh:mm:ss a.SSSSSS XXX
// 	        timeFormatMap.put("(\\d{2}):(\\d{2}):(\\d{2})\\.(\\d{6})\\s(AM|PM|am|pm)\\s([+-]\\d{2}:\\d{2})", "hh:mm:ss a.SSSSSS XXX"); // Example: 02:30:00.123456 PM +05:30

// 	        // 19. HH:mm Z
// 	        timeFormatMap.put("(\\d{2}):(\\d{2})\\s([+-]\\d{4})", "HH:mm Z"); // Example: 14:30 +0530


// 	        // 19. HH:mm Z
// 	       // timeFormatMap.put("(\\d{2}):(\\d{2})\\s([+-]\\d{4})", "HH:mm Z"); // Example: 14:30 +0530

// 	        return timeFormatMap;
// 	    }
	

//     public static String preprocessString(String input) {
//         // Allowed prefixes and exact matches
//         Set<String> allowedPrefixes = new HashSet<>(Arrays.asList(
//             "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec",
//             "sun", "mon", "tue", "wed", "thu", "fri", "sat"
//         ));
//         Set<String> exactMatchesForTime = new HashSet<>(Arrays.asList("am", "pm", "t"));
//         Set<String> exactMatchesForDate = new HashSet<>(Arrays.asList("w"));

//         // Extract alphabetic substrings
//         List<String> alphabeticStrings = new ArrayList<>();
//         Matcher matcher = Pattern.compile("[a-zA-Z]+",Pattern.CASE_INSENSITIVE).matcher(input);
//         while (matcher.find()) {
//             alphabeticStrings.add(matcher.group().toLowerCase());
//         }

//         System.out.println(alphabeticStrings);
//         // Initialize flags
//         boolean haveDate = true;
//         boolean haveTime = true;

//         // Validate strings
//         for (String str : alphabeticStrings) {
        
          
//             if ( !(allowedPrefixes.stream().anyMatch(str::startsWith) || exactMatchesForDate.contains(str) || exactMatchesForTime.contains(str)) ) {
//                 haveDate = false;
//                 haveTime = false;
//             }
          
//         }
        
//          if (!haveDate && !haveTime) {
//             return "no date time"; // Invalid input
//         }
        
        
//        Set<String> validSymbols = new HashSet<>(Arrays.asList("-", ",", ".", "/", "+", ":", " "));

       
//         List<String> extractedSymbols = new ArrayList<>();
//         matcher = Pattern.compile("[^a-zA-Z0-9]",Pattern.CASE_INSENSITIVE).matcher(input);
//         while (matcher.find()) {
//             extractedSymbols.add(matcher.group());
//         }

//         System.out.println(extractedSymbols);
        
//         for (String symbol : extractedSymbols) {
//             if (!validSymbols.contains(symbol)) {
//                  haveDate = false;
//                 haveTime = false;
//             }
//         }

//          if (!haveDate && !haveTime) {
//             return "no date time"; // Invalid input
//         }
        
//         String returningString = input;
//         String processingString1 = input;
//         String processingString2 = input;
      
        
//          if (extractedSymbols.contains(":")) {
//             // Get the time format map
//             Map<String, String> timeFormatMap = Main.getTimeFormatMap();

          
//             for (String regex : timeFormatMap.keySet()) {
//                 Pattern pattern = Pattern.compile(regex,Pattern.CASE_INSENSITIVE);
//                 matcher = pattern.matcher(input);

//               // Find all matches
//                 while (matcher.find()) {
//                     String matchedPart = matcher.group();
//                     String formatValue = timeFormatMap.get(regex);


//                     processingString2 = processingString2.replaceFirst(Pattern.quote(matchedPart), "_");
                    
//                    // System.out.println("processingString2 :"+processingString2);

//                     if(processingString2.length() < processingString1.length()){
                      
//                       // Replace in processingString
//                     processingString1 = processingString2;

                   
//                     // Replace in returningString
//                     returningString = processingString1.replaceFirst("_",formatValue);
                    
                      
//                     }

//                   processingString2 = input;
                    
                   
//                 }
//             }
//         } else {
//             // If ":" is not present, set haveTime to false
//             haveTime = false;
//         }
        
//         processingString2=returningString;
//         String returningStringFinal = returningString;
        
     
//      System.out.println("after time match : "+ processingString2);
        
//         if(processingString1.trim().equals("_") ){
//           haveDate = false;
//         }
//         else{
          
//             processingString1=returningString;
          
//             Map<String, String> dateFormatMap = Main.getDateFormatMap();

          
//             for (String regex : dateFormatMap.keySet()) {
//                 Pattern pattern = Pattern.compile(regex,Pattern.CASE_INSENSITIVE);
//                 matcher = pattern.matcher(processingString2);

//               // Find all matches
//                 while (matcher.find()) {
//                     String matchedPart = matcher.group();
//                     String formatValue = dateFormatMap.get(regex);


//                     processingString2 = processingString2.replaceFirst(Pattern.quote(matchedPart), "!");
                    
//                    // System.out.println("processingString2 :"+processingString2);

//                     if(processingString2.length() < processingString1.length()){
                      
//                       // Replace in processingString
//                     processingString1 = processingString2;

                   
//                     // Replace in returningString
//                     returningStringFinal = processingString1.replaceFirst("!",formatValue);
                    
                      
//                     }

//                   processingString2 = returningString;
                    
                   
//                 }
          
//         }
//         }
        
//         System.out.println(haveTime);
       
//         System.out.println("returning : "+returningStringFinal);
        
//      if (!haveDate && !haveTime) {
//             return "no date time"; // Invalid input
//         }
//         else if (haveDate && haveTime){
          
//           returningStringFinal="DATETIME&"+ returningStringFinal;
//         }
//          else if (haveDate && !haveTime){
          
//           returningStringFinal="DATE&"+ returningStringFinal;
//         }
        
//         else if (!haveDate && haveTime){
          
//           returningStringFinal="TIME&"+ returningStringFinal;
//         }

      
//         return returningStringFinal; // Valid input for further processing
//     }

//       public static void main(String[] args) {
//         String testInput = "2023-12-31 T 02:30:00.123456 ";
      

//         System.out.println("Result : " + preprocessString(testInput)); // Should proceed
      
//     }
// }

Lyte.Router.registerRoute("register", {
    // 	getResources  : function (paramsObject ){ 
    //         /* View related files should be returned as resources(HTML, CSS, components etc). It will be available before 'renderTemplate' hook. */
    // },
    // getDependencies  : function (paramsObject ){ 
    //         /* Files returned as dependencies will be downloaded at once and will be available before 'beforeModel' hook. */
    // },
    // beforeModel  : function (paramsObject ){ 
    //         /* Pre processing stage where you can decide whether to abort/redirect the current transition(e.g Permission check). */
    // },
    // model  : function (paramsObject ){ 
    //         /* Initiate data request that are necessary for the current page. */
    // },
    // afterModel  : function (model, paramsObject ){ 
    //         /* Manipulating data before returning data to component. */
    // },
    // redirect  : function (model, paramsObject ){ 
    //         /* Redirections based on data fetched. */
    // },
    renderTemplate: function (model, paramsObject) {
        return { outlet: "#outlet", component: "register-comp" }
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

Lyte.Router.registerRoute('index', {


	redirect: function (model, paramsObject) {

		this.transitionTo('login');
	}


});

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

Lyte.Component.registerHelper('getNumber', function (a) {

    return Number(a);
});
Lyte.Component.register("column-comp", {
_template:"<template tag-name=\"column-comp\"> <span class=\"index2\">{{idx}}</span> <div class=\"column-name2\"> <lyte-input class=\"columnName2\" lt-prop-value=\"{{columnName}}\" lt-prop-appearance=\"box\" lt-prop-direction=\"horizontal\" lt-prop-placeholder=\"Enter column{{idx}} Name \"> </lyte-input> </div> <div class=\"data-type2\"> <lyte-dropdown class=\"datatype-value_{{idx}} datatype2\" lt-prop-options=\"{{yourOption}}\" lt-prop-user-value=\"name\" lt-prop-system-value=\"value\" lt-prop-name=\"{{expHandlers(idx,'-',1)}}\" lt-prop-selected=\"{{dataType}}\" on-option-selected=\"{{method('onOptionSelect',idx)}}\"> </lyte-dropdown> </div> <div class=\"format-string_{{idx}}\"> <lyte-input class=\"dateformat\" lt-prop-value=\"{{dateFormat}}\" lt-prop-direction=\"horizontal\" lt-prop-appearance=\"box\" lt-prop-placeholder=\"Format used\"> </lyte-input> </div> <div class=\"numeric-length_{{idx}}\"> <lyte-number class=\"length_a_{{idx}} length1\" lt-prop-value=\"{{length1}}\"></lyte-number> <lyte-number class=\"length_b_{{idx}} length2\" lt-prop-value=\"{{length2}}\" before-render=\"{{method('TestbeforeRender',idx)}}\"></lyte-number> </div> </template>",
_dynamicNodes : [{"type":"text","position":[1,0]},{"type":"attr","position":[3,1]},{"type":"componentDynamic","position":[3,1]},{"type":"attr","position":[5,1]},{"type":"componentDynamic","position":[5,1]},{"type":"attr","position":[7]},{"type":"attr","position":[7,1]},{"type":"componentDynamic","position":[7,1]},{"type":"attr","position":[9]},{"type":"attr","position":[9,1]},{"type":"componentDynamic","position":[9,1]},{"type":"attr","position":[9,3]},{"type":"componentDynamic","position":[9,3]}],
_observedAttributes :["yourOption"],








    data: function () {
        return {
            yourOption: Lyte.attr('array', {
                default: [
                    { "name": "TEXT", "value": "VARCHAR" },
                    { "name": "INTEGER", "value": "INT" },
                    { "name": "DECIMAL", "value": "DECIMAL" },
                    { "name": "LONG", "value": "BIGINT" },
                    { "name": "DATE", "value": "DATE" },
                    { "name": "TIME", "value": "TIME" },
                    { "name": "DATETIME", "value": "DATETIME" },
                    { "name": "BOOLEAN", "value": "BOOLEAN" }
                ]
            }),

        }
    },
    actions: {



    },
    methods: {
        onOptionSelect: function (idx, event, currentItem, component) {

            if (component.$node.innerText === 'TEXT') {
                document.querySelector(".numeric-length_" + idx).style.display = 'inline';
                document.querySelector(".format-string_" + idx).style.display = 'none';
                $L('.length_a_' + idx)[0].ltProp('value', 255);
                $L('.length_b_' + idx)[0].ltProp('value', -1);



            }
            else if (component.$node.innerText === 'DECIMAL') {

                document.querySelector(".numeric-length_" + idx).style.display = 'inline';
                document.querySelector(".format-string_" + idx).style.display = 'none';
                $L('.length_a_' + idx)[0].ltProp('value', 10);
                $L('.length_b_' + idx)[0].ltProp('value', 2);

            }
            else if (component.$node.innerText === 'DATE' || component.$node.innerText === 'TIME' || component.$node.innerText === 'DATETIME') {


                document.querySelector(".format-string_" + idx).style.display = 'inline';
                $L('.length_a_' + idx)[0].ltProp('value', -1);
                $L('.length_b_' + idx)[0].ltProp('value', -1);
                document.querySelector(".numeric-length_" + idx).style.display = 'none';
            }
            else {
                $L('.length_a_' + idx)[0].ltProp('value', -1);
                $L('.length_b_' + idx)[0].ltProp('value', -1);
                document.querySelector(".numeric-length_" + idx).style.display = 'none';
                document.querySelector(".format-string_" + idx).style.display = 'none';

            }



            if ($L('.length_a_' + idx)[0].ltProp('value') === '-1') {
                $L('.length_a_' + idx)[0].ltProp('style', 'display:none');
            }
            else {
                $L('.length_a_' + idx)[0].ltProp('style', 'display:inline');
            }
            console.log("changer");
            if ($L('.length_b_' + idx)[0].ltProp('value') === '-1') {
                $L('.length_b_' + idx)[0].ltProp('style', 'display:none');
            }
            else {
                $L('.length_b_' + idx)[0].ltProp('style', 'display:inline');
            }

        },
        TestbeforeRender: function (idx) {


            var datatype = $L('lyte-dropdown.datatype-value_' + idx)[0].ltProp('selected');


            if (datatype === 'VARCHAR') {
                document.querySelector(".numeric-length_" + idx).style.display = 'inline';
                document.querySelector(".format-string_" + idx).style.display = 'none';
                $L('.length_a_' + idx)[0].ltProp('value', 255);
                $L('.length_b_' + idx)[0].ltProp('value', -1);

            }
            else if (datatype === 'DECIMAL') {

                document.querySelector(".numeric-length_" + idx).style.display = 'inline';
                document.querySelector(".format-string_" + idx).style.display = 'none';
                $L('.length_a_' + idx)[0].ltProp('value', 10);
                $L('.length_b_' + idx)[0].ltProp('value', 2);

            }
            else if (datatype === 'DATE' || datatype === 'TIME' || datatype === 'DATETIME') {


                document.querySelector(".format-string_" + idx).style.display = 'inline';
                $L('.length_a_' + idx)[0].ltProp('value', -1);
                $L('.length_b_' + idx)[0].ltProp('value', -1);
                document.querySelector(".numeric-length_" + idx).style.display = 'none';
            }
            else {
                $L('.length_a_' + idx)[0].ltProp('value', -1);
                $L('.length_b_' + idx)[0].ltProp('value', -1);
                document.querySelector(".numeric-length_" + idx).style.display = 'none';
                document.querySelector(".format-string_" + idx).style.display = 'none';

            }



            if ($L('.length_a_' + idx)[0].ltProp('value') === '-1') {
                $L('.length_a_' + idx)[0].ltProp('style', 'display:none');
            }
            else {
                $L('.length_a_' + idx)[0].ltProp('style', 'display:inline');
            }

            if ($L('.length_b_' + idx)[0].ltProp('value') === '-1') {
                $L('.length_b_' + idx)[0].ltProp('style', 'display:none');
            }
            else {
                $L('.length_b_' + idx)[0].ltProp('style', 'display:inline');
            }
        }
    }
});





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


Lyte.Component.register("register-comp", {
_template:"<template class=\"main2-container\" tag-name=\"register-comp\"> <div class=\"register-container\"> <div class=\"input2\"> <lyte-input lt-prop-id=\"new-username\" class=\"new-username\" lt-prop-direction=\"horizontal\" lt-prop-appearance=\"box\" lt-prop-placeholder=\"your username\" onkeydown=\"{{action('register',event)}}\"> </lyte-input> </div> <div class=\"input2\"> <lyte-input lt-prop-id=\"new-password\" class=\"new-password\" lt-prop-type=\"password\" lt-prop-password-icon=\"true\" lt-prop-direction=\"horizontal\" lt-prop-appearance=\"box\" lt-prop-placeholder=\"your password\" onkeydown=\"{{action('register',event)}}\"> </lyte-input> </div> <div class=\"button2\"> <lyte-button lt-prop-class=\"register-button2\" lt-prop-id=\"unique\" onclick=\"{{action('register',event)}}\"> <template is=\"registerYield\" yield-name=\"text\"> Register </template> </lyte-button> </div> </div> </template>\n<style>/* Main container setup */\n.main2-container {\n\n\n    background-image: url('5083957.jpg');\n    background-size: cover;\n    background-position: center;\n    background-repeat: no-repeat;\n\n\n\n\n\n    display: grid;\n    /* Make it a grid */\n    grid-template-columns: 30% 40% 30%;\n    /* Define the columns (1fr, 3fr, 1fr) */\n    grid-template-rows: 33% 34% 33%;\n    /* Define the rows (1fr, 3fr, 1fr) */\n    height: 100vh;\n    /* Full viewport height */\n    width: 100vw;\n    /* Full width */\n    margin: 0;\n    padding: 0;\n}\n\n#new-password,\n#new-username {\n    background-color: rgba(0, 0, 0, 0.6);\n    font-size: 17px;\n    color: aliceblue;\n    height: 100%;\n    padding: 20px;\n    font-style: oblique;\n}\n\n#new-password:focus,\n#new-username:focus {\n    box-shadow: 0 0 10px 5px rgba(140, 78, 215, 0.723);\n}\n\n\n\n\n\n\n.register-container {\n\n    display: grid;\n\n    grid-column: 2 / 3;\n    grid-row: 2 / 3;\n    width: 100%;\n    height: 100%;\n\n\n    grid-template-columns: 1fr;\n    grid-template-rows: 1fr 1fr 1fr;\n\n\n    justify-content: center;\n    align-items: center;\n    border-radius: 8px;\n\n}\n\n.register-container:hover {\n\n    background-color: rgba(255, 255, 255, 0.15);\n}\n\n.new-username,\n.new-password {\n\n\n    align-self: stretch;\n    width: 60%;\n    height: 100%;\n    padding: 0px;\n    margin: 0px;\n\n}\n\n\n.input2,\n.button2 {\n    display: flex;\n    justify-content: center;\n    /* Horizontally center */\n    align-items: center;\n\n\n    margin: 0px;\n    padding: 0px;\n}\n\n\n.button2 {\n\n\n    margin-bottom: 20px;\n\n}\n\n.register-button2 {\n\n    font-family: \"Arimo\", serif;\n    background-color: #969104e9;\n    padding: 13px 25px;\n    font-size: 19px;\n    border-radius: 100px;\n    color: white;\n    border: none\n}\n\n.register-button2:hover {\n\n    font-weight: 1000;\n    font-family: \"Arimo\", serif;\n    background-color: #f4ef69e9;\n    padding: 16px 28px;\n    border-radius: 100px;\n    color: rgb(67, 63, 63);\n    border: none;\n    box-shadow: 5px 5px 10px rgb(0, 0, 0);\n}</style>",
_dynamicNodes : [{"type":"attr","position":[1,1,1]},{"type":"componentDynamic","position":[1,1,1]},{"type":"attr","position":[1,3,1]},{"type":"componentDynamic","position":[1,3,1]},{"type":"attr","position":[1,5,1]},{"type":"registerYield","position":[1,5,1,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[1,5,1]}],

	data: function () {
		return {

		}
	},
	actions: {
		register: function (event) {
			if ((event instanceof KeyboardEvent)) {
				if (!(event.code === 'Enter')) return;
			}

			var userName = $L('lyte-input.new-username')[0].ltProp('value');
			var password = $L('lyte-input.new-password')[0].ltProp('value');

			if (!userName || !password) {

				$L('lyte-alert.error-response')[0].ltProp('heading', "Register error");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Username or password can't be empty");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;
			}



			console.log("the password: " + password);


			$L.ajax({
				url: `http://${window.location.hostname}:8080/api/login`,
				type: 'POST',
				headers: {
					'X-User-Name': userName,
					'X-User-Password': password,
					'X-User-Request': "register"
				},
				processData: false,
				contentType: false,
				withCredentials: true,
				success: function (response) {

					const user = {

						token: response.token,
						tableId: -1
					}

					sessionStorage.setItem("user", JSON.stringify(user));

					$L('lyte-messagebox.success-response')[0].ltProp('message', response.message);
					$L('lyte-messagebox.success-response')[0].ltProp('show', true);

					Lyte.Router.transitionTo('home');
				},
				error: function (response) {

					const message = JSON.parse(response.responseText).message;

					$L('lyte-input.new-username')[0].ltProp('value', "");
					$L('lyte-input.new-password')[0].ltProp('value', "");

					$L('lyte-alert.error-response')[0].ltProp('heading', "Register error");
					$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Can't register , try again");
					$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', message);
					$L('lyte-alert.error-response')[0].ltProp('show', true);


				}
			});



		}

	},
	methods: {
		// Functions which can be used as callback in the component.
	}
});

Lyte.Component.register("login-comp", {
_template:"<template class=\"main-container\" tag-name=\"login-comp\"> <div class=\"login-container\"> <div class=\"input\"> <lyte-input lt-prop-id=\"username\" class=\"username\" lt-prop-direction=\"horizontal\" lt-prop-appearance=\"box\" lt-prop-placeholder=\"your username\" onkeydown=\"{{action('login',event)}}\"> </lyte-input> </div> <div class=\"input\"> <lyte-input lt-prop-id=\"password\" class=\"password\" lt-prop-type=\"password\" lt-prop-password-icon=\"true\" lt-prop-direction=\"horizontal\" lt-prop-appearance=\"box\" lt-prop-placeholder=\"your password\" onkeydown=\"{{action('login',event)}}\"> </lyte-input> </div> <div class=\"button\"> <lyte-button lt-prop-class=\"login-button\" lt-prop-id=\"unique\" onclick=\"{{action('login',event)}}\"> <template is=\"registerYield\" yield-name=\"text\"> Login </template> </lyte-button> </div> <div class=\"register-text\"> <span class=\"label-register\"> new user ?</span> <lyte-button lt-prop-class=\"register-button\" onclick=\"{{action('register',event)}}\" lt-prop-yield=\"true\"> <template is=\"registerYield\" yield-name=\"text\"> register </template> </lyte-button> </div> </div> </template>\n<style>/* Main container setup */\n*,\nhtml,\nbody {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}\n\nbody {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    min-height: 100vh;\n    background: #222;\n}\n\n.loading {\n\n    position: absolute;\n    z-index: 20;\n    display: none;\n}\n\n.loading span {\n    position: relative;\n    width: 20px;\n    height: 5px;\n\n}\n\n.loading span::before {\n    content: '';\n    position: absolute;\n    inset: 0;\n    background: rgb(106, 216, 235);\n    box-shadow: 0 0 5px rgb(106, 216, 235),\n        0 0 15px rgb(106, 216, 235),\n        0 0 30px rgb(106, 216, 235),\n        0 0 50px rgb(106, 216, 235);\n    animation: animate 5s linear infinite;\n    animation-delay: calc(var(--i)*0.1s);\n}\n\n@keyframes animate {\n\n    0% {\n        transform-origin: 0 20px;\n        filter: hue-rotate(0deg);\n    }\n\n    20% {\n        transform: rotate(calc(-90deg * var(--i)));\n\n    }\n\n    60% {\n        transform: rotate(calc(0deg * var(--i)));\n\n    }\n\n    100% {\n\n        filter: hue-rotate(360deg);\n    }\n\n}\n\n.main-container {\n\n    background-image: url('60574852.jpg');\n    background-size: cover;\n    background-position: center;\n    background-repeat: no-repeat;\n\n\n    display: grid;\n    /* Make it a grid */\n    grid-template-columns: 30% 40% 30%;\n    /* Define the columns (1fr, 3fr, 1fr) */\n    grid-template-rows: 32% 36% 32%;\n    /* Define the rows (1fr, 3fr, 1fr) */\n    height: 100vh;\n    /* Full viewport height */\n    width: 100vw;\n    /* Full width */\n    margin: 0px;\n    padding: 0px;\n}\n\n\n\n\n.login-container {\n\n\n    /* White with 50% transparency */\n\n\n    grid-column: 2 / 3;\n    grid-row: 2 / 3;\n    width: 100%;\n    height: 100%;\n    display: grid;\n\n    grid-template-columns: 1fr;\n    grid-template-rows: 30% 30% 20% 20%;\n\n    justify-content: center;\n    align-items: center;\n    border-radius: 8px;\n\n}\n\n.login-container:hover {\n\n    background-color: rgba(255, 255, 255, 0.15);\n\n}\n\n\n.input,\n.button,\n.register-text {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n\n    height: 100%;\n    width: 100%;\n    margin: 0px;\n    padding: 0px;\n}\n\n#password,\n#username {\n    background-color: rgba(0, 0, 0, 0.6);\n    font-size: 17px;\n    color: aliceblue;\n    height: 100%;\n    padding: 20px;\n    font-style: oblique;\n}\n\n#password:focus,\n#username:focus {\n    box-shadow: 0 0 10px 5px rgba(42, 130, 196, 0.689);\n}\n\n\n\n\n\n.username,\n.password {\n\n    align-self: stretch;\n    width: 60%;\n    height: 100%;\n    padding: 0px;\n    margin: 0px;\n\n}\n\n\n.label-input,\n.label-register {\n\n    font-weight: 400;\n    font-size: 18px;\n    margin-right: 20px;\n    color: rgba(0, 170, 221, 0.868);\n}\n\n.login-button {\n\n    font-family: \"Arimo\", serif;\n    background-color: #21875B;\n    padding: 10px 30px;\n    border-radius: 100px;\n    font-size: 18px;\n    color: white;\n    border: none\n}\n\n\n.login-button:hover {\n\n    font-weight: 1000;\n    font-family: \"Arimo\", serif;\n    color: rgb(74, 69, 69);\n    padding: 13px 33px;\n    border-radius: 100px;\n    background-color: #79EA5D;\n    border: none;\n    box-shadow: 5px 5px 10px rgb(0, 0, 0);\n\n}\n\n.register-text {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n\n\n\n.register-button:hover {\n    border: none;\n    font-size: 20px;\n    color: #6edce8e3;\n    text-decoration: underline;\n    font-family: \"Arimo\", serif;\n}\n\n.register-button {\n\n    width: 100%;\n    padding: 20px;\n    font-size: 16px;\n    background: none;\n    border: none;\n    color: grey;\n    font-family: \"Arimo\", serif;\n}</style>",
_dynamicNodes : [{"type":"attr","position":[1,1,1]},{"type":"componentDynamic","position":[1,1,1]},{"type":"attr","position":[1,3,1]},{"type":"componentDynamic","position":[1,3,1]},{"type":"attr","position":[1,5,1]},{"type":"registerYield","position":[1,5,1,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[1,5,1]},{"type":"attr","position":[1,7,3]},{"type":"registerYield","position":[1,7,3,1],"dynamicNodes":[]},{"type":"componentDynamic","position":[1,7,3]}],

	data: function () {
		return {

		}
	},
	actions: {


		register: function (event) {



			Lyte.Router.transitionTo('register');



		},

		login: function (event) {
			if ((event instanceof KeyboardEvent)) {
				if (!(event.code === 'Enter')) return;
			}

			var userName = $L('lyte-input.username')[0].ltProp('value');
			var password = $L('lyte-input.password')[0].ltProp('value');

			if (!userName || !password) {

				$L('lyte-alert.error-response')[0].ltProp('heading', "Login error");
				$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Username or password can't be empty");
				$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', "");
				$L('lyte-alert.error-response')[0].ltProp('show', true);
				return;
			}






			$L.ajax({
				url: `http://${window.location.hostname}:8080/api/login`,
				type: 'POST',
				headers: {
					'X-User-Name': userName,
					'X-User-Password': password,
					'X-User-Request': "login"
				},
				processData: false,
				contentType: false,
				withCredentials: true,
				success: function (response) {

					console.log(response);

					const user = {

						token: response.token,
						tableId: -1
					}

					sessionStorage.setItem("user", JSON.stringify(user));

					$L('lyte-messagebox.success-response')[0].ltProp('message', response.message);
					$L('lyte-messagebox.success-response')[0].ltProp('show', true);

					Lyte.Router.transitionTo('home');
				},

				error: function (response) {

					const message = JSON.parse(response.responseText).message;

					$L('lyte-input.username')[0].ltProp('value', "");
					$L('lyte-input.password')[0].ltProp('value', "");

					$L('lyte-alert.error-response')[0].ltProp('heading', "Login error");
					$L('lyte-alert.error-response')[0].ltProp('primaryMessage', "Can't login , try again");
					$L('lyte-alert.error-response')[0].ltProp('secondaryMessage', message);
					$L('lyte-alert.error-response')[0].ltProp('show', true);
				}
			});



		}



	},
	methods: {
	}



});

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

store.registerAdapter("application", {

});

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
store.registerModel("tableView", {

    id: Lyte.attr("number", { primaryKey: true }),
    currentQuery: Lyte.attr("string"),
    totalPages: Lyte.attr("number"),
    currentPage: Lyte.attr('number'),
    contentJSON: Lyte.attr('array'),
    headerJSON: Lyte.attr('array')

});

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


