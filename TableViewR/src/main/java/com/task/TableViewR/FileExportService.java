package com.task.TableViewR;

import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.xml.stream.XMLOutputFactory;
import javax.xml.stream.XMLStreamWriter;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Service;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencsv.CSVWriter;


@Service
public class FileExportService {
	
	
	@Autowired
    private JdbcTemplate jdbcTemplate;
	
	
	
	

	public String exportDataToExcel(String query, String fileFormat, String fileName ,String userName) throws IOException,Exception {
	    Workbook workbook;
	    String downloadPath;

	    if ("xls".equalsIgnoreCase(fileFormat)) {
	        workbook = new HSSFWorkbook(); 
	       //downloadPath = Paths.get(System.getProperty("user.home"), "Downloads", fileName + ".xls").toString();
	       downloadPath = GlobalData.getFilePath()+"/"+userName+"/Downloads/"+ fileName + ".xls";
	       Path path = Paths.get(downloadPath).getParent(); // Get the parent directory
          
               Files.createDirectories(path); // Create directories if they do not exist
              
	    } else {
	        workbook = new SXSSFWorkbook(100);
	       //downloadPath = Paths.get(System.getProperty("user.home"), "Downloads", fileName + ".xlsx").toString();
	        downloadPath = GlobalData.getFilePath()+"/"+userName+"/Downloads/"+ fileName + ".xlsx";
	        Path path = Paths.get(downloadPath).getParent(); // Get the parent directory
	          
            Files.createDirectories(path);
	    }

	    Sheet sheet = workbook.createSheet("Data");
	    int rowLimit = ("xls".equalsIgnoreCase(fileFormat)) ? 65536 : 1048576;
	    try (FileOutputStream fileOut = new FileOutputStream(downloadPath)) {
	        jdbcTemplate.query(query, (ResultSetExtractor<Void>) rs -> {
	            try {
	                ResultSetMetaData metaData = rs.getMetaData();
	                int columnCount = metaData.getColumnCount();

	              
	                Row headerRow = sheet.createRow(0);
	                for (int i = 1; i <= columnCount; i++) {
	                    headerRow.createCell(i - 1).setCellValue(metaData.getColumnName(i));
	                }

	                
	                int rowIndex = 1;
	               
	                while (rs.next()) {
	                	
	                	 if (rowIndex >= rowLimit) {
	                         throw new IOException("Row limit exceeded. Maximum rows for " + fileFormat + " is " + rowLimit);
	                     }
	                	
	                	
	                    Row row = sheet.createRow(rowIndex++);
	                    for (int i = 1; i <= columnCount; i++) {
	                        Cell cell = row.createCell(i - 1);
	                        Object value = rs.getObject(i);
	                        if (value instanceof Number) {
	                            cell.setCellValue(((Number) value).doubleValue());
	                        } else if (value != null) {
	                            cell.setCellValue(value.toString());
	                        } else {
	                            cell.setCellValue("");
	                        }
	                    }
	                }
	            } catch (SQLException e) {
	            	 String errorMessage;
	 	            
	 	    
	 	                errorMessage = e.getMessage();
	 	              
	 	                int atRowIndex = errorMessage.lastIndexOf(" at row");
	 	                if (atRowIndex != -1) {
	 	                    errorMessage = errorMessage.substring(0, atRowIndex);
	 	                }
       	
	 	               errorMessage = errorMessage.replace("\\$\\d+","" );   
	 	             
	                 throw new RuntimeException(errorMessage);
	            } catch (Exception e) {
	            	
	            	 throw new RuntimeException("Failed to create your requested file to download. Try again. Cause :"+e.getMessage());
					
				}
	            return null;
	        });

	        workbook.write(fileOut);
	    } finally {
	    	 
	        if (workbook instanceof SXSSFWorkbook) {
	            ((SXSSFWorkbook) workbook).dispose();
	        }
	        workbook.close();
	    }

	    return downloadPath;
	}

	
	public String exportDataToXml(String query, String fileName ,String userName) throws IOException {
	   // String downloadPath = Paths.get(System.getProperty("user.home"), "Downloads", fileName + ".xml").toString();
	    
	     String  downloadPath = GlobalData.getFilePath()+"/"+userName+"/Downloads/"+ fileName + ".xml";
	       Path path = Paths.get(downloadPath).getParent(); // Get the parent directory
       
            Files.createDirectories(path); // Create directories if they do not exist

	    try (FileOutputStream outputStream = new FileOutputStream(downloadPath)) {
	        XMLOutputFactory xmlOutputFactory = XMLOutputFactory.newInstance();
	        XMLStreamWriter xmlWriter = xmlOutputFactory.createXMLStreamWriter(outputStream);

	      
	        xmlWriter.writeStartDocument("UTF-8", "1.0");
	        xmlWriter.writeStartElement("root");

	        String indent = "\t";

	
	        jdbcTemplate.query(query, (ResultSetExtractor<Void>) rs -> {
	            try {
	                ResultSetMetaData metaData = rs.getMetaData();
	                int columnCount = metaData.getColumnCount();

	                while (rs.next()) {
	                    xmlWriter.writeCharacters("\n" + indent);
	                    xmlWriter.writeStartElement("row");

	                   
	                    try {
	                        Object idValue = rs.getObject("Id");
	                        if (idValue != null) {
	                            xmlWriter.writeAttribute("Id", idValue.toString());
	                        }
	                    } catch (SQLException e) {
	                        
	                    }

	                    
	                    for (int i = 1; i <= columnCount; i++) {
	                        String columnName = metaData.getColumnName(i).replaceAll("[^a-zA-Z0-9]", "_");
	                        Object value = rs.getObject(i);
	                        xmlWriter.writeCharacters("\n" + indent + "  ");
	                        xmlWriter.writeStartElement(columnName);
	                        xmlWriter.writeCharacters(value != null ? value.toString() : "");
	                        xmlWriter.writeEndElement();
	                    }

	                    xmlWriter.writeCharacters("\n" + indent);
	                    xmlWriter.writeEndElement(); // End of "row"
	                }
	            } catch (SQLException e) {
	            	 String errorMessage;
		 	            
	     	 	    
	 	                errorMessage = e.getMessage();
	 	              
	 	                int atRowIndex = errorMessage.lastIndexOf(" at row");
	 	                if (atRowIndex != -1) {
	 	                    errorMessage = errorMessage.substring(0, atRowIndex);
	 	                }
	 	                
	 	               errorMessage = errorMessage.replace("\\$\\d+","" );
    	
	                 throw new RuntimeException(errorMessage);
	            }catch (Exception e) {
	                throw new RuntimeException("Failed to create your requested file to download. Try again");
	            }
	            
	            return null;
	        });

	       
	        xmlWriter.writeCharacters("\n");
	        xmlWriter.writeEndElement(); 
	        xmlWriter.writeEndDocument();

	        xmlWriter.flush();
	    } catch (Exception e) {
	        throw new RuntimeException("Failed to create your requested file to download. Try again");
	    }

	    System.out.println("XML successfully created at: " + downloadPath);
	    return downloadPath;
	}

    
    
    
	public String exportDataToJson(String query, String fileName ,String userName) throws IOException {
	   // String downloadPath = Paths.get(System.getProperty("user.home"), "Downloads", fileName + ".json").toString();
	    

	     String  downloadPath = GlobalData.getFilePath()+"/"+userName+"/Downloads/"+ fileName + ".json";
	       Path path = Paths.get(downloadPath).getParent(); // Get the parent directory
      
           Files.createDirectories(path);

	    try (FileWriter fileWriter = new FileWriter(downloadPath)) {
	        fileWriter.write("["); 
	        final boolean[] isFirstRow = {true}; 

	       
	        jdbcTemplate.query(query, (ResultSetExtractor<Void>) rs -> {
	            try {
	                ResultSetMetaData metaData = rs.getMetaData();
	                int columnCount = metaData.getColumnCount();
	                ObjectMapper objectMapper = new ObjectMapper(); 

	                while (rs.next()) {
	                    if (!isFirstRow[0]) {
	                        fileWriter.write(",");
	                    }
	                    isFirstRow[0] = false;

	                   
	                    Map<String, Object> rowMap = new LinkedHashMap<>();
	                    for (int i = 1; i <= columnCount; i++) {
	                        String columnName = metaData.getColumnName(i);
	                        Object value = rs.getObject(i);
	                        rowMap.put(columnName, value);
	                    }

	                  
	                    fileWriter.write(objectMapper.writeValueAsString(rowMap));
	                }
	            } catch (SQLException e) {
	            	
	            	 String errorMessage;
		 	            
		     	 	    
	 	                errorMessage = e.getMessage();
	 	              
	 	                int atRowIndex = errorMessage.lastIndexOf(" at row");
	 	                if (atRowIndex != -1) {
	 	                    errorMessage = errorMessage.substring(0, atRowIndex);
	 	                }
	 	                
	 	               errorMessage = errorMessage.replace("\\$\\d+","" );
 	
	                 throw new RuntimeException(errorMessage);
	               
	            }catch (Exception e) {
	                throw new RuntimeException("Failed to create your requested file to download. Try again");
	            }
	            return null;
	        });

	        fileWriter.write("]"); 
	        fileWriter.flush(); 
	    } catch (IOException e) {
	        throw new RuntimeException("Failed to create your requested file to download. Try again");
	    }

	    System.out.println("JSON successfully created at: " + downloadPath);
	    return downloadPath;
	}

	public String exportDataToDsv(String query, String fileName, char delimiter ,String userName) throws IOException {
	   
	    String extension;
	    switch (delimiter) {
	        case ',':
	            extension = ".csv"; 
	            break;
	        case '\t':
	            extension = ".tsv"; 
	            break;
	        default:
	            extension = ".txt"; 
	            break;
	    }

	  //  String downloadPath = Paths.get(System.getProperty("user.home"), "Downloads", fileName + extension).toString();
	    
	    String  downloadPath = GlobalData.getFilePath()+"/"+userName+"/Downloads/"+ fileName + extension;
	       Path path = Paths.get(downloadPath).getParent(); // Get the parent directory
   
        Files.createDirectories(path);

	    try (CSVWriter writer = new CSVWriter(new FileWriter(downloadPath), delimiter,
	            CSVWriter.DEFAULT_ESCAPE_CHARACTER, '\\' , CSVWriter.DEFAULT_LINE_END)) {

	        jdbcTemplate.query(query, (ResultSetExtractor<Void>) rs -> {
	            try {
	                ResultSetMetaData metaData = rs.getMetaData();
	                int columnCount = metaData.getColumnCount();

	                
	                String[] header = new String[columnCount];
	                for (int i = 1; i <= columnCount; i++) {
	                    header[i - 1] = metaData.getColumnName(i);
	                }
	                writer.writeNext(header);

	               
	                while (rs.next()) {
	                    String[] row = new String[columnCount];
	                    for (int i = 1; i <= columnCount; i++) {
	                        Object value = rs.getObject(i);
	                        String cellValue = value != null ? value.toString() : "";
	                        
//	                        if (cellValue.contains(String.valueOf(delimiter)) || cellValue.contains("\"")) {
//	                            cellValue = "\"" + cellValue.replace("\"", "\"\"") + "\"";
//	                        }

//	                        
//	                        
//	                        System.out.println("downloading hsv1 : "+cellValue);
//	                        
////							
////	                        if (cellValue.contains(String.valueOf(delimiter)) || 
////	                            cellValue.contains("\"") || 
////	                            (delimiter == '\t' && cellValue.contains("\t"))) {
////	                            cellValue = "\"" + cellValue.replace("\"", "\"\"") + "\"";
////	                        }
//
//	                      
//	                        if (cellValue.contains(String.valueOf(delimiter)) || 
//	                            
//	                            (delimiter == '\t' && cellValue.contains("\t"))) {
//	                            cellValue = "\"" + cellValue + "\"";
//	                        }
	                        
	                        
	                       // System.out.println("downloading hsv2 : "+cellValue);
	                        
	                        

	                        row[i - 1] = cellValue;
	                    	}
	                    writer.writeNext(row);
	                }

	            } catch (SQLException e) {
	            	 String errorMessage;
		 	            
		     	 	    
	 	                errorMessage = e.getMessage();
	 	              
	 	                int atRowIndex = errorMessage.lastIndexOf(" at row");
	 	                if (atRowIndex != -1) {
	 	                    errorMessage = errorMessage.substring(0, atRowIndex);
	 	                }
	 	                
	 	               errorMessage = errorMessage.replace("\\$\\d+","" );
 	
	                 throw new RuntimeException(errorMessage);
	            }
	            return null; 
	        });

	    } catch (IOException e) {
	        throw new RuntimeException("Failed to create your requested file to download. Try again");
	    }

	    System.out.println("DSV successfully created at: " + downloadPath);
	    return downloadPath;
	}

}




