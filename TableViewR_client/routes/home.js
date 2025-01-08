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
