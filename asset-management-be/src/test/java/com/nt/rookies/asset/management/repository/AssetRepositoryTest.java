package com.nt.rookies.asset.management.repository;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.nt.rookies.asset.management.entity.Asset;
import com.nt.rookies.asset.management.entity.Category;
import com.nt.rookies.asset.management.entity.Location;
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
class AssetRepositoryTest {

  @Autowired private AssetRepository underTest;

  @Test
  @DisplayName("Test get all asset in the same location return all asset in the same location")
  void testFindAllByLocationReturnAllInTheSameLocation() {
    Location hanoi = new Location();
    hanoi.setId(1);
    hanoi.setLocationName("Ha Noi");

    List<Asset> assets = underTest.findAllByLocation(hanoi);

    assets.forEach(
        asset -> assertEquals(hanoi.getLocationName(), asset.getLocation().getLocationName()));
  }

  @Test
  @DisplayName("Test get all asset in the same location return empty list")
  void testFindAllByLocationReturnEmptyList() {
    Location hue = new Location();
    hue.setId(4);
    hue.setLocationName("Hue");
    List<Asset> assets = underTest.findAllByLocation(hue);
    assertTrue(assets.isEmpty());
  }

  @Test
  @DisplayName("Test get asset by asset code return asset ")
  void testFindAssetByAssetCodeReturnTheSameAsset() {
    Location HCM = new Location();
    HCM.setId(3);
    HCM.setLocationName("HCM");
    Category category = new Category();
    category.setId(1);
    category.setCategoryName("Laptop");
    category.setCategoryPrefix("LA");
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
    Date installedDate = null;
    try {
      installedDate = sdf.parse("2021-10-25 00:00:00");
    } catch (ParseException e) {
      e.printStackTrace();
    }
    Asset assetTest = new Asset();
    assetTest.setAssetCode("LA000001");
    assetTest.setAssetName("Dell Inspiron 15 3511");
    assetTest.setState("Available");
    assetTest.setSpecification("Persistent heuristic paradigm");
    assetTest.setId(1);
    assetTest.setInstalledDate(installedDate);
    assetTest.setLocation(HCM);
    assetTest.setCategory(category);
    assertFalse(underTest.findAssetByAssetCode("LA000001").isEmpty());
    Asset asset = underTest.findAssetByAssetCode("LA000001").get();

    assertAll(
        () -> assertEquals(asset.getId(), assetTest.getId()),
        () -> assertEquals(asset.getAssetCode(), assetTest.getAssetCode()),
        () -> assertEquals(asset.getAssetName(), assetTest.getAssetName()),
        () -> assertEquals(asset.getState(), assetTest.getState()),
        () -> assertEquals(asset.getSpecification(), assetTest.getSpecification()),
        () ->
            assertEquals(
                sdf.format(asset.getInstalledDate()), sdf.format(assetTest.getInstalledDate())),
        () -> assertEquals(asset.getCategory(), assetTest.getCategory()),
        () -> assertEquals(asset.getLocation(), assetTest.getLocation()));
  }

  @Test
  @DisplayName("Test get asset by asset code return empty asset")
  void testFindAssetByAssetCodeReturnEmpty() {
    Optional<Asset> assets = underTest.findAssetByAssetCode("123123");
    assertTrue(assets.isEmpty());
  }

}
