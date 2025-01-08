package com.task.TableViewR;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ImportResource;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@EnableWebMvc
@ImportResource("classpath:jdbc.xml")
public class TableViewRApplication implements WebMvcConfigurer {

	public static void main(String[] args) {
		
		
		SpringApplication.run(TableViewRApplication.class, args);
	}
	
//	@Override
//    public void addCorsMappings(CorsRegistry registry) {
//       
//        registry.addMapping("/**")
//                .allowedOrigins("http://localhost:3000") 
//                .allowedMethods("GET", "POST", "PUT", "DELETE","PATCH","OPTIONS")  
//                .allowedHeaders("*")  
//                .allowCredentials(true); 
//        
//    }
}
