package com.task.TableViewR;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TableViewController {
	
	
	 @Autowired
	 private TablesRepository tablesRepository;  
	 
	 @Autowired
	 private UserRepository userRepository;  
	
	 
		@Autowired
		 private DatabaseService dbService;
		
	
	
		   @PostMapping("/tableData")  
           public ResponseEntity<Map<String, Object>> getTableData(
            @RequestBody Map<String,String> body,
            @RequestAttribute("userName") String userName,
            @RequestHeader("X-Table-Id") Long tableId) {
	 
			   Users user = userRepository.findByEmail(userName);
		 	    if (user == null) {
		 	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
		 	                .body(Map.of(
		 	                        "message", "User not found. Login again",
		 	                        "error", "Unauthorized access. User record not found in the database for username: " + userName
		 	                ));
		 	    }
		 	  
		 	    String query = body.get("query").trim();
		 	    
		 	   if (query.endsWith(";")) {
		            query = query.substring(0, query.length() - 1);
		        }
		 	    
		 	    int page = Integer.parseInt(body.get("page"));
		 	    int size = 50;
		 	    
			    System.out.println("Received Query now : " + query);
		        String tableName = tablesRepository.findTableNameByEmailAndId(userName, tableId);

		        if (tableName == null) {
		            Map<String, Object> errorResponse = new HashMap<>();
		            errorResponse.put("message", "Table not created, try reuploading ");
		            return ResponseEntity.badRequest().body(errorResponse);
		        }
			    
		        
		        HashSet<String> tableNames = GlobalData.queryTables(query);
		       
		        if (!tableNames.contains(tableName) && !query.isBlank() && !query.toLowerCase().startsWith("sho") && !query.toLowerCase().contains("rename")) {
		            Map<String, Object> errorResponse = new HashMap<>();
		            errorResponse.put("message", 
		               " You are attempting to execute a query on a table that is either not currently selected or does not exist."
		            );
		            return ResponseEntity.badRequest().body(errorResponse);
		        }
		        
		        String userId = userRepository.findUserIdByEmail(userName).toString();
		        ResponseEntity<Map<String, Object>> response = dbService.executeQuery(query, tableName, page, size ,userName ,userId);
		        
		        Map<String, Object> responseBody = response.getBody();
	
			     if (responseBody != null) {
			         responseBody.put("tableId", tableId);  
			     }

			     ResponseEntity<Map<String, Object>> updatedResponse = ResponseEntity
			    		    .status(response.getStatusCode())  // Keep the original status
			    		    .headers(response.getHeaders())    // Keep the original headers
			    		    .body(responseBody);
			    
			    return updatedResponse ;
			}
		 
		 
		 
				 
		 
	 }
	 
	
	
	
	
	
	
