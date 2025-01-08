package com.task.TableViewR;

import jakarta.persistence.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "table_entries")
public class Tables {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = true)
    private String tableName;

    @Column(nullable = true)
    private String fileName;

    @Column(nullable = true)
    private LocalDateTime creationTime;

 
    public Tables() {
    	
    }
    
    public Tables(String email) {
        this.email = email;
    }
    
    public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public LocalDateTime getCreationTime() {
		return creationTime;
	}

	public void setCreationTime(LocalDateTime creationTime) {
		this.creationTime = creationTime;
	}
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

   
}
