package com.hyperlift.security;

import com.hyperlift.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Getter
public class SecurityUser implements UserDetails {

    private final Long id;
    private final String firstName;
    private final String lastName;
    private final String username;
    private final String email;
    private final String password;
    private final String role;
    private final boolean active;
    private final Double height;
    private final Double weight;
    private final Integer age;
    private final String gender;
    private final String goal;
    private final String experienceLevel;

    public SecurityUser(User user) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.role = user.getRole();
        this.active = user.isActive();
        this.height = user.getHeight();
        this.weight = user.getWeight();
        this.age = user.getAge();
        this.gender = user.getGender();
        this.goal = user.getGoal();
        this.experienceLevel = user.getExperienceLevel();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}
