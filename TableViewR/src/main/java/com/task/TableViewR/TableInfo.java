package com.task.TableViewR;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvValidationException;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;


@Service
@Scope("prototype")
public class TableInfo {

    @JsonProperty("id")
    private int id = 1;

    @JsonProperty("tableName")
    private String tableName;

    @JsonProperty("delimiter")
    private String delimiter = ",";
    
    @JsonProperty("pkColumn")
    private Integer pkColumn=-1;

	@JsonProperty("firstLineRecord")
    private Boolean firstLineRecord;

    @JsonProperty("columnCount")
    private int columnCount;

    private List<String> columnNames;

    private List<String> columnDataTypes;

    private List<String> length1;

    private List<String> length2;

    private List<String> dateFormats;

    

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
    
    public Integer getPkColumn() {
		return pkColumn;
	}

	public void setPkColumn(Integer pkColumn) {
		this.pkColumn = pkColumn;
	}


    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getDelimiter() {
        return delimiter;
    }

    public void setDelimiter(String delimiter) {
        this.delimiter = delimiter;
    }

    

    public Boolean isFirstLineRecord() {
        return firstLineRecord;
    }

    public void setFirstLineRecord(Boolean firstLineRecord) {
        this.firstLineRecord = firstLineRecord;
    }

    public int getColumnCount() {
        return columnCount;
    }

    public void setColumnCount(int columnCount) {
        this.columnCount = columnCount;
    }

    public List<String> getColumnNames() {
        return columnNames;
    }

    public void setColumnNames(List<String> columnNames) {
        this.columnNames = columnNames;
    }

    public List<String> getColumnDataTypes() {
        return columnDataTypes;
    }

    public void setColumnDataTypes(List<String> columnDataTypes) {
        this.columnDataTypes = columnDataTypes;
    }

    public List<String> getLength1() {
        return length1;
    }

    public void setLength1(List<String> length1) {
        this.length1 = length1;
    }

    public List<String> getLength2() {
        return length2;
    }

    public void setLength2(List<String> length2) {
        this.length2 = length2;
    }

    public List<String> getDateFormats() {
        return dateFormats;
    }

    public void setDateFormats(List<String> dateFormats) {
        this.dateFormats = dateFormats;
    }

	public void findDelimiter(String line1) throws CsvValidationException, IOException {
        String[] possibleDelimiters = {",", "\t", ";", "|", "#"};
        int maxColumns = 0;

        for (String delim : possibleDelimiters) {
            
                
                CSVParserBuilder parserBuilder = new CSVParserBuilder();
                parserBuilder.withSeparator(delim.charAt(0));

               
                StringReader stringReader = new StringReader(line1);
                CSVReader csvReader = new CSVReaderBuilder(stringReader)
                        .withCSVParser(parserBuilder.build())
                        .build();

                
                String[] columns = csvReader.readNext();
               
                if (columns != null && columns.length > maxColumns) {
                    maxColumns = columns.length;
                    delimiter = delim;
                }
                csvReader.close();
                
           
        }
        
         columnCount = maxColumns;
      
    }
		
	public void setColumnDataTypes1(String[] columns)  {
                          
            List<String> columnDataTypes = new ArrayList<>();
            List<String> dateFormats = new ArrayList<>();

            
            for (String column : columns) {
                String dataType = GlobalData.findDataType(column);
                if(dataType.startsWith("DATE")||dataType.startsWith("TIME")) {
                	String[] dates = dataType.split("&");
                	dataType = dates[0];
                	dateFormats.add(dates[1]);
                	
                }
                else {  	
                	dateFormats.add("");
                }
                columnDataTypes.add(dataType);
            }
        
            this.setColumnDataTypes(columnDataTypes);
            this.setDateFormats(dateFormats);
            
        
    }

	
	public void setColumnNames1(List<String> columnDataTypes, String[] line) {
        
        boolean allVarchar = true;       
        for (String dataType : columnDataTypes) {
            if (!dataType.equals("VARCHAR")) {
                allVarchar = false;
                break;  
            }
        }
        	
        	 List<String> validColumnNames = new ArrayList<>();
 		    
 		    for (int i = 0; i < line.length; i++) {
 		        String validColumnName = GlobalData.getValidName(line[i], i + 1); 
 		        validColumnNames.add(validColumnName);
 		    } 
 		   
 		    this.setColumnNames(validColumnNames);
        	
        	
        	if(!allVarchar) {
        	
        	 boolean allVarchar2 = true;  
            
        	
        	 
             for (String value : line) {
            	
                 if(!GlobalData.findDataType(value).equals("VARCHAR") ) {
                	 
                	 allVarchar2 = false ;
                	 break;       	 
                 }
                 
             }
               	
        	if(!allVarchar2) {
        		 this.setFirstLineRecord(true);
        		 return ;
        	}
        	else {
        		this.setFirstLineRecord(false);
        		return ;       		
        	} 	      	
        }
        else { 	
        	 this.setFirstLineRecord(true);
        	 return ;        	
        }

              
        
    }
	
	
	public void lengthAdjuster(List<String> dataTypes) {
	    List<String> updatedLength1 = new ArrayList<>();
	    List<String> updatedLength2 = new ArrayList<>();

	    for (String dataType : dataTypes) {
	        switch (dataType.toUpperCase()) {
	            case "VARCHAR":
	                updatedLength1.add("255");
	                updatedLength2.add("-1"); 
	                break;

	            case "DECIMAL":
	                updatedLength1.add("10"); 
	                updatedLength2.add("2");  
	                break;

	            default:
	                updatedLength1.add("-1"); 
	                updatedLength2.add("-1"); 
	                break;
	        }
	    }

	    this.setLength1(updatedLength1);
	    this.setLength2(updatedLength2);
	}



	public void updateTableInfo(TableInfo updatedInfo) {
	    if (updatedInfo == null) {
	        return;
	    }
	    
	    if (updatedInfo.getTableName() != null) {
	        this.setTableName(GlobalData.getValidName(updatedInfo.getTableName()));
	    }

	    if (updatedInfo.getDelimiter() != null) {
	        this.setDelimiter(updatedInfo.getDelimiter());
	    }

	    if (updatedInfo.getColumnNames() != null && !updatedInfo.getColumnNames().isEmpty()) {
	       
	        List<String> validColumnNames = new ArrayList<>();

	        int i=0;
	        for (String columnName : updatedInfo.getColumnNames()) {
	            String validColumnName = GlobalData.getValidName(columnName, ++i); 
	            validColumnNames.add(validColumnName);
	        }

	        
	        this.setColumnNames(validColumnNames);
	    }

	    if (updatedInfo.getColumnDataTypes() != null && !updatedInfo.getColumnDataTypes().isEmpty()) {
	        this.setColumnDataTypes(updatedInfo.getColumnDataTypes());
	    }
	    

	    if (updatedInfo.getDateFormats() != null && !updatedInfo.getDateFormats().isEmpty()) {
	        this.setDateFormats(updatedInfo.getDateFormats());
	    }

	    if (updatedInfo.getLength1() != null && !updatedInfo.getLength1().isEmpty()) {
	        this.setLength1(updatedInfo.getLength1());
	    }

	    if (updatedInfo.getLength2() != null && !updatedInfo.getLength2().isEmpty()) {
	        this.setLength2(updatedInfo.getLength2());
	    }

	    if (updatedInfo.getColumnCount() != 0) {
	        this.setColumnCount(updatedInfo.getColumnCount());
	    }
	    
	    if (updatedInfo.getPkColumn() != null) {
	        this.setPkColumn(updatedInfo.getPkColumn());
	    }
	    System.out.println("value of pkColumn : "+updatedInfo.getPkColumn());
	    
	    if(updatedInfo.isFirstLineRecord() != null) {
	    	
	    	 this.setFirstLineRecord(updatedInfo.firstLineRecord);
	    	
	    }	   
	  
	}


	@Override
	public String toString() {
	    StringBuilder sb = new StringBuilder();
	    sb.append("TableInfo:\n");
	    sb.append("TableName:").append(tableName).append("\n");;
	    sb.append("ID: ").append(id).append("\n");
	    sb.append("Delimiter: ").append(delimiter).append("\n");
	    sb.append("Primary Key column no: ").append(pkColumn).append("\n");
	    sb.append("First Line is Record: ").append(firstLineRecord).append("\n");
	    sb.append("Column Count: ").append(columnCount).append("\n");
	    sb.append("Column Names: ").append(formatList(columnNames)).append("\n");
	    sb.append("Column Data Types: ").append(formatList(columnDataTypes)).append("\n");
	    sb.append("Length1: ").append(formatList(length1)).append("\n");
	    sb.append("Length2: ").append(formatList(length2)).append("\n");
	    return sb.toString();
	}

	private String formatList(List<?> list) {
	    if (list == null || list.isEmpty()) {
	        return "[]";
	    }
	    StringBuilder sb = new StringBuilder("[\n");
	    for (Object item : list) {
	        sb.append("  ").append(item).append("\n");
	    }
	    sb.append("]");
	    return sb.toString();
	}


	


	



	

}
