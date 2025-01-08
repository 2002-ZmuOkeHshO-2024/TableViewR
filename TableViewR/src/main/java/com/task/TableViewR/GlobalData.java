package com.task.TableViewR;


import java.io.BufferedReader;
import java.io.FileReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellValue;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;


public class GlobalData {
	
		
		public static final String[] ALLOWED_EXTENSIONS = {".txt", ".csv", ".tsv", ".ssv", ".psv", ".hsv",".xlsx",".xls"};
	
		public static String filePath ="/Users/mukesh-tt0515/Documents/TableViewR/uploads/";
		
		public static String getFilePath() {
			return filePath;
		}
		
		
		
		    public static Map<String, String> getMySqlFormat() {
		        // This map stores the mapping between custom date format strings and MySQL date format strings.
		        Map<String, String> dateFormatMap = new HashMap<>();
		        
		        dateFormatMap.put("yyyy", "%Y");      // Year (4 digits)
		        dateFormatMap.put("yy", "%y");        // Year (2 digits)
		        dateFormatMap.put("MM", "%m");        // Month (2 digits)
		        dateFormatMap.put("MMM", "%b");       // Month abbreviation (e.g., Jan, Feb)
		        dateFormatMap.put("MMMM", "%M");      // Full month name (e.g., January, February)
		        dateFormatMap.put("dd", "%d");        // Day of the month (2 digits)
		        dateFormatMap.put("DDD", "%j");       // Day of the year (3 digits)
		        dateFormatMap.put("EEE", "%a");       // Day of the week abbreviation (e.g., Mon, Tue)
		        dateFormatMap.put("EEEE", "%W");      // Full day of the week name (e.g., Monday, Tuesday)
		        dateFormatMap.put("e", "%u");         // Day of the week (1 = Monday, 7 = Sunday)
		        dateFormatMap.put("ww", "%v");        // Week of the year (2 digits)
		        dateFormatMap.put("HH", "%H");        // Hour (24-hour format, 2 digits)
		        dateFormatMap.put("mm", "%i");        // Minute (2 digits)
		        dateFormatMap.put("ss", "%s");        // Second (2 digits)
		        dateFormatMap.put("hh", "%h");        // Hour (12-hour format, 2 digits)
		        dateFormatMap.put("a", "%p");         // AM/PM marker
		        dateFormatMap.put("SSS", "%f");       // Milliseconds (up to 3 digits)
		        dateFormatMap.put("SSSSSS", "%f");    // Microseconds (up to 6 digits)
		        dateFormatMap.put("Z", "%z");         // Timezone offset (e.g., +0530, -0800)
		        dateFormatMap.put("XXX", "%:z");      // Timezone offset (e.g., +05:30, -08:00)
		        
		        return dateFormatMap;
		    }
		

	
	    public static Map<String, String> getDateFormatMap() {
	        Map<String, String> formatMap = new HashMap<>();
	        
	        // 1. YYYY-MM-DD
	        formatMap.put("\\d{4}-\\d{1,2}-\\d{1,2}", "yyyy-MM-dd"); // Example: 2023-12-31  "%Y-%m-%d"
	        
	        // 2. DD/MM/YYYY
	        formatMap.put("\\d{1,2}/\\d{1,2}/\\d{4}", "dd/MM/yyyy"); // Example: 31/12/2023  %d/%m/%Y

	    
	        // 3. DD-MM-YYYY
	        formatMap.put("\\d{1,2}-\\d{1,2}-\\d{4}", "dd-MM-yyyy"); // Example: 31-12-2023   "%d-%m-%Y"
	        
	        
	        // 4. YYYY/MM/DD
	        formatMap.put("\\d{4}/\\d{1,2}/\\d{1,2}", "yyyy/MM/dd"); // Example: 2023/12/31

	        // 5. DD.MM.YYYY
	        formatMap.put("\\d{1,2}\\.\\d{1,2}\\.\\d{4}", "dd.MM.yyyy"); // Example: 31.12.2023

	        // 6. YYYY.MM.DD
	        formatMap.put("\\d{4}\\.\\d{1,2}\\.\\d{1,2}", "yyyy.MM.dd"); // Example: 2023.12.31

	       
	        // 7. DD Month YYYY
	        formatMap.put("\\d{1,2} [A-Za-z]+ \\d{4}", "dd MMMM yyyy"); // Example: 31 December 2023

	        // 8. Month DD, YYYY
	        formatMap.put("[A-Za-z]+ \\d{1,2}, \\d{4}", "MMMM dd, yyyy"); // Example: December 31, 2023

	        // 9. DD-MMM-YYYY
	        formatMap.put("\\d{1,2}-[A-Za-z]{3}-\\d{4}", "dd-MMM-yyyy"); // Example: 31-Dec-2023

	        // 10. DD/MMM/YYYY
	        formatMap.put("\\d{1,2}/[A-Za-z]{3}/\\d{4}", "dd/MMM/yyyy"); // Example: 31/Dec/2023

	        
	        //11
          formatMap.put( "\\d{4} [A-Za-z]{3} \\d{1,2}" ,"yyyy MMM dd"); // Example: 2023 Jan 06
	        // 12. DD.MM.YY
	        formatMap.put("\\d{1,2}\\.\\d{1,2}\\.\\d{2}", "dd.MM.yy"); // Example: 31.12.23

	        // 13. MM/YYYY
	        formatMap.put("\\d{1,2}/\\d{4}", "MM/yyyy"); // Example: 12/2023

	        // 14. YYYY-MM
	        formatMap.put("\\d{4}-\\d{1,2}", "yyyy-MM"); // Example: 2023-12

	        // 15. MMM DD, YYYY
	        formatMap.put("[A-Za-z]{3} \\d{1,2}, \\d{4}", "MMM dd, yyyy"); // Example: Dec 31, 2023

	        // 16. DD-MMM-YY
	        formatMap.put("\\d{1,2}-[A-Za-z]{3}-\\d{2}", "dd-MMM-yy"); // Example: 31-Dec-23

	        // 17. YYYY/MMM/DD
	        formatMap.put("\\d{4}/[A-Za-z]{3}/\\d{1,2}", "yyyy/MMM/dd"); // Example: 2023/Dec/31

	       // 18. D-M-YYYY
	       // formatMap.put("\\d{1,2}-\\d{1,2}-\\d{4}", "d-M-yyyy"); // Example: 1-1-2023

	       // // 19. M/D/YYYY
	       // formatMap.put("\\d{1,2}/\\d{1,2}/\\d{4}", "M/d/yyyy"); // Example: 1/1/2023

	        // 20. Weekday, DD Month YYYY
	        formatMap.put("[A-Za-z]+, \\d{1,2} [A-Za-z]+ \\d{4}", "EEEE, dd MMMM yyyy"); // Example: Sunday, 31 December 2023

	        // 21. Weekday, MM/DD/YYYY
	        formatMap.put("[A-Za-z]+, \\d{1,2}/\\d{1,2}/\\d{4}", "EEEE, MM/dd/yyyy"); // Example: Sunday, 12/31/2023

	        // 22. Week Number YYYY-Www
	        formatMap.put("\\d{4}-W\\d{1,2}", "yyyy-Www"); // Example: 2023-W52
	        
	        // 23. Week Number YYYY-Www-D
	        formatMap.put("\\d{4}-W\\d{1,2}-\\d{1,2}", "yyyy-Www-e"); // Example: 2023-W52-7

	        // 24. Day of Year YYYY-DDD
	        formatMap.put("\\d{4}-\\d{1,3}", "yyyy-DDD"); // Example: 2023-365

	     
	        // 25. Weekday Name, Month DD YYYY
	        formatMap.put("[A-Za-z]+, [A-Za-z]+ \\d{1,2} \\d{4}", "EEEE, MMMM dd yyyy"); // Example: Sunday, December 31 2023

	        // 26. Month Name and Year
	        formatMap.put("[A-Za-z]+ \\d{4}", "MMMM yyyy"); // Example: December 2023

	        // 27. Weekday Shortname DD/MM/YYYY
	        formatMap.put("[A-Za-z]{3} \\d{1,2}/\\d{1,2}/\\d{4}", "EEE dd/MM/yyyy"); // Example: Sun 31/12/2023

	        // 28. Year and Weekday Shortname
	        formatMap.put("\\d{4} [A-Za-z]{3}", "yyyy EEE"); // Example: 2023 Sun

	        // 29. Weekday, Month DD, YYYY
	        formatMap.put("[A-Za-z]+, [A-Za-z]+ \\d{1,2}, \\d{4}", "EEEE, MMMM dd, yyyy"); // Example: Sunday, December 31, 2023

	        // 30. Day of Week, Day Month YYYY
	        formatMap.put("[A-Za-z]{3}, \\d{1,2} [A-Za-z]+ \\d{4}", "EEE, dd MMMM yyyy"); // Example: Sun, 31 December 2023

	        // 31. Ddd, D Mmm YYYY
	        formatMap.put("[A-Za-z]{3}, \\d{1,2} [A-Za-z]{3} \\d{4}", "EEE, dd MMM yyyy"); // Example: Sun, 31 Dec 2023

	        
	        // 32. Day of Week, Date, Month, Year
	        formatMap.put("[A-Za-z]+, \\d{1,2} [A-Za-z]+ \\d{4}", "EEEE, dd MMMM yyyy"); // Example: Sunday, 31 December 2023

	        // 33. M/D/YY
	        formatMap.put("\\d{1,2}/\\d{1,2}/\\d{2}", "MM/dd/yy"); // Example: 12/31/23

	        // 34. YYYY/MMM
	        formatMap.put("\\d{4}/[A-Za-z]{3}", "yyyy/MMM"); // Example: 2023/Dec 
	 

	        
	            
//	     
//
//	       
//
//	       
//
//	     
//
//	        // 6. YYYY/MM/DD
//	        formatMap.put("^\\d{4}/\\d{2}/\\d{2}$", "%Y/%m/%d"); // Example: 2023/12/31
//
//	        // 7. DD.MM.YYYY
//	        formatMap.put("^\\d{2}\\.\\d{2}\\.\\d{4}$", "%d.%m.%Y"); // Example: 31.12.2023
//
//	        // 8. YYYY.MM.DD
//	        formatMap.put("^\\d{4}\\.\\d{2}\\.\\d{2}$", "%Y.%m.%d"); // Example: 2023.12.31
//
//	        // 9. YYYYMMDD
//	        formatMap.put("^\\d{8}$", "%Y%m%d"); // Example: 20231231
//
//	        // 10. DD Month YYYY
//	        formatMap.put("^\\d{2} [A-Za-z]+ \\d{4}$", "%d %M %Y"); // Example: 31 December 2023
//
//	        // 11. Month DD, YYYY
//	        formatMap.put("^[A-Za-z]+ \\d{2}, \\d{4}$", "%M %d, %Y"); // Example: December 31, 2023
//
//	        // 12. DD-MMM-YYYY
//	        formatMap.put("^\\d{2}-[A-Za-z]{3}-\\d{4}$", "%d-%b-%Y"); // Example: 31-Dec-2023
//
//	        // 13. DD/MMM/YYYY
//	        formatMap.put("^\\d{2}/[A-Za-z]{3}/\\d{4}$", "%d/%b/%Y"); // Example: 31/Dec/2023
//
//	        // 14. DD.MM.YY
//	        formatMap.put("^\\d{2}\\.\\d{2}\\.\\d{2}$", "%d.%m.%y"); // Example: 31.12.23
//
//	        // 15. MM/YYYY
//	        formatMap.put("^\\d{2}/\\d{4}$", "%m/%Y"); // Example: 12/2023
//
//	        // 16. YYYY-MM
//	        formatMap.put("^\\d{4}-\\d{2}$", "%Y-%m"); // Example: 2023-12
//
//	        // 17. MMM DD, YYYY
//	        formatMap.put("^[A-Za-z]{3} \\d{2}, \\d{4}$", "%b %d, %Y"); // Example: Dec 31, 2023
//
//	        // 18. DD-MMM-YY
//	        formatMap.put("^\\d{2}-[A-Za-z]{3}-\\d{2}$", "%d-%b-%y"); // Example: 31-Dec-23
//
//	        // 19. YYYY/MMM/DD
//	        formatMap.put("^\\d{4}/[A-Za-z]{3}/\\d{2}$", "%Y/%b/%d"); // Example: 2023/Dec/31
//
//	        // 20. D-M-YYYY
//	        formatMap.put("^\\d{1,2}-\\d{1,2}-\\d{4}$", "%d-%m-%Y"); // Example: 1-1-2023
//
//	        // 21. M/D/YYYY
//	        formatMap.put("^\\d{1,2}/\\d{1,2}/\\d{4}$", "%d/%m/%Y"); // Example: 1/1/2023
//
//	        // 22. Weekday, DD Month YYYY
//	        formatMap.put("^[A-Za-z]+, \\d{2} [A-Za-z]+ \\d{4}$", "%W, %d %M %Y"); // Example: Sunday, 31 December 2023
//
//	        // 23. Weekday, MM/DD/YYYY
//	        formatMap.put("^[A-Za-z]+, \\d{2}/\\d{2}/\\d{4}$", "%W, %m/%d/%Y"); // Example: Sunday, 12/31/2023
//
//	        // 24. Week Number YYYY-Www
//	        formatMap.put("^\\d{4}-W\\d{2}$", "%Y-W%U"); // Example: 2023-W52
//
//	      
//
//	        // 26. Day of Year YYYY-DDD
//	        formatMap.put("^\\d{4}-\\d{3}$", "%Y-%j"); // Example: 2023-365
//
//	        // 27. ISO Week Date YYYY-Www-D
//	        formatMap.put("^\\d{4}-W\\d{2}-\\d{1}$", "%X-W%U-%w"); // Example: 2023-W52-1
//
//	        // 28. Weekday Name, Month DD YYYY
//	        formatMap.put("^[A-Za-z]+, [A-Za-z]+ \\d{2} \\d{4}$", "%W, %M %d %Y"); // Example: Sunday, December 31 2023
//
//	        // 29. Month Name and Year
//	        formatMap.put("^[A-Za-z]+ \\d{4}$", "%M %Y"); // Example: December 2023
//
//	        // 30. Weekday Shortname DD/MM/YYYY
//	        formatMap.put("^[A-Za-z]{3} \\d{2}/\\d{2}/\\d{4}$", "%a %d/%m/%Y"); // Example: Sun 31/12/2023
//
//	        // 31. Year and Weekday Shortname
//	        formatMap.put("^\\d{4} [A-Za-z]{3}$", "%Y %a"); // Example: 2023 Sun
//
////	        // 32. YYYY-MM-DDTHH:mm:ssZ (ISO 8601)
////	        formatMap.put("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$", "%Y-%m-%dT%H:%i:%sZ"); // Example: 2023-12-31T23:59:59Z
//
////	        // 33. YYYY-MM-DDTHH:mm:ss±hh:mm (RFC 3339)
////	        formatMap.put("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}[+-]\\d{2}:\\d{2}$", "%Y-%m-%dT%H:%i:%s%T"); // Example: 2023-12-31T23:59:59+05:30
//
//	        // 34. Weekday, Month DD, YYYY
//	        formatMap.put("^[A-Za-z]+, [A-Za-z]+ \\d{2}, \\d{4}$", "%W, %M %d, %Y"); // Example: Sunday, December 31, 2023
//
//	        // 35. Day of Week, Day Month YYYY
//	        formatMap.put("^[A-Za-z]{3}, \\d{2} [A-Za-z]+ \\d{4}$", "%a, %d %M %Y"); // Example: Sun, 31 December 2023
//
//	        // 36. Ddd, D Mmm YYYY
//	        formatMap.put("^[A-Za-z]{3}, \\d{1,2} [A-Za-z]{3} \\d{4}$", "%a, %d %b %Y"); // Example: Sun, 31 Dec 2023
//
//	        // 37. YYYY-DDD
//	        formatMap.put("^\\d{4}-\\d{3}$", "%Y-%j"); // Example: 2023-365
//
//	        // 38. Day of Week, Date, Month, Year
//	        formatMap.put("^[A-Za-z]+, \\d{2} [A-Za-z]+ \\d{4}$", "%W, %d %M %Y"); // Example: Sunday, 31 December 2023
//
//	        // 39. M/D/YY
//	        formatMap.put("^\\d{1,2}/\\d{1,2}/\\d{2}$", "%m/%d/%y"); // Example: 12/31/23
//
//	        // 40. YYYY/MMM
//	        formatMap.put("^\\d{4}/[A-Za-z]{3}$", "%Y/%b"); // Example: 2023/Dec
	        
	        
//	     // 1. YYYY-MM-DD
//	        map.put("yyyy-MM-dd", "%Y-%m-%d");
//
//	     // 2. DD/MM/YYYY
//	     map.put("dd/MM/yyyy", "%d/%m/%Y");
//
//	     // 3. MM/DD/YYYY
//	     map.put("MM/dd/yyyy", "%m/%d/%Y");
//
//	     // 4. DD-MM-YYYY
//	     map.put("dd-MM-yyyy", "%d-%m-%Y");
//
//	     // 5. MM-DD-YYYY
//	     map.put("MM-dd-yyyy", "%m-%d-%Y");
//
//	     // 6. YYYY/MM/DD
//	     map.put("yyyy/MM/dd", "%Y/%m/%d");
//
//	     // 7. DD.MM.YYYY
//	     map.put("dd.MM.yyyy", "%d.%m.%Y");
//
//	     // 8. YYYY.MM.DD
//	     map.put("yyyy.MM.dd", "%Y.%m.%d");
//
//	     // 9. YYYYMMDD
//	     map.put("yyyyMMdd", "%Y%m%d");
//
//	     // 10. DD Month YYYY
//	     map.put("dd MMMM yyyy", "%d %M %Y");
//
//	     // 11. Month DD, YYYY
//	     map.put("MMMM dd, yyyy", "%M %d, %Y");
//
//	     // 12. DD-MMM-YYYY
//	     map.put("dd-MMM-yyyy", "%d-%b-%Y");
//
//	     // 13. DD/MMM/YYYY
//	     map.put("dd/MMM/yyyy", "%d/%b/%Y");
//
//	     // 14. DD.MM.YY
//	     map.put("dd.MM.yy", "%d.%m.%y");
//
//	     // 15. MM/YYYY
//	     map.put("MM/yyyy", "%m/%Y");
//
//	     // 16. YYYY-MM
//	     map.put("yyyy-MM", "%Y-%m");
//
//	     // 17. MMM DD, YYYY
//	     map.put("MMM dd, yyyy", "%b %d, %Y");
//
//	     // 18. DD-MMM-YY
//	     map.put("dd-MMM-yy", "%d-%b-%y");
//
//	     // 19. YYYY/MMM/DD
//	     map.put("yyyy/MMM/dd", "%Y/%b/%d");
//
//	     // 20. D-M-YYYY
//	     map.put("d-M-yyyy", "%d-%m-%Y");
//
//	     // 21. M/D/YYYY
//	     map.put("d/M/yyyy", "%d/%m/%Y");
//
//	     // 22. Weekday, DD Month YYYY
//	     map.put("EEEE, dd MMMM yyyy", "%W, %d %M %Y");
//
//	     // 23. Weekday, MM/DD/YYYY
//	     map.put("EEEE, MM/dd/yyyy", "%W, %m/%d/%Y");
//
//	     // 24. Week Number YYYY-Www
//	     map.put("yyyy-'W'ww", "%Y-W%U");
//
//	     // 25. Week Number YYYY-Www-D
//	     map.put("yyyy-'W'ww-d", "%Y-W%U-%w");
//
//	     // 26. Day of Year YYYY-DDD
//	     map.put("yyyy-DDD", "%Y-%j");
//
//	     // 27. ISO Week Date YYYY-Www-D
//	     map.put("yyyy-'W'ww-d", "%X-W%U-%w");
//
//	     // 28. Weekday Name, Month DD YYYY
//	     map.put("EEEE, MMM dd yyyy", "%W, %M %d %Y");
//
//	     // 29. Month Name and Year
//	     map.put("MMMM yyyy", "%M %Y");
//
//	     // 30. Weekday Shortname DD/MM/YYYY
//	     map.put("EEE dd/MM/yyyy", "%a %d/%m/%Y");
//
//	     // 31. Year and Weekday Shortname
//	     map.put("yyyy EEE", "%Y %a");
//
//	     // 32. YYYY-MM-DDTHH:mm:ssZ (ISO 8601)
//	     map.put("yyyy-MM-dd'T'HH:mm:ss'Z'", "%Y-%m-%dT%H:%i:%sZ");
//
//	     // 33. YYYY-MM-DDTHH:mm:ss±hh:mm (RFC 3339)
//	     map.put("yyyy-MM-dd'T'HH:mm:ssXXX", "%Y-%m-%dT%H:%i:%s%T");
//
//	     // 34. Weekday, Month DD, YYYY
//	     map.put("EEEE, MMM dd, yyyy", "%W, %M %d, %Y");
//
//	     // 35. Day of Week, Day Month YYYY
//	     map.put("EEE, dd MMMM yyyy", "%a, %d %M %Y");
//
//	     // 36. Ddd, D Mmm YYYY
//	     map.put("EEE, d MMM yyyy", "%a, %d %b %Y");
//
//	     // 37. YYYY-DDD
//	     map.put("yyyy-DDD", "%Y-%j");
//
//	     // 38. Day of Week, Date, Month, Year
//	     map.put("EEEE, dd MMMM yyyy", "%W, %d %M %Y");
//
//	     // 39. M/D/YY
//	     map.put("M/d/yy", "%m/%d/%y");
//
//	     // 40. YYYY/MMM
//	     map.put("yyyy/MMM", "%Y/%b");



	        return formatMap;
	    }
	    
	    
	    
	    
	    public static Map<String, String> getTimeFormatMap() {
	        Map<String, String> timeFormatMap = new HashMap<>();

	     // 1. HH:mm:ss
	     timeFormatMap.put("\\d{2}:\\d{2}:\\d{2}", "HH:mm:ss"); // Example: 14:30:00

	     // 2. hh:mm:ss a
	     timeFormatMap.put("\\d{2}:\\d{2}:\\d{2}\\s(?i)(AM|PM)", "hh:mm:ss a"); // Example: 02:30:00 PM

	     // 3. HH:mm
	     timeFormatMap.put("\\d{2}:\\d{2}", "HH:mm"); // Example: 14:30

	     // 4. hh:mm a
	     timeFormatMap.put("\\d{2}:\\d{2}\\s(?i)(AM|PM)", "hh:mm a"); // Example: 02:30 PM

	     // 5. HH:mm:ss.SSS
	     timeFormatMap.put("\\d{2}:\\d{2}:\\d{2}\\.\\d{3}", "HH:mm:ss.SSS"); // Example: 14:30:00.123

	     // 6. hh:mm:ss.SSS a
	     timeFormatMap.put("\\d{2}:\\d{2}:\\d{2}\\.\\d{3}\\s(?i)(AM|PM)", "hh:mm:ss.SSS a"); // Example: 02:30:00.123 PM

	     // 7. HH:mm:ss Z
	     timeFormatMap.put("\\d{2}:\\d{2}:\\d{2}\\s[+-]\\d{4}", "HH:mm:ss Z"); // Example: 14:30:00 +0530

	     // 8. hh:mm:ss a Z
	     timeFormatMap.put("\\d{2}:\\d{2}:\\d{2}\\s(?i)(AM|PM)\\s[+-]\\d{4}", "hh:mm:ss a Z"); // Example: 02:30:00 PM +0530

	     // 9. HH:mm:ss.SSS Z
	     timeFormatMap.put("\\d{2}:\\d{2}:\\d{2}\\.\\d{3}\\s[+-]\\d{4}", "HH:mm:ss.SSS Z"); // Example: 14:30:00.123 +0530

	     // 10. hh:mm:ss.SSS a Z
	     timeFormatMap.put("\\d{2}:\\d{2}:\\d{2}\\.\\d{3}\\s(?i)(AM|PM)\\s[+-]\\d{4}", "hh:mm:ss.SSS a Z"); // Example: 02:30:00.123 PM +0530

	     // 11. HH:mm:ss.SSSXXX
	     timeFormatMap.put("\\d{2}:\\d{2}:\\d{2}\\.\\d{3}[+-]\\d{2}:\\d{2}", "HH:mm:ss.SSSXXX"); // Example: 14:30:00.123+05:30

	      timeFormatMap.put("(\\d{2}):(\\d{2}):(\\d{2})\\s(?i)(AM|PM)\\s([+-]\\d{2}:\\d{2})", "hh:mm:ss a XXX"); // Example: 02:30:00 PM +05:30

	     // 13. HH:mm:ss.SSSSSS
	     timeFormatMap.put("\\d{2}:\\d{2}:\\d{2}\\.\\d{6}", "HH:mm:ss.SSSSSS"); // Example: 14:30:00.123456

	     // 14. hh:mm:ss a.SSSSSS
	     timeFormatMap.put("\\d{2}:\\d{2}:\\d{2}\\.\\d{6}\\s(?i)(AM|PM)", "hh:mm:ss.SSSSSS a"); // Example: 02:30:00.123456 PM

	     // 15. HH:mm:ss.SSSSSS Z
	     timeFormatMap.put("\\d{2}:\\d{2}:\\d{2}\\.\\d{6}\\s[+-]\\d{4}", "HH:mm:ss.SSSSSS Z"); // Example: 14:30:00.123456 +0530

	     // 16. hh:mm:ss.SSSSSS a Z
	     timeFormatMap.put("\\d{2}:\\d{2}:\\d{2}\\.\\d{6}\\s(?i)(AM|PM)\\s[+-]\\d{4}", "hh:mm:ss.SSSSSS a Z"); // Example: 02:30:00.123456 PM +0530

	     // 17. HH:mm:ss.SSSSSSXXX
	     timeFormatMap.put("\\d{2}:\\d{2}:\\d{2}\\.\\d{6}[+-]\\d{2}:\\d{2}", "HH:mm:ss.SSSSSSXXX"); // Example: 14:30:00.123456+05:30

	     // 18. hh:mm:ss.SSSSSS aXXX
	     timeFormatMap.put("\\d{2}:\\d{2}:\\d{2}\\.\\d{6}\\s(?i)(AM|PM)\\s[+-]\\d{2}:\\d{2}", "hh:mm:ss.SSSSSS a XXX"); // Example: 02:30:00.123456 PM +05:30

	     // 19. HH:mm Z
	     timeFormatMap.put("\\d{2}:\\d{2}\\s[+-]\\d{4}", "HH:mm Z"); // Example: 14:30 +0530


//	        // 1. HH:mm:ss
//	        timeFormatMap.put("^(\\d{2}):(\\d{2}):(\\d{2})$", "%H:%i:%s"); // Example: 14:30:00
//
//	        // 2. hh:mm:ss a
//	        timeFormatMap.put("^(\\d{2}):(\\d{2}):(\\d{2})\\s(AM|PM)$", "%h:%i:%s %p"); // Example: 02:30:00 PM
//
//	        // 3. HH:mm
//	        timeFormatMap.put("^(\\d{2}):(\\d{2})$", "%H:%i"); // Example: 14:30
//
//	        // 4. hh:mm a
//	        timeFormatMap.put("^(\\d{2}):(\\d{2})\\s(AM|PM)$", "%h:%i %p"); // Example: 02:30 PM
//
//	        // 5. HH:mm:ss.SSS
//	        timeFormatMap.put("^(\\d{2}):(\\d{2}):(\\d{2})\\.(\\d{3})$", "%H:%i:%s.%f"); // Example: 14:30:00.123
//
//	        // 6. hh:mm:ss.SSS a
//	        timeFormatMap.put("^(\\d{2}):(\\d{2}):(\\d{2})\\.(\\d{3})\\s(AM|PM)$", "%h:%i:%s.%f %p"); // Example: 02:30:00.123 PM
//
//	        // 7. HH:mm:ss Z
//	        timeFormatMap.put("^(\\d{2}):(\\d{2}):(\\d{2})\\s([+-]\\d{4})$", "%H:%i:%s %z"); // Example: 14:30:00 +0530
//
//	        // 8. hh:mm:ss a Z
//	        timeFormatMap.put("^(\\d{2}):(\\d{2}):(\\d{2})\\s(AM|PM)\\s([+-]\\d{4})$", "%h:%i:%s %p %z"); // Example: 02:30:00 PM +0530
//
//	        // 9. HH:mm:ss.SSS Z
//	        timeFormatMap.put("^(\\d{2}):(\\d{2}):(\\d{2})\\.(\\d{3})\\s([+-]\\d{4})$", "%H:%i:%s.%f %z"); // Example: 14:30:00.123 +0530
//
//	        // 10. hh:mm:ss.SSS a Z
//	        timeFormatMap.put("^(\\d{2}):(\\d{2}):(\\d{2})\\.(\\d{3})\\s(AM|PM)\\s([+-]\\d{4})$", "%h:%i:%s.%f %p %z"); // Example: 02:30:00.123 PM +0530
//
//	        // 11. HH:mm:ss.SSSXXX
//	        timeFormatMap.put("^(\\d{2}):(\\d{2}):(\\d{2})\\.(\\d{3})\\s([+-]\\d{2}:\\d{2})$", "%H:%i:%s.%f %:z"); // Example: 14:30:00.123 +05:30
//
//	        // 12. hh:mm:ss a XXX
//	        timeFormatMap.put("^(\\d{2}):(\\d{2}):(\\d{2})\\s(AM|PM)\\s([+-]\\d{2}:\\d{2})$", "%h:%i:%s %p %:z"); // Example: 02:30:00 PM +05:30
//
//	        // 13. HH:mm:ss.SSSSSS
//	        timeFormatMap.put("^(\\d{2}):(\\d{2}):(\\d{2})\\.(\\d{6})$", "%H:%i:%s.%f"); // Example: 14:30:00.123456
//
//	        // 14. hh:mm:ss a.SSSSSS
//	        timeFormatMap.put("^(\\d{2}):(\\d{2}):(\\d{2})\\.(\\d{6})\\s(AM|PM)$", "%h:%i:%s.%f %p"); // Example: 02:30:00.123456 PM
//
//	        // 15. HH:mm:ss.SSSSSS Z
//	        timeFormatMap.put("^(\\d{2}):(\\d{2}):(\\d{2})\\.(\\d{6})\\s([+-]\\d{4})$", "%H:%i:%s.%f %z"); // Example: 14:30:00.123456 +0530
//
//	        // 16. hh:mm:ss a.SSSSSS Z
//	        timeFormatMap.put("^(\\d{2}):(\\d{2}):(\\d{2})\\.(\\d{6})\\s(AM|PM)\\s([+-]\\d{4})$", "%h:%i:%s.%f %p %z"); // Example: 02:30:00.123456 PM +0530
//
//	        // 17. HH:mm:ss.SSSSSSXXX
//	        timeFormatMap.put("^(\\d{2}):(\\d{2}):(\\d{2})\\.(\\d{6})\\s([+-]\\d{2}:\\d{2})$", "%H:%i:%s.%f %:z"); // Example: 14:30:00.123456 +05:30
//
//	        // 18. hh:mm:ss a.SSSSSS XXX
//	        timeFormatMap.put("^(\\d{2}):(\\d{2}):(\\d{2})\\.(\\d{6})\\s(AM|PM)\\s([+-]\\d{2}:\\d{2})$", "%h:%i:%s.%f %p %:z"); // Example: 02:30:00.123456 PM +05:30
//
//	        // 19. HH:mm Z
//	        timeFormatMap.put("^(\\d{2}):(\\d{2})\\s([+-]\\d{4})$", "%H:%i %z"); // Example: 14:30 +0530
	        	        
	        return timeFormatMap;
	    }
	
	
	 private static Set<String> reservedKeywords = Set.of(
		        "ACCESSIBLE", "ADD", "ALL", "ALTER", "ANALYZE", "AND", "AS", "ASC", "ASENSITIVE",
		        "BEFORE", "BETWEEN", "BIGINT", "BINARY", "BLOB", "BOTH", "BY", "CALL", "CASCADE",
		        "CASE", "CHANGE", "CHAR", "CHARACTER", "CHECK", "COLLATE", "COLUMN", "CONDITION",
		        "CONSTRAINT", "CONTINUE", "CONVERT", "CREATE", "CROSS", "CUBE", "CURRENT_DATE",
		        "CURRENT_TIME", "CURRENT_TIMESTAMP", "CURRENT_USER", "CURSOR", "DATABASE", "DATABASES",
		        "DAY_HOUR", "DAY_MICROSECOND", "DAY_MINUTE", "DAY_SECOND", "DEC", "DECIMAL", "DECLARE",
		        "DEFAULT", "DELAYED", "DELETE", "DESC", "DESCRIBE", "DETERMINISTIC", "DISTINCT",
		        "DISTINCTROW", "DIV", "DOUBLE", "DROP", "DUAL", "EACH", "ELSE", "ELSEIF", "ENCLOSED",
		        "ESCAPED", "EXISTS", "EXIT", "EXPLAIN", "FALSE", "FETCH", "FLOAT", "FLOAT4", "FLOAT8",
		        "FOR", "FORCE", "FOREIGN", "FROM", "FULLTEXT", "FUNCTION", "GENERATED", "GET", "GRANT",
		        "GROUP", "HAVING", "HIGH_PRIORITY", "HOUR_MICROSECOND", "HOUR_MINUTE", "HOUR_SECOND",
		        "IF", "IGNORE", "IN", "INDEX", "INFILE", "INNER", "INOUT", "INSERT", "INT", "INT1",
		        "INT2", "INT3", "INT4", "INT8", "INTEGER", "INTERVAL", "INTO", "IS", "ITERATE", "JOIN",
		        "KEY", "KEYS", "KILL", "LEADING", "LEAVE", "LEFT", "LIKE", "LIMIT", "LINES", "LOAD",
		        "LOCALTIME", "LOCALTIMESTAMP", "LOCK", "LONG", "LONGBLOB", "LONGTEXT", "LOOP", "LOW_PRIORITY",
		        "MASTER_BIND", "MATCH", "MAXVALUE", "MEDIUMBLOB", "MEDIUMINT", "MEDIUMTEXT", "MIDDLEINT",
		        "MINUTE_MICROSECOND", "MINUTE_SECOND", "MOD", "MODIFIES", "NATURAL", "NOT", "NO_WRITE_TO_BINLOG",
		        "NULL", "NUMERIC", "ON", "OPTIMIZE", "OPTION", "OPTIONALLY", "OR", "ORDER", "OUT", "OUTER",
		        "OUTFILE", "PARTITION", "PRECISION", "PRIMARY", "PROCEDURE", "PURGE", "RANGE", "READ",
		        "READS", "REAL", "REFERENCES", "REGEXP", "RELEASE", "RENAME", "REPEAT", "REPLACE", "REQUIRE",
		        "RESIGNAL", "RESTRICT", "RETURN", "REVOKE", "RIGHT", "RLIKE", "SCHEMA", "SCHEMAS", "SECOND_MICROSECOND",
		        "SELECT", "SENSITIVE", "SEPARATOR", "SET", "SHOW", "SIGNAL", "SMALLINT", "SPATIAL", "SPECIFIC",
		        "SQL", "SQLEXCEPTION", "SQLSTATE", "SQLWARNING", "SQL_BIG_RESULT", "SQL_CALC_FOUND_ROWS",
		        "SQL_SMALL_RESULT", "SSL", "STARTING", "STORED", "STRAIGHT_JOIN", "TABLE", "TERMINATED",
		        "THEN", "TINYBLOB", "TINYINT", "TINYTEXT", "TO", "TRAILING", "TRIGGER", "TRUE", "UNDO",
		        "UNION", "UNIQUE", "UNLOCK", "UNSIGNED", "UPDATE", "USAGE", "USE", "USING", "VALUES",
		        "VARCHAR", "WHEN", "WHERE", "WHILE", "WITH", "WRITE", "XOR", "YEAR_MONTH", "ZEROFILL"
		    );
	 
	 public static String checkDateTime(String input) {
	       
	        Set<String> allowedPrefixes = new HashSet<>(Arrays.asList(
	            "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec",
	            "sun", "mon", "tue", "wed", "thu", "fri", "sat"
	        ));
	        Set<String> exactMatchesForTime = new HashSet<>(Arrays.asList(
	                "am", "pm", "t", 
	                "utc", "gmt", "est", "edt", "cst", "cdt", 
	                "mst", "mdt", "pst", "pdt", "akst", "akdt", 
	                "hst", "ist", "cet", "cest", "eet", "eest", 
	                "aest", "aedt", "acst", "acdt", "nzst", "nzdt"
	            ));
	        Set<String> exactMatchesForDate = new HashSet<>(Arrays.asList("w"));

	     
	        List<String> alphabeticStrings = new ArrayList<>();
	        Matcher matcher = Pattern.compile("[a-zA-Z]+",Pattern.CASE_INSENSITIVE).matcher(input);
	        while (matcher.find()) {
	            alphabeticStrings.add(matcher.group().toLowerCase());
	        }

	        System.out.println(alphabeticStrings);
	       
	        boolean haveDate = true;
	        boolean haveTime = true;

	        
	        for (String str : alphabeticStrings) {
	        
	          
	            if ( !(allowedPrefixes.stream().anyMatch(str::startsWith) || exactMatchesForDate.contains(str) || exactMatchesForTime.contains(str)) ) {
	                haveDate = false;
	                haveTime = false;
	            }
	          
	        }
	        
	         if (!haveDate && !haveTime) {
	            return "x"; 
	        }
	        
	        
	       Set<String> validSymbols = new HashSet<>(Arrays.asList("-", ",", ".", "/", "+", ":", " "));

	       
	        List<String> extractedSymbols = new ArrayList<>();
	        matcher = Pattern.compile("[^a-zA-Z0-9]",Pattern.CASE_INSENSITIVE).matcher(input);
	        while (matcher.find()) {
	            extractedSymbols.add(matcher.group());
	        }

	        System.out.println(extractedSymbols);
	        
	        for (String symbol : extractedSymbols) {
	            if (!validSymbols.contains(symbol)) {
	                 haveDate = false;
	                haveTime = false;
	            }
	        }

	         if (!haveDate && !haveTime) {
	            return "x"; 
	        }
	        
	        String returningString = input;
	        String processingString1 = input;
	        String processingString2 = input;
	      
	        
	         if (extractedSymbols.contains(":")) {
	           
	            Map<String, String> timeFormatMap = GlobalData.getTimeFormatMap();

	          
	            for (String regex : timeFormatMap.keySet()) {
	                Pattern pattern = Pattern.compile(regex,Pattern.CASE_INSENSITIVE);
	                matcher = pattern.matcher(input);

	             
	                while (matcher.find()) {
	                    String matchedPart = matcher.group();
	                    String formatValue = timeFormatMap.get(regex);


	                    processingString2 = processingString2.replaceFirst(Pattern.quote(matchedPart), "_");
	                    
	                 

	                    if(processingString2.length() < processingString1.length()){
	                      
	                    
	                    processingString1 = processingString2;

	                   
	                  
	                    returningString = processingString1.replaceFirst("_",formatValue);
	                    
	                      
	                    }

	                  processingString2 = input;
	                    
	                   
	                }
	            }
	        } else {
	            
	            haveTime = false;
	        }
	        
	        processingString2=returningString;
	        String returningStringFinal = returningString;
	        
	     
	        System.out.println("after time match : "+ processingString2);
	        
	        if(processingString1.trim().equals("_") ){
	          haveDate = false;
	        }
	        else{
	          
	            processingString1=returningString;
	          
	            Map<String, String> dateFormatMap = GlobalData.getDateFormatMap();

	          
	            for (String regex : dateFormatMap.keySet()) {
	                Pattern pattern = Pattern.compile(regex,Pattern.CASE_INSENSITIVE);
	                matcher = pattern.matcher(processingString2);

	             
	                while (matcher.find()) {
	                    String matchedPart = matcher.group();
	                    String formatValue = dateFormatMap.get(regex);


	                    processingString2 = processingString2.replaceFirst(Pattern.quote(matchedPart), "!");
	                    
	                  

	                    if(processingString2.length() < processingString1.length()){
	                      
	                    
	                    processingString1 = processingString2;

	                   
	                   
	                    returningStringFinal = processingString1.replaceFirst("!",formatValue);
	                    
	                      
	                    }

	                  processingString2 = returningString;
	                    
	                   
	                }
	          
	        }
	        }
	        
	       if(returningStringFinal.equals(input)) {
	    	   return "x";
	       }
	       
	        System.out.println("returning : "+returningStringFinal);
	        
	     if (!haveDate && !haveTime) {
	            return "x"; 
	        }
	        else if (haveDate && haveTime){
	          
	          returningStringFinal="DATETIME&"+ returningStringFinal;
	        }
	         else if (haveDate && !haveTime){
	          
	          returningStringFinal="DATE&"+ returningStringFinal;
	        }
	        
	        else if (!haveDate && haveTime){
	          
	          returningStringFinal="TIME&"+ returningStringFinal;
	        }

	      
	        return returningStringFinal; 
	    }

	
	
       public static String findDataType(String value) {
	    
	    value = value.trim();
	    
	   
	    if (value.isEmpty()) {
	        return "VARCHAR"; 
	    }    
	    else if (value.matches("^-?\\d+$")) {
	        String absoluteValue = value.startsWith("-") ? value.substring(1) : value; 
	        if (absoluteValue.length() > 10) {
	            return "BIGINT";
	        } else if (absoluteValue.length() == 10) {
	            int firstTwoDigits = Integer.parseInt(absoluteValue.substring(0, 2));
	            if (firstTwoDigits > 20) {
	                return "BIGINT";
	            }
	        }
	        return "INT";
	    }
	    else if (value.matches("^-?\\d+\\.\\d+$")) {
	        return "DECIMAL";
	    }   
	    else if (value.equalsIgnoreCase("true") || value.equalsIgnoreCase("false")) {
	        return "BOOLEAN";
	    }
	 
	    else {
	    	
	    	String isDate = GlobalData.checkDateTime(value);
	    	
	    	if(!isDate.equalsIgnoreCase("x")) {
	    		return isDate;
	    	}
	    	
	 
	        return "VARCHAR" ;
	            
	       
	    }
	  }
	

	
	public static String getValidName(String name, int...value) {
		
		int index= (value.length > 0) ? value[0] : -1;
		  
	    if (name == null || name.trim().isEmpty()) {
	    	if(index==-1) return "table_x" ;
	        return "Column_" + index;
	    }
	    name = name.trim();

	   
	    if (Character.isDigit(name.charAt(0))) {
	        name = "_" + name;
	        
	    }

	    
	    name = name.replaceAll("[^a-zA-Z0-9_]", "_");

	    
	    Set<String> reservedKeywords = GlobalData.reservedKeywords;

	    
	    if (reservedKeywords.contains(name.toUpperCase())) {
	        name = name + "_";
	    }

	    return name;
	}

	
	public static   HashSet<String> queryTables(String query ) {
       
        String[] patterns = {
           "\\bFROM\\s+(\\w+)",                
            "\\bINSERT\\s+INTO\\s+(\\w+)",       
            "\\bUPDATE\\s+(\\w+)",              
            "\\bJOIN\\s+(\\w+)",                 
            "\\bTABLE\\s+(\\w+)",
            "(?i)\\b(DESC|DESCRIBE)\\s+(\\w+)",
            "\\bFROM\\s+((?:\\w+(?:\\s+\\w+)?\\s*,\\s*)*\\w+(?:\\s+\\w+)?)"
         
        };
        
        HashSet<String> uniqueTableNames = new HashSet<>();

        
        for (String pattern : patterns) {
            Pattern regex = Pattern.compile(pattern, Pattern.CASE_INSENSITIVE);
            Matcher matcher = regex.matcher(query);

            while (matcher.find()) {
                for (int i = 1; i <= matcher.groupCount(); i++) {
                    
                    if(pattern.contains("FROM")&&pattern.contains("?")){
                        
                        String tables = matcher.group(1);
                        List<String> tableList = new ArrayList<>(Arrays.asList(tables.split("\\s*,\\s*")));
                        for(String tableName : tableList){
                          uniqueTableNames.add(tableName.split("\\s+")[0]);}
                    }else if(pattern.contains("DESC")){
                        String tableName = matcher.group(2);
                        uniqueTableNames.add(tableName);
                   }
                    else{
                    
                    String tableName = matcher.group(i);
                    if (tableName != null && !tableName.isBlank()) {
                        uniqueTableNames.add(tableName); 
                    }
                   }
                }
            }
        }

        return uniqueTableNames ;
      
    }
	
	public static String renameQuery(String query, String userId) throws Exception {

		HashSet<String> uniqueTableNames = queryTables(query);
		
        for (String tableName : uniqueTableNames) {
            if (!tableName.endsWith("$" + userId)) {
                query = query.replaceAll("\\b" + tableName + "\\b", tableName + "\\$" + userId);
            }
        }

        return query;

	}
	
	
	public static int getChunkCount(String filePath) throws java.io.IOException  {
        int numberOfLines = 1;  

        
           
            long totalFileSize = Files.size(Paths.get(filePath));
            System.out.println("Total file size: " + totalFileSize + " bytes");

           
            BufferedReader reader = new BufferedReader(new FileReader(filePath));
            String firstLine = reader.readLine();
            
            if (firstLine == null) {
            	 reader.close();
                return 0;
            }
            
            String secondLine = reader.readLine();
            if (secondLine == null) {
           	  reader.close();
               return 1;
           }
           
              
                int secondLineSize = secondLine.getBytes().length;
                System.out.println("First line size: " + secondLineSize + " bytes");

               
                numberOfLines = (int) (totalFileSize / secondLineSize);
                System.out.println("Calculated number of lines: " + numberOfLines);
                
                
                int chunkSize = numberOfLines / 10 ;
                
                
                System.out.println("chunkSize:"+chunkSize);
           
                if(chunkSize <=100) {
                	 reader.close();
                  	return numberOfLines;      	
                	
                }
                else {
               
                	reader.close();
                	return chunkSize ;
                
                }
        
    }
	
	
	public static String[] extractRowData(Row row , Workbook workbook) {
		
		FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator(); 
	    List<String> rowData = new ArrayList<>();
	    for (Cell cell : row) {
	    	
	        switch (cell.getCellType()) {
	            case STRING:
	                rowData.add(cell.getStringCellValue());
	                break;
	            case NUMERIC:
	            	if (DateUtil.isCellDateFormatted(cell)) {
	                    rowData.add(cell.getDateCellValue().toString());
	                } else {
	                    double numericValue = cell.getNumericCellValue();
	                    if (numericValue == Math.floor(numericValue)) {
	                       
	                        rowData.add(String.valueOf((int) numericValue));
	                    } else {
	                        
	                        rowData.add(String.valueOf(numericValue));
	                    }
	                }
	            	break;
	            case BOOLEAN:
	                rowData.add(String.valueOf(cell.getBooleanCellValue()));
	                break;
	            case FORMULA:
	            	 CellValue evaluatedValue = evaluator.evaluate(cell); // Evaluate the formula
	                 if (evaluatedValue != null) {
	                     switch (evaluatedValue.getCellType()) {
	                         case STRING:
	                             rowData.add(evaluatedValue.getStringValue());
	                             break;
	                         case NUMERIC:
	                             rowData.add(String.valueOf(evaluatedValue.getNumberValue()));
	                             break;
	                         case BOOLEAN:
	                             rowData.add(String.valueOf(evaluatedValue.getBooleanValue()));
	                             break;
	                         default:
	                             rowData.add("Unsupported Type");
	                     }
	                 } else {
	                     rowData.add("Error Evaluating Formula");
	                 }
	                 break;
	            case BLANK:
	                rowData.add("");
	                break;
	            default:
	                rowData.add("Unsupported Type");
	        }
	    }
	    return rowData.toArray(new String[0]);
	}


   
}


