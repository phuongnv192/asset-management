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

import com.nt.rookies.asset.management.dto.AssetDTO;
import com.nt.rookies.asset.management.dto.AssetReportDTO;
import com.nt.rookies.asset.management.entity.Asset;
import com.nt.rookies.asset.management.entity.Category;
import com.nt.rookies.asset.management.entity.Location;
import com.nt.rookies.asset.management.exception.ResourceDeleteException;
import com.nt.rookies.asset.management.exception.ResourceNotFoundException;
import com.nt.rookies.asset.management.repository.AssetRepository;
import com.nt.rookies.asset.management.repository.AssignmentRepository;
import com.nt.rookies.asset.management.repository.CategoryRepository;
import com.nt.rookies.asset.management.service.UserService;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.commons.lang3.StringUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

@ExtendWith(MockitoExtension.class)
class AssetServiceImplTest {

  AssetServiceImpl underTest;
  @Mock UserService userServiceMock;
  @Mock AssetRepository assetRepoMock;
  @Mock CategoryRepository categoryRepositoryMock;
  @Mock ModelMapper modelMapperMock;
  @Mock AssignmentRepository assignmentRepositoryMock;

  @BeforeEach
  void setUp() {
    ModelMapper modelMapper = new ModelMapper();
    underTest =
        new AssetServiceImpl(
            userServiceMock,
            assetRepoMock,
            categoryRepositoryMock,
            modelMapper,
            assignmentRepositoryMock);
    ;
  }

  @Test
  @DisplayName("Test find all by location return list of asset in the same location")
  void findAllByLocation() {
    Location location = new Location();
    location.setId(1);
    location.setLocationName("Ha Noi");

    when(userServiceMock.getUserLocation()).thenReturn(location);
    when(assetRepoMock.findAllByLocation(location))
        .thenReturn(
            Stream.of(new Asset(1, "A001", "Iphone", "Specs", new Date(), "Available", null, null))
                .collect(Collectors.toList()));

    List<AssetDTO> assetResponseList = underTest.findAllByLocation();

    verify(userServiceMock, times(1)).getUserLocation();
    verify(assetRepoMock, times(1)).findAllByLocation(location);
    assertEquals(1, assetResponseList.size());
  }

  @Test
  @DisplayName("Test find all by location return empty list")
  void findAllByLocationReturnEmptyList() {
    Location location = new Location();
    location.setId(6);
    location.setLocationName("Hue");

    when(userServiceMock.getUserLocation()).thenReturn(location);
    when(assetRepoMock.findAllByLocation(location)).thenReturn(new ArrayList<>());

    List<AssetDTO> assetDTOs = underTest.findAllByLocation();
    assertTrue(assetDTOs.isEmpty());
  }

  @Test
  @DisplayName("Test is delete asset throw IllegalArgumentException")
  void testIsValidToDeleteThrowIllegalArgumentException() {
    assertThrows(
        IllegalArgumentException.class, () -> underTest.isValidToDelete(null), "Id is invalid");
  }

  @Test
  @DisplayName("Test is delete asset return true for id: 1, false for id: 2")
  void testIsValidToDeleteReturnTrue() {
    when(assignmentRepositoryMock.getTotalHistoricalAssigmentOfAnAsset(1)).thenReturn(0);
    when(assignmentRepositoryMock.getTotalHistoricalAssigmentOfAnAsset(2)).thenReturn(1);

    assertAll(
        () -> assertTrue(underTest.isValidToDelete(1)),
        () -> assertFalse(underTest.isValidToDelete(2)));
  }

  @Test
  @DisplayName("Test delete asset successful")
  void deleteAssetSuccessful() {
    Asset asset = new Asset(1, "A001", "Iphone", "Specs", new Date(), "Available", null, null);

    when(assetRepoMock.findById(1)).thenReturn(Optional.of(asset));

    underTest.deleteAsset(1);
    verify(assetRepoMock, times(1)).delete(asset);
  }

  @Test
  @DisplayName("Test delete asset throw ResourceDeleteException")
  void deleteAssetThrowResourceDeleteException() {
    when(assignmentRepositoryMock.getTotalHistoricalAssigmentOfAnAsset(anyInt())).thenReturn(1);

    assertThrows(ResourceDeleteException.class, () -> underTest.deleteAsset(anyInt()));
  }

  @Test
  @DisplayName("Test delete asset throw ResourceNotFoundException")
  void deleteAssetThrowResourceNotFoundException() {
    when(assetRepoMock.findById(anyInt())).thenThrow(ResourceNotFoundException.class);

    assertThrows(ResourceNotFoundException.class, () -> underTest.deleteAsset(1));

    verify(assetRepoMock, times(1)).findById(1);
  }

  @Test
  @DisplayName("Test get asset by id return asset")
  void testFindAssetByIdReturnAsset() {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
    Date installedDate = null;
    try {
      installedDate = sdf.parse("2021-10-25 00:00:00");
    } catch (ParseException e) {
      e.printStackTrace();
    }
    Location HCM = new Location();
    HCM.setId(3);
    HCM.setLocationName("HCM");
    Category category = new Category();
    category.setId(1);
    category.setCategoryName("Laptop");
    category.setCategoryPrefix("LA");
    Asset asset =
        new Asset(
            1,
            "LA000001",
            "Dell Inspiron 15 3511",
            "Persistent heuristic paradigm",
            installedDate,
            "Available",
            HCM,
            category);
    when(assetRepoMock.findById(1)).thenReturn(Optional.of(asset));
    AssetDTO dtos = underTest.getAssetById(1);
    verify(assetRepoMock, times(1)).findById(1);
    assertEquals(dtos.getAssetCode(), asset.getAssetCode());
  }

  @Test
  @DisplayName("Test get asset by id return ThrowResourceNotFoundException")
  void testFindAssetByIdReturnThrowResourceNotFoundException() {
    when(assetRepoMock.findById(anyInt())).thenReturn(Optional.empty());
    assertThrows(ResourceNotFoundException.class, () -> underTest.getAssetById(anyInt()));
    verify(assetRepoMock, times(1)).findById(anyInt());
  }

  @Test
  @DisplayName("Test create asset return asset")
  void testCreateAssetReturnAsset() {
    Location location = new Location();
    location.setId(1);
    location.setLocationName("Ha Noi");
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
    Date installedDate = null;
    try {
      installedDate = sdf.parse("2021-10-25 00:00:00");
    } catch (ParseException e) {
      e.printStackTrace();
    }
    when(userServiceMock.getUserLocation()).thenReturn(location);

    Category category = new Category();
    category.setCategoryPrefix("LA");
    category.setCategoryName("Laptop");

    AssetDTO assetDTO = new AssetDTO();
    assetDTO.setAssetName("123");
    assetDTO.setCategoryName("Laptop");
    assetDTO.setInstalledDate(installedDate);
    assetDTO.setSpecification("123123");
    assetDTO.setState("Available");
    when(categoryRepositoryMock.findByCategoryName(assetDTO.getCategoryName()))
        .thenReturn(category);
    Asset asset = new Asset();
    asset.setAssetName(assetDTO.getAssetName());
    asset.setCategory(category);
    asset.setId(12);
    when(assetRepoMock.save(any(Asset.class))).thenReturn(asset);
    StringBuilder assetCodeTest = new StringBuilder(category.getCategoryPrefix());
    assetCodeTest.append(StringUtils.leftPad(asset.getId().toString(), 6, "0"));
    AssetDTO createdAsset = underTest.createAsset(assetDTO);
    ArgumentCaptor<Asset> assetCaptor = ArgumentCaptor.forClass(Asset.class);
    verify(assetRepoMock, times(2)).save(assetCaptor.capture());
    Asset actualSaved = assetCaptor.getValue();
    assertEquals(assetCodeTest.toString(), actualSaved.getAssetCode());
    assertEquals(createdAsset.getAssetName(), actualSaved.getAssetName());
  }

  @Test
  @DisplayName("Test update asset fail by id return throwResourceNotFoundException")
  void testUpdateAsset_InvalidId_throwResourceNotFoundException() {
    AssetDTO assetDTO = new AssetDTO();
    assertThrows(ResourceNotFoundException.class, () -> underTest.updateAsset(anyInt(), assetDTO));
  }

  @Test
  @DisplayName("Test update asset return asset")
  void testUpdateAsset_InvalidId_returnAsset() {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
    Date installedDate = null;
    try {
      installedDate = sdf.parse("2021-10-25 00:00:00");
    } catch (ParseException e) {
      e.printStackTrace();
    }
    Location HCM = new Location();
    HCM.setId(3);
    HCM.setLocationName("HCM");
    Category category = new Category();
    category.setId(1);
    category.setCategoryName("Laptop");
    category.setCategoryPrefix("LA");
    AssetDTO expected =
        new AssetDTO(1, "LA00001", "Iphone", "Specs", new Date(), "Available", "HCM", "Laptop");
    Asset asset =
        new Asset(
            1,
            "LA000001",
            "Dell Inspiron 15 3511",
            "Per",
            installedDate,
            "Available",
            HCM,
            category);
    when(assetRepoMock.findById(1)).thenReturn(Optional.of(asset));
    when(assetRepoMock.save(any(Asset.class))).thenReturn(new Asset());
    AssetDTO assetDTO = underTest.updateAsset(1, expected);
    ArgumentCaptor<Asset> assetCaptor = ArgumentCaptor.forClass(Asset.class);
    verify(assetRepoMock, times(1)).save(assetCaptor.capture());
    Asset actualSaved = assetCaptor.getValue();
    assertEquals(expected.getAssetName(), actualSaved.getAssetName());
  }

  @Test
  @DisplayName("test get all list report return list of report")
  void testGetAssetReportReturnListReport() {
    Random r = new Random();
    HashMap<String,Object> stub = new HashMap<>();
    stub.put("categoryName","hello");
    stub.put("total",r.nextInt());
    stub.put("assigned",r.nextInt());
    stub.put("available",r.nextInt());
    stub.put("notAvailable",r.nextInt());
    stub.put("waitingForRecycling",r.nextInt());
    stub.put("recycled",r.nextInt());
    List<HashMap<String,Object>> hashMaps = new ArrayList<>();
    hashMaps.add(stub);

    when(assetRepoMock.getAssetReport()).thenReturn(hashMaps);
    List<AssetReportDTO> assetReportDTOS = underTest.getAssetReport();
    assertEquals(1,assetReportDTOS.size());
  }
  @Test
  @DisplayName("test get all list report return empty list ")
  void testGetAssetReportReturnListEmpty() {
    when(assetRepoMock.getAssetReport()).thenReturn(new ArrayList<>());
    List<AssetReportDTO> assetReportDTO = underTest.getAssetReport();
    assertTrue(assetReportDTO.isEmpty());
  }
}
