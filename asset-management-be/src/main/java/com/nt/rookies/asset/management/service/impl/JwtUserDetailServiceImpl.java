package com.nt.rookies.asset.management.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nt.rookies.asset.management.service.UserService; 

@Service
public class JwtUserDetailServiceImpl implements UserDetailsService {
  @Autowired private UserService userService;

  @Override
  @Transactional(readOnly = true)
  public UserDetails loadUserByUsername(String username) {
    return userService
        .findActiveByUsername(username)
        .map(
            u -> {
              User.UserBuilder builder = User.withUsername(u.getUsername());
              builder.password(u.getPassword());
              SimpleGrantedAuthority authority = new SimpleGrantedAuthority(u.getType());
              builder.authorities(authority.toString());
              return builder.build();
            })
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
  }
}
