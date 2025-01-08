package com.task.TableViewR;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {
    
   
	@Query("SELECT u FROM Users u WHERE u.email = :email")
    Users findByEmail(@Param("email") String email);
    
    
    
    @Query("SELECT u.id FROM Users u WHERE u.email = :email")
    Long findUserIdByEmail(@Param("email") String email);

}
