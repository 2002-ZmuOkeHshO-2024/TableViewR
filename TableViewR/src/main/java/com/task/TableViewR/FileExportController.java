package com.task.TableViewR;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.io.InputStream;
import java.io.FileInputStream;


import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

@RestController
@RequestMapping("/api")
public class FileExportController {

    @Autowired
    private FileExportService fileExportService;

    @Autowired
    private UserRepository userRepository ;
    @PostMapping("/export")
    public ResponseEntity<Map<String, Object>> exportFile(@RequestBody Map<String,String> body,
                                                          @RequestAttribute("userName") String userName) {
    	
    	
    	
    	
    	String query = body.get("query");
    	String fileName = body.get("fileName");
    	String fileFormat = body.get("fileFormat");
    	

        Map<String, Object> response = new HashMap<>();
        response.put("fileName", fileName);
        response.put("fileFormat", fileFormat);
        
        String userId = userRepository.findUserIdByEmail(userName).toString();
       
        
        String resultFormat ;
        if(fileFormat.equalsIgnoreCase(",")) resultFormat="csv" ;
        else if(fileFormat.equalsIgnoreCase(";") || fileFormat.equalsIgnoreCase("psv") || fileFormat.equalsIgnoreCase("hsv")) resultFormat = "txt";
        else resultFormat = fileFormat ;
      
        
        
        
        String resultFileName = fileName+"."+resultFormat ;
        
        String downloadedPath = null;
        try {
        	 query = GlobalData.renameQuery(query, userId);
            if (fileFormat.equalsIgnoreCase("xls") || fileFormat.equalsIgnoreCase("xlsx")) {
                downloadedPath = fileExportService.exportDataToExcel(query, fileFormat, fileName,userName); }
            else if (fileFormat.equalsIgnoreCase("xml")) {
            	downloadedPath =fileExportService.exportDataToXml(query, fileName ,userName);}
             else if (fileFormat.equalsIgnoreCase("json")) {
            	 downloadedPath =fileExportService.exportDataToJson(query, fileName ,userName);}
             else {
                char delimiter = ',';
                if (fileFormat.equalsIgnoreCase("tsv")) {
                    delimiter = '\t';
                }else if (fileFormat.equalsIgnoreCase("hsv")) {
                    delimiter = '#';
                }else if (fileFormat.equalsIgnoreCase("psv")) {
                    delimiter = '|';
                } else {
                    delimiter = fileFormat.charAt(0);
                }
                downloadedPath =fileExportService.exportDataToDsv(query, fileName, delimiter ,userName);
            }
            
           

            response.put("message", "File '"+resultFileName+"' downloaded successfully!! to "+downloadedPath);
            response.put("downloadedPath", downloadedPath);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            e.printStackTrace();
            response.put("message", "Failed to download file '"+resultFileName+"' .Cause : "+e.getMessage());
            response.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("message",  "Failed to download file '"+resultFileName+"' .Cause : "+e.getMessage());
            response.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    
    
    
    @GetMapping("/download")
    public ResponseEntity<StreamingResponseBody> downloadFile(@RequestParam("filePath") String filePath) throws IOException {
        Path fileLocation = Paths.get(filePath).normalize();
        File file = fileLocation.toFile();
        if (!file.exists()) {
            throw new RuntimeException("File not found!");
        }
        
        InputStream inputStream = new FileInputStream(file);
        StreamingResponseBody stream = outputStream -> {
            byte[] buffer = new byte[64*1024]; 
            int bytesRead;
            try {
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
            } finally {
                try {
                    inputStream.close();
                    
                    boolean deleted = file.delete();
                    if (!deleted) {
                        System.err.println("Failed to delete the file.");
                    }
                    outputStream.close();
                } catch (IOException e) {
                    System.err.println("Error closing file input stream: " + e.getMessage());
                }
            }
        };
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                .header(HttpHeaders.CONTENT_TYPE, "application/octet-stream")
                .body(stream);
    }
}
