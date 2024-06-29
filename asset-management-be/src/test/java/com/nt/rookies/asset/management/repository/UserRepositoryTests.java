package com.nt.rookies.asset.management.repository;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.nt.rookies.asset.management.entity.Location;
import com.nt.rookies.asset.management.entity.User;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class UserRepositoryTests {
  @Autowired private UserRepository underTest;

  @Test
  @DisplayName("test find User by username return user ")
  void testFindByUsernameReturnUserTheSameUserName() {
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
    assertFalse(underTest.findByUsername("annt").isEmpty());
    User user = underTest.findByUsername("annt").get();

    assertAll(
        () -> assertEquals(user.getId(), testUser.getId()),
        () -> assertEquals(user.getStaffCode(), testUser.getStaffCode()),
        () -> assertEquals(user.getFirstName(), testUser.getFirstName()),
        () -> assertEquals(user.getLastName(), testUser.getLastName()),
        () -> assertEquals(user.getUsername(), testUser.getUsername()),
        () -> assertEquals(sdf.format(user.getJoinedDate()), sdf.format(testUser.getJoinedDate())),
        () -> assertEquals(user.getGender(), testUser.getGender()),
        () -> assertEquals(sdf.format(user.getBirthDate()), sdf.format(testUser.getBirthDate())),
        () -> assertEquals(user.getType(), testUser.getType()),
        () -> assertEquals(user.getStatus(), testUser.getStatus()),
        () -> assertEquals(user.getLocation(), testUser.getLocation()));
  }

  @Test
  @DisplayName("Test find user in the same username return empty user")
  void testFindByUsernameReturnEmptyUser() {
    Optional<User> users = underTest.findByUsername("long");
    assertTrue(users.isEmpty());
  }

  @Test
  @DisplayName("Test get all users in the same location return all asset in the same location")
  public void testFindAllByLocationReturnAllInTheSameLocation() {
    Location hanoi = new Location();
    hanoi.setId(1);
    hanoi.setLocationName("Ha Noi");
    List<User> users = underTest.findAllByLocation(hanoi);

    users.forEach(
        user -> assertEquals(hanoi.getLocationName(), user.getLocation().getLocationName()));
  }

  @Test
  @DisplayName("Test get all users in the same location return empty list")
  void testFindAllByLocationReturnEmptyList() {
    Location hue = new Location();
    hue.setId(4);
    hue.setLocationName("Hue");
    List<User> users = underTest.findAllByLocation(hue);
    assertTrue(users.isEmpty());
  }

  @Test
  @DisplayName("Test get maxUsernamePostfix in the same location return number")
  void testFindMaxUsernamePostfixReturnNumber() {
    assertFalse(underTest.findMaxUsernamePostfix("binhnv").isEmpty());
    Integer numberOfUsername = underTest.findMaxUsernamePostfix("binhnv").get();
    assertEquals(numberOfUsername, 27);
  }

  @Test
  @DisplayName("Test get maxUsernamePostfix in the same location return number")
  void testFindMaxUsernamePostfixReturnNull() {
    assertFalse(underTest.findMaxUsernamePostfix("long").isEmpty());
    Integer numberOfUsername = underTest.findMaxUsernamePostfix("long").get();
    assertEquals(numberOfUsername, 0);
  }
}
