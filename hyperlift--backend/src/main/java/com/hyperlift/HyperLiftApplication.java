package com.hyperlift;

import com.hyperlift.dao.UserDao;
import com.hyperlift.entity.User;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import lombok.RequiredArgsConstructor;

@SpringBootApplication
@RequiredArgsConstructor
public class HyperLiftApplication {

    public static void main(String[] args) {
        SpringApplication.run(HyperLiftApplication.class, args);
    }

}
