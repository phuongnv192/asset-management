package com.nt.rookies.asset.management.controller;

import com.nt.rookies.asset.management.dto.UserDTO;
import com.nt.rookies.asset.management.service.UserService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** REST controller for user. */
@RestController
@RequestMapping("/api/v1.0/users")
public class UserRestController {
  private final UserService userService;

  @Autowired
  public UserRestController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping()
  public List<UserDTO> getAllUserByLocation() {
    return userService.findAllByLocation();
  }

  @PostMapping()
  public UserDTO createUser(@RequestBody UserDTO user) {
    return userService.createUser(user);
  }

  @GetMapping("/{id}")
  public UserDTO getUserById(@PathVariable(name = "id") Integer id) {
    return userService.getUserById(id);
  }

  @PutMapping("/{id}")
  public UserDTO updateUser(@PathVariable(name = "id") Integer id, @RequestBody UserDTO user) {
    return userService.updateUser(id, user);
  }

  @PutMapping("/disable/{id}")
  public ResponseEntity<UserDTO> disableUser(@PathVariable(name = "id") Integer id) {
    return new ResponseEntity<>(userService.disableUser(id), HttpStatus.OK);
  }

  @GetMapping("/{id}/valid")
  public ResponseEntity<Boolean> isValidToDisable(@PathVariable(name = "id") Integer id) {
    return new ResponseEntity<>(userService.isValidToDisable(id), HttpStatus.OK);
  }

}
