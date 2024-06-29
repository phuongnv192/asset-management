package com.nt.rookies.asset.management.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.nt.rookies.asset.management.entity.Assignment;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class AssignmentRepositoryTest {
  @Autowired AssignmentRepository underTest;

  @Test
  @DisplayName("test get list assignment by username return list assignment")
  void findRecentAssignmentsByUserReturnListInTheSameUsername() {
    List<Assignment> assignmentList = underTest.findRecentAssignmentsByUser("annt");
    assertEquals(assignmentList.size(), 2);
    assertEquals(assignmentList.get(0).getId(), 3);
  }
  @Test
  @DisplayName("test get list assignment by username return list assignment")
  void findRecentAssignmentsByUserReturnEmptyList() {
    List<Assignment> assignmentList = underTest.findRecentAssignmentsByUser("123456");
    assertEquals(assignmentList.size(), 0);
    assertTrue(assignmentList.isEmpty());
  }
}
