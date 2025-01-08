package com.task.TableViewR;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.StringReader;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.io.FileInputStream;
import java.io.InputStream;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvValidationException;


@RestController
@RequestMapping("/api")
public class FileDataController {

	 @Autowired
	 private TablesRepository tablesRepository;  
	 
//	 @Autowired
//	 private UserRepository userRepository;  
	 
	 @Autowired
	 private TableInfo tableInfo ;
  
   
	 @GetMapping("/tableInfo")
	 public ResponseEntity<Map<String, Object>> processCsvFile(
	         @RequestAttribute("userName") String userName,
	         @RequestHeader("X-Table-Id") Long tableId) {

//		 Users user = userRepository.findByEmail(userName);
//	 	    if (user == null) {
//	 	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//	 	                .body(Map.of(
//	 	                        "message", "User not found. Login again",
//	 	                        "error", "Unauthorized access. User record not found in the database for username: " + userName
//	 	                ));
//	 	    }

	     String fileName = tablesRepository.findFileNameByEmailAndId(userName, tableId);
	     if (fileName == null) {
	         return ResponseEntity.badRequest()
	                 .body(Map.of("message", "File upload failed , try reuploading !!", 
	                              "error", "File name lookup failed"));
	     }

	     String filePath = GlobalData.getFilePath() + "/" + userName + "/" + fileName;
	     File file = new File(filePath);
         if (!file.exists()) {
             return ResponseEntity.status(HttpStatus.NOT_FOUND)
                     .body(Map.of("message", "File upload failed , try reuploading !!", 
                                  "error", "File does not exist at: " + filePath));
         }
	    
	     
	     
         String headerLine[]= null;
         String dataLine[]=null;
         
         Random random = new Random();
         int randomLineNumber = random.nextInt(10) + 2; 
         
         
         
         
         
         if (filePath.endsWith(".xlsx") || filePath.endsWith(".xls")) {
        	 
        	 
        	  try (InputStream fis = new FileInputStream(file);
    	              Workbook workbook = fileName.endsWith(".xlsx") ? new XSSFWorkbook(fis) : new HSSFWorkbook(fis)) {

    	             Sheet sheet = workbook.getSheetAt(0); 
    	             int totalRows = sheet.getLastRowNum() + 1; 

    	             if (totalRows < randomLineNumber) {
    	                 randomLineNumber = totalRows; 
    	             }

    	            
    	             Row headerRow = sheet.getRow(0);
    	             for (Cell cell : headerRow) {
    	     	    	System.out.println("printing cellType header : "+cell.getCellType().toString());}
    	             if (headerRow != null) {
    	                 headerLine = GlobalData.extractRowData(headerRow , workbook);
    	             }

    	             Row randomRow = sheet.getRow( randomLineNumber-1); 
    	             for (Cell cell : randomRow) {
     	     	    	System.out.println("printing cellType data 2 : "+cell.getCellType().toString());}
    	             if (randomRow != null) {
    	                 dataLine = GlobalData.extractRowData(randomRow , workbook);
    	             }
    	             
//    	             int columnCount = randomRow.getLastCellNum();
//    	             
//    	             for(int i = 0 ; i < columnCount; i++) {
//    	            	 Cell cell = randomRow.getCell(i);
//    	            	 if(cell == null) {
//    	            		System.out.println(cell);
//    	            	 } else {
//    	            		 System.out.println(cell);
//    	            	 }
//    	             }
    	             
    	             if (headerLine.length != dataLine.length) {
    	            	 
    	            	 return ResponseEntity.status(HttpStatus.NOT_FOUND)
    	                         .body(Map.of("message", "Invalid record found at row :" + randomLineNumber + ". Number of records didn't match with number of columns!!")); 
    	                                  
	                    }
    	             
    	             
    	             System.out.println("Header row "+Arrays.asList(headerLine));
   	             System.out.println("Data row , no:"+ randomLineNumber+"   "+Arrays.asList(dataLine));
    	             
    	         }  catch (IOException e) {
    		         e.printStackTrace();
    		         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
    		                 .body(Map.of(
    		                         "message", "Couldn't read the file .Try reuploading. Also ensure that file contains proper tabular content.",
    		                         "error", e.getMessage()
    		                 ));
    		     }   catch (Exception e) {
    	             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
    	                     .body(Map.of("message", "Failed in processing the Excel file . Try reuploading. Also ensure that file contains proper tabular content"));
    	         }
        	 
         }else {
        

	     try {
	    	 String line1 = null;
	         String lineX = null;
	         int currentLineNumber = 0;

	         try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
	             String line;
	             while ((line = reader.readLine()) != null) {
	                 currentLineNumber++;

	                 if (currentLineNumber == 1) {
	                     line1 = line;
	                 }

	                 if (currentLineNumber <= randomLineNumber) {
	                     lineX = line;
	                 }
	             }
	         }
	       
	        tableInfo.findDelimiter(line1);
	        CSVParserBuilder parserBuilder = new CSVParserBuilder();
            parserBuilder.withSeparator(tableInfo.getDelimiter().charAt(0));

           
            StringReader stringReader = new StringReader(line1);
            CSVReader csvReader = new CSVReaderBuilder(stringReader)
                    .withCSVParser(parserBuilder.build())
                    .build();

             headerLine = csvReader.readNext();
            
             stringReader = new StringReader(lineX);
             csvReader = new CSVReaderBuilder(stringReader)
                    .withCSVParser(parserBuilder.build())
                    .build();
             dataLine = csvReader.readNext();
             
             
             
             if (headerLine.length != dataLine.length) {
            	 
            	 return ResponseEntity.status(HttpStatus.NOT_FOUND)
                         .body(Map.of("message", "Invalid record found at row :" + randomLineNumber + ". Number of records didn't match with number of columns !!")); 
                                  
                }
             
             
             csvReader.close();
            
	         } catch (CsvValidationException e) {
		         e.printStackTrace();
		         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
		                 .body(Map.of(
		                         "message", "Invalid file content structure. Please ensure the file content is in proper tabular format.",
		                         "error", e.getMessage()
		                 ));
		     } catch (IOException e) {
		         e.printStackTrace();
		         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
		                 .body(Map.of(
		                         "message", "Couldn't read the file .Try reuploading. Also ensure that file contains proper tabular content.",
		                         "error", e.getMessage()
		                 ));
		     }             
	         catch(Exception e ) {
	        	 
	        	 return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                     .body(Map.of("message", "Couldn't read the file .Check the file structure as it would contain proper tabular content!!", 
	                                  "error", "File does not exist at: " + filePath));
	        	 
	         }
         } 
	    
	         tableInfo.setTableName(GlobalData.getValidName(file.getName().replaceFirst("\\.[^.]+$", "")));
	         tableInfo.setColumnCount(headerLine.length);
	         System.out.println(headerLine.length);
	         tableInfo.setColumnDataTypes1(dataLine);
	         tableInfo.lengthAdjuster(tableInfo.getColumnDataTypes());
	         tableInfo.setColumnNames1(tableInfo.getColumnDataTypes(), headerLine);
	    
	
	 
	         Map<String, Object> response = new HashMap<>();
	         response.put("tableInfo", tableInfo);

	         return ResponseEntity.ok(response);

	     } 	
	 
}
	 
	 
	 