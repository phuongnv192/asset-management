package com.nt.rookies.asset.management.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.nt.rookies.asset.management.entity.Category;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class CategoryRepositoryTest {
  @Autowired CategoryRepository underTest;

  @BeforeEach
  void setUp() {}

  @AfterEach
  void tearDown() {}

  @Test
  @DisplayName("Test find category by categoryName return category")
  void testFindByCategoryName() {
    Category categoryTest = new Category();
    categoryTest.setId(1);
    categoryTest.setCategoryName("Laptop");
    categoryTest.setCategoryPrefix("LA");

    Category category = underTest.findByCategoryName("Laptop");
    assertEquals(category, categoryTest);
  }
}
