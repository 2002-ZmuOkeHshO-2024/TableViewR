package com.task.TableViewR;


import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvValidationException;

import java.io.BufferedReader;
import java.io.FileInputStream;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class FileUploadController {
    
    @Autowired
    private TablesRepository tablesRepository;  
    
    
    private final String UPLOAD_DIR = GlobalData.getFilePath();

    private final Map<String, Integer> chunkUploadCount = new HashMap<>();
    private final Map<String, Integer> chunkCounts = new HashMap<>();

    @PostMapping("/chunkUpload")
    public ResponseEntity<Map<String, Object>> uploadChunk(
            @RequestParam("file") MultipartFile chunkFile,
            @RequestParam("fileId") String fileId,
            @RequestParam("chunkIndex") int chunkIndex,
            @RequestParam("chunkCount") int chunkCount,
            @RequestAttribute("userName") String userName) {
    	
//    	 Users user = userRepository.findByEmail(userName);
//  	    if (user == null) {
//  	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//  	                .body(Map.of(
//  	                        "message", "User not found. Login again",
//  	                        "error", "Unauthorized access. User record not found in the database for username: " + userName
//  	                ));
//  	    }
    	

        Map<String, Object> response = new HashMap<>();

        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));

            String uniqueFileId = userName + "_" + fileId;
            Path chunkPath = Paths.get(UPLOAD_DIR + uniqueFileId + "_chunk_" + chunkIndex);
            chunkFile.transferTo(chunkPath);

            if (Files.exists(chunkPath)) {
                chunkUploadCount.put(uniqueFileId, chunkUploadCount.getOrDefault(uniqueFileId, 0) + 1);
            }

            chunkCounts.putIfAbsent(uniqueFileId, chunkCount);

            response.put("message", "Chunk " + chunkIndex + " uploaded successfully");
 
               
           return ResponseEntity.ok(response);
            
            
           
        } catch (Exception e) {
            e.printStackTrace();
            response.put("message", "Uploading your file failed, kindly try again");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
        
    }

    @PostMapping("/mergingChunks")
    public ResponseEntity<Map<String, Object>> mergeChunks(
            @RequestParam("fileId") String fileId,
            @RequestParam("fileName") String fileName,
            @RequestAttribute("userName") String userName) {

//    	 Users user = userRepository.findByEmail(userName);
//  	    if (user == null) {
//  	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//  	                .body(Map.of(
//  	                        "message", "User not found. Login again",
//  	                        "error", "Unauthorized access. User record not found in the database for username: " + userName
//  	                ));
//  	    }

        try {
            String uniqueFileId = userName + "_" + fileId;
            int uploadedChunks = chunkUploadCount.getOrDefault(uniqueFileId, 0);
            int expectedChunks = chunkCounts.getOrDefault(uniqueFileId, 0);
            
            if(expectedChunks == 0) {
            	return ResponseEntity.badRequest().body(Map.of(
                        "message", "Empty file can't be uploaded." 
                ));          	
            }

            if (uploadedChunks != expectedChunks) {
                return ResponseEntity.badRequest().body(Map.of(
                        "message", "Uploading your file failed, kindly try again"
                ));
            }

            Path userDir = Paths.get(UPLOAD_DIR + userName);
            if (!Files.exists(userDir)) {
                Files.createDirectories(userDir);
            }

            Path finalFilePath = userDir.resolve(fileName);
            try (OutputStream outputStream = Files.newOutputStream(finalFilePath, StandardOpenOption.CREATE)) {
                for (int i = 0; i < expectedChunks; i++) {
                    Path chunkPath = Paths.get(UPLOAD_DIR + uniqueFileId + "_chunk_" + i);
                    if (Files.exists(chunkPath)) {
                        Files.copy(chunkPath, outputStream);
                        Files.delete(chunkPath);
                    } else {
                        return ResponseEntity.badRequest().body(Map.of(
                                "message", "Uploading your file failed, kindly try again"
                        ));
                    }
                }
            }

            chunkUploadCount.remove(uniqueFileId);
            chunkCounts.remove(uniqueFileId);
            
            
           
            try {
            	if(!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
                Map<String, Object> checkResult = performFileChecksDSV(finalFilePath.toString(), fileName);
                if (checkResult != null) {
                	Files.deleteIfExists(finalFilePath);
                    return ResponseEntity.badRequest().body(checkResult);
                }
            	}
            	else {
            		
            		  Map<String, Object> checkResult = performFileChecksExcel(finalFilePath.toString(), fileName);
                      if (checkResult != null) {
                      	Files.deleteIfExists(finalFilePath);
                          return ResponseEntity.badRequest().body(checkResult);
                      }
            		
            	}
            } catch (Exception e) {
            	
            	
            	
                e.printStackTrace();
                Files.deleteIfExists(finalFilePath);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                        "message", "Failed while reading your file . Check your file it should contain proper tabular content" 
                ));
            }
            

            Tables record = new Tables(userName);
            record.setFileName(fileName);
            tablesRepository.save(record);
            
           

            return ResponseEntity.ok(Map.of(
                    "message", "File successfully uploaded.",
                    "tableId", record.getId()
            ));

            
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "message", "Uploading your file failed, kindly try again"
            ));
        }
    }

    private Map<String, Object> performFileChecksDSV(String filePathString, String fileName) throws IOException, CsvValidationException {
        Path filePath = Paths.get(filePathString);
                
        String fileExtension = getFileExtension(fileName);
        if (!isValidFileExtension(fileExtension)) {
            return Map.of("message", "Invalid file format! Allowed formats: .xlsx, .xls, .txt, .csv, .tsv, .ssv, .psv, .hsv");
        }

        if (Files.size(filePath) == 0) {
            return Map.of("message", "The file is empty.");
        }
        
        if (isOnlyWhitespaceDsv(filePathString)) {
            return Map.of("message", "The file contains only whitespace or no data.");
        }

        char delimiter = getDelimiterForExtension(fileExtension);
        if (delimiter != 0) {
            if (!validateDelimiterStructure(filePathString, delimiter)) {
                return Map.of("message", "File rows are inconsistent or invalid for the delimiter: " + delimiter);
            }
        } 
        
        else {
            if (!validateWithAllDelimiters(filePathString)) {
                return Map.of("message", "File rows are inconsistent for all standard delimiters (',' , ';' , '|' , '\t' ,'#').");
            }
        }

        return null;
    }

    
    private Map<String, Object> performFileChecksExcel(String filePathString, String fileName) throws IOException {
        Path filePath = Paths.get(filePathString);
                
//        String fileExtension = getFileExtension(fileName);
//        if (!isValidFileExtension(fileExtension)) {
//            return Map.of("message", "Invalid file format! Allowed formats: .xlsx, .xls, .txt, .csv, .tsv, .ssv, .psv, .hsv");
//        }

        if (Files.size(filePath) == 0) {
            return Map.of("message", "The file is empty.");
        }
        
        if (isOnlyWhitespaceExcel(filePathString)) {
            return Map.of("message", "The file contains only whitespace or no data.");
        }

        return null;
    }

   

    private boolean validateDelimiterStructure(String filePathString, char delimiter) throws IOException, CsvValidationException {
        Path filePath = Paths.get(filePathString); 
        CSVParserBuilder parserBuilder = new CSVParserBuilder().withSeparator(delimiter);

        try (BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(new FileInputStream(filePath.toFile()), "UTF-8"));
             CSVReader csvReader = new CSVReaderBuilder(bufferedReader)
                                     .withCSVParser(parserBuilder.build())
                                     .build()) {
            List<String[]> rows = new ArrayList<>();
            for (int i = 0; i < 5; i++) {
                String[] row = csvReader.readNext();
                if (row == null) break;
                rows.add(row);
            }

            if (rows.size() < 2) return true; 

            int length = rows.get(0).length;
            for (String[] row : rows) {
                if (row.length != length) {
                    return false; 
                }
            }
        }
        return true;
    }

    private boolean validateWithAllDelimiters(String filePathString) throws IOException, CsvValidationException {
        char[] delimiters = {',', ';', '\t', '|', '#'};
        for (char delimiter : delimiters) {
            if (validateDelimiterStructure(filePathString, delimiter)) {
                return true; 
            }
        }
        return false;
    }

    private char getDelimiterForExtension(String fileExtension) {
        return switch (fileExtension) {
            case ".csv" -> ',';
            case ".ssv" -> ';';
            case ".tsv" -> '\t';
            case ".psv" -> '|';
            case ".hsv" -> '#';
            default -> 0; 
        };
    }

    private boolean isOnlyWhitespaceDsv(String filePathString) throws IOException {
        Path filePath = Paths.get(filePathString); 
        try (BufferedReader reader = Files.newBufferedReader(filePath)) {
            String line;
        while ((line = reader.readLine()) != null) {
                if (!line.trim().isEmpty()) {
                    return false;
                }
           }
        }
        return true;
    }
    
    
    public boolean isOnlyWhitespaceExcel(String filePathString) throws IOException {
        FileInputStream fis = new FileInputStream(filePathString);

       
        Workbook workbook=null;
        if (filePathString.endsWith(".xlsx")) {
            workbook = new XSSFWorkbook(fis);
        } else if (filePathString.endsWith(".xls")) {
            workbook = new HSSFWorkbook(fis);
        } 
        
        for (Sheet sheet : workbook) { 
            for (Row row : sheet) { 
                String[] rowData = GlobalData.extractRowData(row, workbook);
                for (String cellData : rowData) {
                    if (!cellData.trim().isEmpty()) { 
                        workbook.close();
                        return false; 
                    }
                }
            }
        }

        workbook.close();
        return true; 
    }


    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf(".");
        if (lastDotIndex > 0) {
            return fileName.substring(lastDotIndex).toLowerCase();
        }
        return "";
    }
        
    private boolean isValidFileExtension(String fileExtension) {
        return Arrays.asList(GlobalData.ALLOWED_EXTENSIONS).contains(fileExtension);
    }
}