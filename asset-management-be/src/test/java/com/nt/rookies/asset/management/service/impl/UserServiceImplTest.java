package com.nt.rookies.asset.management.service.impl;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.anyInt;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.nt.rookies.asset.management.dto.UserDTO;
import com.nt.rookies.asset.management.entity.Location;
import com.nt.rookies.asset.management.entity.User;
import com.nt.rookies.asset.management.exception.ResourceNotFoundException;
import com.nt.rookies.asset.management.repository.AssignmentRepository;
import com.nt.rookies.asset.management.repository.UserRepository;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

  UserServiceImpl underTest;
  @Mock UserRepository userRepoMock;
  @Mock AssignmentRepository assignmentRepositoryMock;
  @Mock PasswordEncoder passwordEncoderMock;

  @BeforeEach
  void setUp() {
    ModelMapper modelMapper = new ModelMapper();
    underTest =
        new UserServiceImpl(
            userRepoMock, modelMapper, passwordEncoderMock, assignmentRepositoryMock);
  }

  @Test
  @DisplayName("Test get user by id return user")
  void testGetUserByIdReturnUser() {
    Location hanoi = new Location();
    hanoi.setId(1);
    hanoi.setLocationName("Ha Noi");
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss.S");
    Date joineddate = null;
    Date birthdate = null;
    try {
      joineddate = sdf.parse("2019-09-11 12:56:54.0");
      birthdate = sdf.parse("1991-12-22 03:59:31.0");
    } catch (ParseException e) {
      e.printStackTrace();
    }
    User testUser = new User();
    testUser.setId(1);
    testUser.setBirthDate(birthdate);
    testUser.setFirstName("An");
    testUser.setLastName("Nguyen Thuy");
    testUser.setPassword("staff");
    testUser.setGender("Female");
    testUser.setStatus(1);
    testUser.setStaffCode("SD001");
    testUser.setUsername("annt");
    testUser.setLocation(hanoi);
    testUser.setJoinedDate(joineddate);
    testUser.setType("Staff");
    when(userRepoMock.findById(1)).thenReturn(Optional.of(testUser));
    UserDTO userDTO = underTest.getUserById(1);
    verify(userRepoMock,times(1)).findById(1);
    assertEquals(userDTO.getFirstName(),testUser.getFirstName());
  }
  @Test
  @DisplayName("Test get user by id return ThrowResourceNotFoundException")
  void testGetUserByIdReturnThrowResourceNotFoundException() {
    when(userRepoMock.findById(anyInt())).thenReturn(Optional.empty());
    assertThrows(ResourceNotFoundException.class, () -> underTest.getUserById(anyInt()));
    verify(userRepoMock, times(1)).findById(anyInt());
  }
  @Test
  @DisplayName("Test update user return user")
  void testUpdateUser_InvalidId_returnUser() {
    Location hanoi = new Location();
    hanoi.setId(1);
    hanoi.setLocationName("Ha Noi");
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss.S");
    Date joineddate = null;
    Date birthdate = null;
    try {
      joineddate = sdf.parse("2019-09-11 12:56:54.0");
      birthdate = sdf.parse("1991-12-22 03:59:31.0");
    } catch (ParseException e) {
      e.printStackTrace();
    }
    User testUser = new User();
    testUser.setId(1);
    testUser.setBirthDate(birthdate);
    testUser.setFirstName("An");
    testUser.setLastName("Nguyen Thuy");
    testUser.setPassword("staff");
    testUser.setGender("Female");
    testUser.setStatus(1);
    testUser.setStaffCode("SD001");
    testUser.setUsername("annt");
    testUser.setLocation(hanoi);
    testUser.setJoinedDate(joineddate);
    testUser.setType("Staff");
    when(userRepoMock.findById(1)).thenReturn(Optional.of(testUser));
    UserDTO expected = new UserDTO(1,"SD100","An","Nguyen Thuy","long123",new Date(),"Female",birthdate,"Admin",1,null);
    when(userRepoMock.save(any(User.class))).thenReturn(new User());
    UserDTO userDTO = underTest.updateUser(1, expected);
    ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
    verify(userRepoMock, times(1)).save(userCaptor.capture());
    User actualSaved = userCaptor.getValue();
    assertEquals(expected.getFirstName(), actualSaved.getFirstName());
  }
  @Test
  @DisplayName("Test update user fail by id return throwResourceNotFoundException")
  void testUpdateAsset_InvalidId_throwResourceNotFoundException() {
    UserDTO userDTO = new UserDTO();
    assertThrows(ResourceNotFoundException.class, () -> underTest.updateUser(anyInt(), userDTO));
  }
  @Test
  void createUser() {

  }
}
