package com.task.TableViewR;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api")
public class PersistController {
	
	 @Autowired
	 private TableInfo tableInfo ;
	
	 @Autowired
	 private TablesRepository tablesRepository;  
	 
	 @Autowired
	 private UserRepository userRepository;  
	
	
	@Autowired
	 private DatabaseService dbService;
	
	@PostMapping("/tableInfo")
	public ResponseEntity<Map<String, Object>> createTableAndInsertData(
	        @RequestBody TableInfoWrapper tableInfoWrapper,
	        @RequestAttribute("userName") String userName,
	        @RequestHeader("X-Table-Id") Long tableId) {

	    tableInfo.updateTableInfo(tableInfoWrapper.getTableInfo());

//	    Users user = userRepository.findByEmail(userName);
//	    if (user == null) {
//	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//	                .body(Map.of(
//	                        "message", "User not found. Login again",
//	                        "error", "Unauthorized access. User record not found in the database for username: " + userName
//	                ));
//	    }

	    String fileName = tablesRepository.findFileNameByEmailAndId(userName, tableId);
	    if (fileName == null) {
	        return ResponseEntity.badRequest()
	                .body(Map.of(
	                        "message", "File not uploaded correctly. Try reuploading",
	                        "error", "File name not found for user: " + userName + " and tableId: " + tableId
	                ));
	    }

	    Tables table = tablesRepository.findFirstByEmailAndFileNameAndTableNameIsNullAndId(userName, fileName, tableId);
	    if (table == null) {
	        return ResponseEntity.badRequest()
	                .body(Map.of(
	                        "message", "File not uploaded correctly , Try reuploading ",
	                        "error", "No table record matching the specified criteria was found."
	                ));
	    }
	    

	    boolean tableNameExists = tablesRepository.existsByEmailAndTableName(userName, tableInfo.getTableName());
	    if (tableNameExists) {
	        return ResponseEntity.badRequest()
	                .body(Map.of(
	                        "message", "Table name " +tableInfo.getTableName()+ " already exists. Consider using a different name or deleting it"
	                       
	                ));
	    }

	    String filePath = GlobalData.getFilePath() + "/" + userName + "/" + fileName;

	    String userId = userRepository.findUserIdByEmail(userName).toString();
	    String createTableQuery = dbService.generateCreateTableQuery(tableInfo, userId);
	    ResponseEntity<Map<String, Object>> createTableResponse = dbService.createTable(createTableQuery);

	    if (!createTableResponse.getStatusCode().is2xxSuccessful()) {
	        return createTableResponse;
	    }

	    String insertTableQuery = dbService.generateInsertQuery(tableInfo,userId);
	    ResponseEntity<Map<String, Object>> insertDataResponse = dbService.batchInsertData(insertTableQuery, tableInfo, filePath ,userId );

	    if (!insertDataResponse.getStatusCode().is2xxSuccessful()) {
	        return insertDataResponse;
	    }

	    table.setTableName(tableInfo.getTableName());
		table.setCreationTime(LocalDateTime.now());
		tablesRepository.save(table);

	    Map<String, Object> response = new HashMap<>();
	    response.put("message", "Table "+tableInfo.getTableName() +" created and "+fileName+"'s data inserted successfully.");
	    response.put("createTableQuery", createTableQuery);
	    response.put("insertTableQuery", insertTableQuery);

	    return ResponseEntity.ok(response);
	}

    
}
