package com.nt.rookies.asset.management.controller;

import com.nt.rookies.asset.management.dto.AssetDTO;
import com.nt.rookies.asset.management.service.AssetService;
import com.nt.rookies.asset.management.service.UserService;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AssetRestControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean AssetRestController assetRestController;
  @MockBean AssetService assetServiceMock;
  @MockBean UserService userServiceMock;

  @Test
  @DisplayName("Test get all method")
  @WithMockUser(authorities = {"Admin"})
  void getAllAssets() throws Exception {
    AssetDTO asset = new AssetDTO();
    asset.setAssetName("Test name");

    List<AssetDTO> allAssets = List.of(asset);

    given(assetRestController.getAllAssets()).willReturn(allAssets);

    mockMvc
        .perform(get("/api/v1.0/assets").contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(1)))
        .andExpect(jsonPath("$[0].assetName", Matchers.is(asset.getAssetName())));
  }

  @Test
  void getUserById() {
  }
}
