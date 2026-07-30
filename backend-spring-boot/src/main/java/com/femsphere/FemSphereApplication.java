package com.femsphere;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FemSphereApplication {
    public static void main(String[] args) {
        SpringApplication.run(FemSphereApplication.class, args);
        System.out.println("FemSphere Spring Boot + PostgreSQL Backend Started!");
    }
}
