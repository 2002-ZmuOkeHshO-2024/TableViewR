package com.task.TableViewR;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvValidationException;







@Service
public class DatabaseService {
	
	

	 @Autowired
	 private TablesRepository tablesRepository;  
	 
	 @Autowired
	 private UserRepository userRepository;  
	 
	 
	 
	 
	
	 private final JdbcTemplate jdbcTemplate;

	    public DatabaseService(JdbcTemplate jdbcTemplate) {
	        this.jdbcTemplate = jdbcTemplate;
	    }
	    
	    @Transactional
	    public ResponseEntity<Map<String, Object>> createTable(String createTableQuery) {
	        Map<String, Object> response = new HashMap<>();
	        try {
	            jdbcTemplate.execute(createTableQuery);
	            response.put("message", "Table created successfully.");
	            return ResponseEntity.ok(response);
	        } catch (Exception e) {
	        	
	        	  String errorMessage;
		            
		            Throwable rootCause = e.getCause();
		            if (rootCause instanceof SQLException) {
		                SQLException sqlEx = (SQLException) rootCause;

		               
		                errorMessage = sqlEx.getMessage();

		              
		                int atRowIndex = errorMessage.lastIndexOf(" at row");
		                if (atRowIndex != -1) {
		                    errorMessage = errorMessage.substring(0, atRowIndex);
		                }
		                errorMessage.replace("\\$\\d+","" );
		                response.put("message", "Table creation failed. Try uploading again. Cause : "+errorMessage);
		            }  
		            else {
		            	response.put("message", "Table creation failed. Try uploading again");
		            }
		            response.put("cause", e.getMessage());
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
	        }
	    }

	   
	    
	    public String generateCreateTableQuery(TableInfo tableInfo,String userId) {
	    	
	    	
	    	 String dropTableQuery = "DROP TABLE IF EXISTS " + tableInfo.getTableName() +"$"+ userId+";";
	    	    
	    	   
	    	 jdbcTemplate.execute(dropTableQuery); 
	    	 
	    	
	        StringBuilder query = new StringBuilder("CREATE TABLE IF NOT EXISTS ");
	        query.append(tableInfo.getTableName()+"$"+ userId).append(" (");
	        
	        
	        if (tableInfo.getPkColumn() <= 0) {
	               
                query.append(tableInfo.getTableName()).append("_id INT AUTO_INCREMENT PRIMARY KEY, ");
            }
	        
	        System.out.println("received column names: "+tableInfo.getColumnNames());

	        for (int i = 0; i < tableInfo.getColumnCount(); i++) {
	            String columnName = tableInfo.getColumnNames().get(i);
	            String columnType = tableInfo.getColumnDataTypes().get(i);
	            String length1 = tableInfo.getLength1().get(i);
	            String length2 = tableInfo.getLength2().get(i);
	            
	            
	           
	            
	            query.append(columnName).append(" ");
	            
	            switch (columnType) {
	                case "VARCHAR":                  
	                    query.append(columnType).append("(").append(length1).append(")");
	                	//query.append(columnType).append("(").append("65000").append(")");
	                    break;
	                case "DECIMAL":     
	                    query.append(columnType).append("(").append(length1).append(",").append(length2).append(")");
	                    break;
	                default:
	                   
	                    query.append(columnType);
	                    break;
	            }
	            
	            
	            
	            if (i+1 == tableInfo.getPkColumn()) {
	                query.append(" PRIMARY KEY");
	            }

	            
	            if (i < tableInfo.getColumnNames().size() - 1) {
	                query.append(", ");
	            }
	        }

	        query.append(");");
	        
	        System.out.println("generated create table query : "+query.toString());

	        return query.toString();
	    }
	    
	    
	    
	    public String generateInsertQuery(TableInfo tableInfo ,String userId) {
	       
	        StringBuilder insertQuery = new StringBuilder("INSERT INTO ");
	        insertQuery.append(tableInfo.getTableName()+"$"+userId+" (");

	        
	        for (int i = 0; i < tableInfo.getColumnCount(); i++) {
	            insertQuery.append(tableInfo.getColumnNames().get(i));
	            if (i < tableInfo.getColumnCount() - 1) {
	                insertQuery.append(", ");
	            }
	        }
	        insertQuery.append(") VALUES (");

	        
	        for (int i = 0; i < tableInfo.getColumnCount(); i++) {
	            String columnType = tableInfo.getColumnDataTypes().get(i);
	            if ("DATE".equalsIgnoreCase(columnType) || 
	                "TIME".equalsIgnoreCase(columnType) || 
	                "DATETIME".equalsIgnoreCase(columnType)) {
	            	
	            	Map<String, String> mySqlFormat = GlobalData.getMySqlFormat();
	            	
	            	String sqlFormat = tableInfo.getDateFormats().get(i);
	            	
	            	List<Map.Entry<String, String>> sortedEntries = mySqlFormat.entrySet()
	            	        .stream()
	            	        .sorted((e1, e2) -> Integer.compare(e2.getKey().length(), e1.getKey().length()))
	            	        .toList();

	            	
	            	for (Map.Entry<String, String> entry : sortedEntries) {
	            		System.out.println(entry.getKey());
	            	    sqlFormat = sqlFormat.replace(entry.getKey(), entry.getValue());
	            	}
	            
	            	
	                insertQuery.append("STR_TO_DATE(?, '").append(sqlFormat).append("')");
	            } else {
	                insertQuery.append("?");
	            }

	            if (i < tableInfo.getColumnCount() - 1) {
	                insertQuery.append(", ");
	            }
	        }
	        insertQuery.append(");");

	        return insertQuery.toString();
	    }
	    
	   
	    public ResponseEntity<Map<String, Object>> batchInsertData(String insertQuery, TableInfo tableInfo, String filePath, String userId) {
	        Map<String, Object> response = new HashMap<>();
	        int chunkSize = 1000;
	        
	        AtomicReference<ResponseEntity<Map<String, Object>>> exceptionResponse = new AtomicReference<>();

	        try {
	            chunkSize = GlobalData.getChunkCount(filePath);
	        } catch (IOException e) {
	        	String dropTableQuery = "DROP TABLE IF EXISTS " + tableInfo.getTableName() + "$" + userId;
	 	        jdbcTemplate.execute(dropTableQuery);
	            response.put("message", "Error reading file. Try uploading again.");
	            //response.put("details", e.getMessage());
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	        }

	        int batchSize = chunkSize;
	        boolean firstLineRecord = tableInfo.isFirstLineRecord();

	        ExecutorService executorService = Executors.newFixedThreadPool(6);
	        BlockingQueue<List<Object[]>> queue = new ArrayBlockingQueue<>(15);

	        Runnable producer = () -> {
	            int rowCounter = 0;
	            List<String[]> batchArgs = new ArrayList<>();
	                     
	            if (filePath.endsWith(".xlsx") || filePath.endsWith(".xls")) {
	            	try (FileInputStream fileInputStream = new FileInputStream(filePath);
	        		         Workbook workbook = filePath.endsWith(".xlsx") ? new XSSFWorkbook(fileInputStream) : new HSSFWorkbook(fileInputStream)) {

	        		        Sheet sheet = workbook.getSheetAt(0); 

	        		        for (Row row : sheet) {
	        		            rowCounter++;

	        		            if (rowCounter == 1 && !firstLineRecord) {
	        		                continue; 
	        		            }

	        		            String[] rowData = GlobalData.extractRowData(row , workbook);

	        		            
	        		            if (rowData.length == 0 || (rowData.length == 1 && rowData[0].isBlank())) {
	        		                continue;
	        		            }

	        		           
	        		            if (rowData.length != tableInfo.getColumnCount()) {
	        		                response.put("message", "Invalid record at row " + rowCounter + ".Number of record didn't match with number of columns.");
	        		                throw new Exception("Invalid record at row " + rowCounter);
	        		            }

	        		            batchArgs.add(rowData);

	        		           
	        		            if (batchArgs.size() == batchSize) {
	        		                queue.put(new ArrayList<>(batchArgs));
	        		                batchArgs.clear();
	        		            }
	        		        }

	        		       
	        		        if (!batchArgs.isEmpty()) {
	        		            queue.put(new ArrayList<>(batchArgs));
	        		        }

	        		    
	        		        for (int i = 0; i < 15; i++) {
	        		            queue.put(new ArrayList<>());
	        		        }

	        		    } catch (Exception e) {
	        		    	System.out.println("From Excel producer exception");
	        	        	e.printStackTrace(); // Prints 
	        		        exceptionResponse.set(cleanupAndHandleException(e, executorService, tableInfo, userId, response));
	        		    }
	
	           } 
	           
	           else {
		            String delimiter = tableInfo.getDelimiter();
		          
		            CSVParserBuilder parserBuilder = new CSVParserBuilder();
		            parserBuilder.withSeparator(delimiter.charAt(0));
		          
		            try (BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(new FileInputStream(filePath), "UTF-8"));
		                 CSVReader csvReader = new CSVReaderBuilder(bufferedReader)
		                         .withCSVParser(parserBuilder.build())
		                         .build()) {

		                String[] nextLine;
		                while ((nextLine = csvReader.readNext()) != null) {
		                    rowCounter++;

		                    if (rowCounter == 1 && !firstLineRecord) {
		                        continue; 
		                    }

		                    if (nextLine.length == 0 || (nextLine.length == 1 && nextLine[0].isBlank())) {
		                        continue; 
		                    }
		                    System.out.println(Arrays.asList("record :"+rowCounter+" ### "+ Arrays.toString(nextLine)));
		                    if (nextLine.length != tableInfo.getColumnCount()) {
		                        response.put("message", "Invalid record at row " + rowCounter + ". Number of record didn't match with number of columns.");
		                        throw new Exception("Invalid record at row " + rowCounter);
		                    }

		                    batchArgs.add(nextLine);

		                    if (batchArgs.size() == batchSize) {
		                        queue.put(new ArrayList<>(batchArgs)); 
		                        batchArgs.clear();
		                    }
		                }

		                if (!batchArgs.isEmpty()) {
		                    queue.put(new ArrayList<>(batchArgs)); 
		                }

		                for (int i = 0; i < 15; i++) {
		                    queue.put(new ArrayList<>()); 
		                }
		            } catch (CsvValidationException e) {
		            	System.out.println("From interrupted exception");
			        	e.printStackTrace(); 
		                
		            	response.put("message",  "Invalid file content structure. Please ensure the file content is in proper tabular format.");
		            	 exceptionResponse.set(cleanupAndHandleException(e, executorService, tableInfo, userId, response));
		            
		            }
		            catch (Exception e) {
		            	System.out.println("From Dsv producer exception");
			        	e.printStackTrace(); 
		            	exceptionResponse.set(cleanupAndHandleException(e, executorService, tableInfo, userId, response));
		            }
	        	   
             }
	             
	             
	             
	             
	        };

	        Runnable consumer = () -> {
	        	
	            try {
	                while (true) {
	                    List<Object[]> chunk = queue.take();
	                    if (chunk.isEmpty()) {
	                        break; 
	                    }
	                    processBatch(insertQuery, chunk, response);
	                }
	            } catch (Exception e) {
	            	System.out.println("From consumer  exception");
		        	e.printStackTrace(); 
	            	exceptionResponse.set(cleanupAndHandleException(e, executorService, tableInfo, userId, response));
	            }
	        };

	        if (!executorService.isShutdown()) {
	        	
	        	  executorService.submit(producer);
	  	        for (int i = 0; i < 15; i++) {
	  	        	
	  	            executorService.submit(consumer);
	  	        }
	  	      
	           
	        } 
	      
	        executorService.shutdown();
	        try {
	            if (!executorService.awaitTermination(60, TimeUnit.MINUTES)) {
	                executorService.shutdownNow();
	            }
	        } catch (InterruptedException e) {
	        	System.out.println("From interrupted exception");
	        	e.printStackTrace(); 
	            Thread.currentThread().interrupt();
	            return cleanupAndHandleException(e, executorService, tableInfo, userId, response);
	        }
	        
	        
	        if (exceptionResponse.get() != null) {
	            return exceptionResponse.get();
	        }
	        
	        
	         try {
	             File file = new File(filePath);
	             if (file!=null && file.exists()) {
	                file.delete();
	             }
	         } catch (Exception e) {
	        	 
	             response.put("fileDeletionWarning", "Failed to delete file: " + filePath);
	         }

	        response.put("message", "Data inserted successfully.");
	        return ResponseEntity.ok(response);
	    }

	    private void processBatch(String insertQuery, List<Object[]> batchArgs, Map<String, Object> response) {
	        try {
	            jdbcTemplate.batchUpdate(insertQuery, batchArgs);
	        } catch (Exception batchException) {
	        	  String errorMessage="Error during inserting data. Check your file content ,it should be in proper tabular format and matches with the configured datatype . Try uploading again.";
		            
		            Throwable rootCause = batchException.getCause();
		            if (rootCause instanceof SQLException) {
		                SQLException sqlEx = (SQLException) rootCause;

		               
		                errorMessage = sqlEx.getMessage();

		              
		                int atRowIndex = errorMessage.lastIndexOf(" at row");
		                if (atRowIndex != -1) {
		                    errorMessage = errorMessage.substring(0, atRowIndex);
		                }
		                
		                if (errorMessage.toLowerCase().contains("str_to_date")) {
		                    errorMessage = "Given format (for either date or time or datetime datatype column) doesn't match with the data present in the file. Check and try correct format";
		                }
		              
		           errorMessage = errorMessage.replace("\\$\\d+","" );
		    	   errorMessage = "Error during inserting data. Check your file content ,it should be in tabular format and matches with the configured datatype .Cause : "+errorMessage+". Try uploading again.";
		    	        
		            }
		            errorMessage.replaceAll("\\$\\d+","");
		            if (!response.containsKey("message")) {
	    	            response.put("message", errorMessage);
	    	        }
		            	
		                batchException.printStackTrace();
	                	throw new RuntimeException(errorMessage);
	              }
	            }
	        
	    

	    private ResponseEntity<Map<String, Object>> cleanupAndHandleException(Exception e, ExecutorService executorService, TableInfo tableInfo, String userId, Map<String, Object> response) {
	        executorService.shutdownNow();
	        System.out.println("step 3");
	        return handleException(e, tableInfo, userId, response);
	    }

	    private ResponseEntity<Map<String, Object>> handleException(Exception e, TableInfo tableInfo, String userId, Map<String, Object> response) {
	        String dropTableQuery = "DROP TABLE IF EXISTS " + tableInfo.getTableName() + "$" + userId;
	        try {
	            jdbcTemplate.execute(dropTableQuery);
	        } catch (Exception dropException) {
	            response.put("dropError", "Error dropping table: " + dropException.getMessage());
	        }
	        if (!response.containsKey("message")) {
	            response.put("message", "Error during inserting data. Check your file content ,it should be in tabular format and matches with the configured datatype .Try uploading again.");
	        }
	        
	       
	       
	      
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
	    }

	    
	    


	    
	   
	    
	   
	    public ResponseEntity<Map<String, Object>> executeQuery(String query, String tableName, int page, int size, String userName ,String userId) {
	        Map<String, Object> response = new HashMap<>();
	        
	    	if(query.isBlank()) {
        		query = "SELECT * FROM "+tableName ;
        	}
	    	
	    	String userQuery = query.trim() ;
	    	
	    	try {
        	
	    	 if (query.toLowerCase().contains("rename") && !query.toLowerCase().contains("column")) {
	    		 
	    		 Pattern pattern = null   ;
	    		 if(query.toLowerCase().startsWith("alt")) {
	    		  
	              pattern = Pattern.compile(
	                 "alter\\s+table\\s+(\\S+)\\s+rename\\s+to\\s+(\\S+)",
	                 Pattern.CASE_INSENSITIVE);
	    		 
	    	 }
	    		 else if(query.toLowerCase().startsWith("rename")) {
	    			 
	    			 pattern = Pattern.compile(
	    	                 "rename\\s+table\\s+(\\S+)\\s+to\\s+(\\S+)",
	    	                 Pattern.CASE_INSENSITIVE);
	    	    		 
	    			 
	    		 }
	    		 
	             Matcher matcher = pattern.matcher(query);

	             if (matcher.find()) {
	        
	            	 String oldName = matcher.group(1);
	            	 String newName = matcher.group(2);
	            	 
	            	 query = "RENAME TABLE "+oldName+"$"+userId+" TO "+newName+"$"+userId ;
	            	 
	            	 
	            	 System.out.println(query + " |  new name :  "+ newName);
	            	 
	            	 jdbcTemplate.update(query);
	            	 
	            	 
	            	Tables table = tablesRepository.findTableByUsernameAndTableName(userName,oldName);
	            	 
	                table.setTableName(newName);
	         		tablesRepository.save(table);

	            	 
	            	 query = "SELECT * FROM "+newName ;
	            	 tableName = newName ;
	            	 
	                 
	             }
	         }
	         
        	
        	userQuery = query.trim();
            
            String originalQuery = null;
            
            String queryCount = "SELECT COUNT(*) AS totalRecords FROM " + tableName+"$"+userId;

            List<Map<String, Object>> rows = null;

	       
	        	
	        	query = GlobalData.renameQuery(query.trim(), userId);
	        
	            int totalRecords = jdbcTemplate.queryForObject(queryCount, Integer.class);
	            int totalPages = (int) Math.ceil((double) totalRecords / size);
	            int offset = (page - 1) * size;

	          
	            if (query.toLowerCase().startsWith("sel") && query.toLowerCase().contains("limit")) {
	                originalQuery = query;
	                totalPages = 1;
	                rows = jdbcTemplate.queryForList(originalQuery);
	                
	            } else if (query.toLowerCase().startsWith("sel")) {
	                originalQuery = query + " LIMIT " + size + " OFFSET " + offset;
	                
	                queryCount = "SELECT COUNT(*) AS row_count FROM ("+query+") AS subquery";
	                totalRecords = jdbcTemplate.queryForObject(queryCount, Integer.class);
		            totalPages = (int) Math.ceil((double) totalRecords / size);            
	                rows = jdbcTemplate.queryForList(originalQuery);
	                
	            } else if (query.toLowerCase().startsWith("upd") || query.toLowerCase().startsWith("ins") ||
	                       query.toLowerCase().startsWith("del") || query.toLowerCase().startsWith("alt")) {
	                jdbcTemplate.update(query);
	                
	                originalQuery = "SELECT * FROM " + tableName +"$"+userId + " LIMIT " + size + " OFFSET " + offset;
	                
	                rows = jdbcTemplate.queryForList(originalQuery);
	                
	                userQuery = "SELECT * FROM " + tableName ;
	               
	            } else if (query.toLowerCase().startsWith("sho")) {
	                originalQuery = query; 
	                totalPages = 1; 
	                rows = jdbcTemplate.queryForList(originalQuery); 

	                Users user = userRepository.findByEmail(userName);
	                
	 			   if (user == null) {
	 			       Map<String, Object> errorResponse = new HashMap<>();
	 			       errorResponse.put("meta", Map.of("error", "Error: User not found."));
	 			       return ResponseEntity.badRequest().body(errorResponse);
	 			   }
	 			   
	 			  rows.forEach(row -> {
	 			        String tableName1 = (String) row.get("TABLES_IN_task_1");
	 			        if (tableName1 != null && tableName1.contains("$")) {
	 			            tableName1 = tableName1.substring(0, tableName1.lastIndexOf('$'));
	 			            row.put("TABLES_IN_task_1", tableName1);
	 			        }
	 			    });
	 			    
	                List<String> userTableNames = tablesRepository.findTableNamesByEmail(userName);
	                rows.removeIf(row -> !userTableNames.contains((String) row.get("TABLES_IN_task_1")));
	                
	            } else if (query.toLowerCase().startsWith("des")) {
	                originalQuery = query;
	                totalPages = 1;
	                rows = jdbcTemplate.queryForList(originalQuery);	                
	            } else {
	                response.put("error", "Invalid query type. Allowed operations are SELECT, UPDATE, INSERT, DELETE, ALTER, SHOW, DESCRIBE.");
	                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	            }

	            if (rows.isEmpty()) {
	            	
	            	
	            	String schemaQuery = "SHOW COLUMNS FROM " + tableName + "$" + userId;
	                List<Map<String, Object>> schema = jdbcTemplate.queryForList(schemaQuery);

	               
	                List<Map<String, Object>> headerJSON = new ArrayList<>();
	                for (Map<String, Object> column : schema) {
	                    Map<String, Object> headerEntry = new HashMap<>();
	                    headerEntry.put("name", column.get("Field"));
	                    headerEntry.put("body", column.get("Field").toString().toLowerCase());
	                    headerJSON.add(headerEntry);
	                }

	              
	                response.put("headerJSON", headerJSON);
	                response.put("contentJSON", Collections.emptyList());
	                response.put("currentQuery", userQuery);
	                response.put("message", "No data found");
	                return ResponseEntity.ok(response);
	            	}

	            	
	           
	            List<Map<String, Object>> headerJSON = new ArrayList<>();
	            Map<String, Object> firstRow = rows.get(0);
	            for (String columnName : firstRow.keySet()) {
	                Map<String, Object> headerEntry = new HashMap<>();
	                headerEntry.put("name", columnName);
	                headerEntry.put("body", columnName.toLowerCase());
	                headerJSON.add(headerEntry);
	            }

	           
	            List<Map<String, Object>> contentJSON = new ArrayList<>();
	            for (Map<String, Object> row : rows) {
	                Map<String, Object> contentEntry = new HashMap<>();
	                for (Map.Entry<String, Object> entry : row.entrySet()) {
	                	if(entry.getKey()!= null && entry.getValue()!=null) {
	                    contentEntry.put(entry.getKey().toLowerCase(), entry.getValue().toString());}
	                	else {
	                		 contentEntry.put(entry.getKey().toLowerCase(), entry.getValue());
	                	}
	                }
	                contentJSON.add(contentEntry);
	            }

	            response.put("headerJSON", headerJSON);
	            response.put("contentJSON", contentJSON);
	            response.put("currentQuery", userQuery);
	            response.put("currentPage", page);
	            response.put("totalPages", totalPages);
	            return ResponseEntity.ok(response);

	        } catch (Exception executingQuery) {
	            String errorMessage;
	            
	            Throwable rootCause = executingQuery.getCause();
	            if (rootCause instanceof SQLException) {
	                SQLException sqlEx = (SQLException) rootCause;

	               
	                errorMessage = sqlEx.getMessage();

	              
	                int atRowIndex = errorMessage.lastIndexOf(" at row");
	                if (atRowIndex != -1) {
	                    errorMessage = errorMessage.substring(0, atRowIndex);
	                }
	                
	                errorMessage = errorMessage.replaceAll("\\$\\d+","" );
	                errorMessage = "Couldn't execute your query( " + userQuery + " ) . Cause : "+ errorMessage ;
	            } else {
	              
	                errorMessage = "Couldn't execute your query( " + userQuery + " ) " ;
	            }
	            
	            response.put("message", errorMessage);

	        }

	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
	    }

	}




