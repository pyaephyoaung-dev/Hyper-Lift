package com.hyperlift.config;

import com.hyperlift.dao.UserDao;
import com.hyperlift.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private static final String ADMIN_USERNAME = "rohan_7";
    private static final String ADMIN_PASSWORD = "P12345#";
    private static final String ADMIN_EMAIL = "rohan&@mail.com";
    private static final String ADMIN_FIRST_NAME = "Rohan";
    private static final String ADMIN_LAST_NAME = "Kishibe";

    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserDao userDao, PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userDao.existsByUsername(ADMIN_USERNAME)) {
            return;
        }

        User admin = User.builder()
                .firstName(ADMIN_FIRST_NAME)
                .lastName(ADMIN_LAST_NAME)
                .username(ADMIN_USERNAME)
                .email(ADMIN_EMAIL)
                .password(passwordEncoder.encode(ADMIN_PASSWORD))
                .role("ADMIN")
                .active(true)
                .build();

        userDao.save(admin);
        log.info("Default admin account created (username: {})", ADMIN_USERNAME);
    }
}
