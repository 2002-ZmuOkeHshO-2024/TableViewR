package com.task.TableViewR;

import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;



public interface TablesRepository extends JpaRepository<Tables, Long> {

    // Check if a user exists by email
    @Query("SELECT COUNT(t) > 0 FROM Tables t WHERE t.email = :email")
    boolean existsByEmail(@Param("email") String email);

    // Get fileName by email and tableId
    @Query("SELECT t.fileName FROM Tables t WHERE t.email = :email AND t.id = :id")
    String findFileNameByEmailAndId(@Param("email") String email, @Param("id") Long id);

    // Check if a tableName exists for a user
    @Query("SELECT COUNT(t) > 0 FROM Tables t WHERE t.email = :email AND t.tableName = :tableName")
    boolean existsByEmailAndTableName(@Param("email") String email, @Param("tableName") String tableName);

    // Find first record by email and null fileName
    @Query("SELECT t FROM Tables t WHERE t.email = :email AND t.fileName IS NULL")
    Tables findFirstByEmailAndFileNameIsNull(@Param("email") String email);

    // Find first record by email, fileName, null tableName, and id
    @Query("SELECT t FROM Tables t WHERE t.email = :email AND t.fileName = :fileName AND t.tableName IS NULL AND t.id = :id")
    Tables findFirstByEmailAndFileNameAndTableNameIsNullAndId(
        @Param("email") String email, 
        @Param("fileName") String fileName, 
        @Param("id") Long id
    );
    
    
    // Get table by email and tablename 
    @Query("SELECT t FROM Tables t WHERE t.email = :username AND t.tableName = :tableName")
    Tables findTableByUsernameAndTableName(@Param("username") String username, @Param("tableName") String tableName);

    // Get table names and IDs by email
    @Query("SELECT t.tableName, t.id FROM Tables t WHERE t.email = :email ORDER BY t.tableName ASC")
    List<Object[]> findTableNamesAndIdsByEmail(@Param("email") String email);

    // Find tableName by id and email
    @Query("SELECT t.tableName FROM Tables t WHERE t.email = :email AND t.id = :id")
    String findTableNameByEmailAndId(@Param("email") String email, @Param("id") Long id);

    // Find all tableNames for a user, ordered by tableName
    @Query("SELECT t.tableName FROM Tables t WHERE t.email = :email ORDER BY t.tableName ASC")
    List<String> findTableNamesByEmail(@Param("email") String email);

	List<Tables> findByEmailAndTableNameIsNull(@Param("email") String email);
}
