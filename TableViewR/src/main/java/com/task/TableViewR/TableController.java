package com.task.TableViewR;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.sql.SQLException;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
public class TableController {

    @Autowired
    private TablesRepository tablesRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JdbcTemplate jdbcTemplate ;

    @GetMapping("/userTables")
    public ResponseEntity<Map<String, Object>> getUserTables(@RequestAttribute("userName") String userName) {
       
    	 Users user = userRepository.findByEmail(userName);
 	    if (user == null) {
 	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
 	                .body(Map.of(
 	                        "message", "User not found. Login again",
 	                        "error", "Unauthorized access. User record not found in the database for username: " + userName
 	                ));
 	    }
	        
	        
	        List<Object[]> tableList = tablesRepository.findTableNamesAndIdsByEmail(userName);
	        
	        
	        
	        List<Map<String, String>> transformedTableList = tableList.stream()
	        	    .filter(record -> record[0] != null && record[1] != null) 
	        	    .map(record -> Map.of(
	        	        "name", String.valueOf(record[0]),
	        	        "value", String.valueOf(record[1])
	        	    ))
	        	    .collect(Collectors.toList());
	        	
	        	return ResponseEntity.ok(Map.of("tableList", transformedTableList));
	        
      
    }
    
    @PostMapping("/drop")
    public ResponseEntity<Map<String, Object>> dropTables(
            @RequestBody List<String> tableList,@RequestAttribute("userName") String userName) {

    	
    	Map<String, Object> response = new HashMap<>();
    	
    	 Users user = userRepository.findByEmail(userName);
  	    if (user == null) {
  	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
  	                .body(Map.of(
  	                        "message", "User not found. Login again",
  	                        "error", "Unauthorized access. User record not found in the database for username: " + userName
  	                ));
  	    }
        
        
		String userId = userRepository.findUserIdByEmail(userName).toString();
        for (String tableIdStr : tableList) {
            try {
                
                Long tableId = Long.parseLong(tableIdStr);

               
                String tableName = tablesRepository.findTableNameByEmailAndId(userName, tableId);

                if (tableName == null) {
                    
                	response.put("message", "Table "+tableName+" doesn't exist .");
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                }

              
                String dropQuery = "DROP TABLE IF EXISTS " + tableName+"$"+userId;
                jdbcTemplate.execute(dropQuery);
               

                
                tablesRepository.deleteById(tableId);
               

            } catch(Exception e) {
            	
                String errorMessage;
	            
	            Throwable rootCause = e.getCause();
	            if (rootCause instanceof SQLException) {
	                SQLException sqlEx = (SQLException) rootCause;

	               
	                errorMessage = sqlEx.getMessage();

	              
	                int atRowIndex = errorMessage.lastIndexOf(" at row");
	                if (atRowIndex != -1) {
	                    errorMessage = errorMessage.substring(0, atRowIndex);
	                }
	                response.put("message", "Failed dropping the tables. Cause : "+errorMessage);
	                
	            }
	                else {
            	
            	response.put("message", "Couldn't delete the tables from the database.Try again.");}
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            	
            }
        }
        
        response.put("message", "Tables dropped successfully.");

        return ResponseEntity.ok(response);
    }

	
}
