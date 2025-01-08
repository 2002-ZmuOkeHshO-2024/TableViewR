package com.task.TableViewR;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class LogoutController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TablesRepository tablesRepository;

    @GetMapping("/logout")
    public ResponseEntity<?> handleLogout(@RequestAttribute("userName") String userName) {
        Map<String, Object> response = new HashMap<>();

        String filePath = GlobalData.getFilePath();
        Users user = userRepository.findByEmail(userName);
        if (user == null) {
            response.put("message", "User not found. Please log in first.");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }

        if (!user.isActive()) {
            response.put("message", "User is not currently logged in.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        try {
           
            List<Tables> incompleteTables = tablesRepository.findByEmailAndTableNameIsNull(userName);
            tablesRepository.deleteAll(incompleteTables);

            
            Path userFolder = Paths.get(filePath, userName);
            if (Files.exists(userFolder)) {
                deleteDirectory(userFolder.toFile());
            }

           
            user.setActive(false);
            userRepository.save(user);

            response.put("message", "Logout successful. All temporary data has been cleared.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.put("message", "Failed to process the logout request. Please try again.");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

   
    private void deleteDirectory(File directory) throws IOException {
        File[] files = directory.listFiles();

        if (files != null) {
            for (File file : files) {
                if (file.isDirectory()) {
                   
                    deleteDirectory(file);
                } else {
                    
                    Files.delete(file.toPath());
                }
            }
        }

       
        Files.delete(directory.toPath());
    }


}
