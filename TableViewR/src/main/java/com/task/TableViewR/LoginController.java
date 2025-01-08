package com.task.TableViewR;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class LoginController {

    @Autowired
    private UserRepository userRepository;

   
    private final String SECRET_KEY = "/5tKPJzonEg2JnkLoTy6nyI1tpC1e5pKcprQQe6Ztek=";

    @PostMapping("/login")
    public ResponseEntity<?> handleRequest(@RequestHeader("X-User-Name") String userName,
                                           @RequestHeader("X-User-Password") String password,
                                           @RequestHeader("X-User-Request") String requestType) {

    	 Map<String, Object> response = new HashMap<>();

        if (userName == null || userName.trim().isEmpty() || password == null || password.trim().isEmpty()) {
        	response.put("message", "Username or password cannot be empty.");
        	return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);

        }

        if (requestType.equalsIgnoreCase("register")) {
            return handleRegistration(userName, password);
        } else if (requestType.equalsIgnoreCase("login")) {
            return handleLogin(userName, password);
        } else {
        	 response.put("message", "Invalid request type. Use 'login' or 'register'.");
             return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    private ResponseEntity<?> handleRegistration(String userName, String password) {
    	Map<String, Object> response = new HashMap<>();
        Users existingUser = userRepository.findByEmail(userName);
        System.out.println(userName);
       
        if (existingUser != null) {
        	 System.out.println(existingUser.getEmail());
        	response.put("message", "User already exists. Please login instead.");
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }

        if (!isValidPassword(password)) {
        	response.put("message", "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one digit, and one special character.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        String hashedPassword = hashPassword(password);
        Users newUser = new Users(userName, hashedPassword);
        newUser.setActive(true);
        userRepository.save(newUser);

        String token = generateToken(userName);
        response.put("message", "Registered successfully");
        response.put("token",token);


        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    private ResponseEntity<?> handleLogin(String userName, String password) {
    	 Map<String, Object> response = new HashMap<>();
        Users user = userRepository.findByEmail(userName);

        if (user == null) {
        	response.put("message", "Incorrect username. Please register if you're a new user.");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }

        if (!validatePassword(password, user.getPassword())) {
        	 response.put("message", "Incorrect password. Please try again.");
             return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
        
        
        if (user.isActive()) {
            response.put("message", "You are already logged in from another device or session. Please log out from that session before proceeding.");
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }
        user.setActive(true);
        userRepository.save(user);


        String token = generateToken(userName);
        response.put("message", "Loggedin successfully");
        response.put("token", token);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private boolean isValidPassword(String password) {
        
        String passwordPattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$";

        return password.matches(passwordPattern);
    }

    private String generateToken(String userName) {
        Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));

        return Jwts.builder()
                .setSubject(userName)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 2 * 60 * 60 * 1000)) 
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    private String hashPassword(String password) {
        return org.springframework.security.crypto.bcrypt.BCrypt.hashpw(password, org.springframework.security.crypto.bcrypt.BCrypt.gensalt());
    }

    private boolean validatePassword(String rawPassword, String hashedPassword) {
        return org.springframework.security.crypto.bcrypt.BCrypt.checkpw(rawPassword, hashedPassword);
    }
}
