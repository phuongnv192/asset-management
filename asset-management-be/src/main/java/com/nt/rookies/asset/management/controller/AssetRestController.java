package com.nt.rookies.asset.management.controller;

import com.nt.rookies.asset.management.dto.AssetDTO;
import com.nt.rookies.asset.management.dto.AssetReportDTO;
import com.nt.rookies.asset.management.exception.ResourceDeleteException;
import com.nt.rookies.asset.management.service.AssetService;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/** REST controller for asset. */
@RestController
@RequestMapping("/api/v1.0/assets")
public class AssetRestController {
  public static final Logger log = LoggerFactory.getLogger(AssetRestController.class);
  public final AssetService assetService;

  @Autowired
  public AssetRestController(AssetService assetService) {
    this.assetService = assetService;
  }

  /**
   * API Get all asset same location with admin.<br>
   * Link: <code>/api/v1.0/assets</code> <br>
   * Method: GET
   *
   * @return {@link List<AssetDTO>}
   */
  @GetMapping()
  @ApiOperation("Get all assets follow location of admin")
  public List<AssetDTO> getAllAssets() {
    return assetService.findAllByLocation();
  }

  /**
   * API Check asset is valid to delete by id.<br>
   * Link: <code>/api/v1.0/assets/{id}/valid</code> <br>
   * Method: GET
   *
   * @param id asset id
   * @return {@link Boolean}
   */
  @GetMapping("/{id}/valid")
  @ApiOperation(value = "Check an asset id is valid to delete", response = Boolean.class)
  public boolean isValidToDelete(@PathVariable(name = "id") Integer id) {
    log.info("Check an asset id {} is valid to delete", id);
    return assetService.isValidToDelete(id);
  }

  /**
   * API Delete asset by id.<br>
   * Link: <code>/api/v1.0/assets/{id}</code> <br>
   * Method: DELETE
   *
   * @param id asset id
   * @return {@link ResponseEntity}
   */
  @DeleteMapping("/{id}")
  @ApiOperation(value = "Delete asset by id", response = String.class)
  public ResponseEntity<?> deleteAsset(@PathVariable(name = "id") Integer id) {
    if (isValidToDelete(id)) {
      assetService.deleteAsset(id);
      log.info("Delete post with id {}", id);
      return ResponseEntity.ok("Post deleted");
    } else {
      throw new ResourceDeleteException("Cannot delete this asset");
    }
  }

  /**
   * API Get asset by id.<br>
   * Link: <code>/api/v1.0/assets/{id}</code> <br>
   * Method: GET
   *
   * @param id asset id
   * @return {@link AssetDTO} found by id
   */
  @GetMapping("/{id}")
  public AssetDTO getAssetById(@PathVariable(name = "id") Integer id) {
    return assetService.getAssetById(id);
  }

  /**
   * API Create new asset.<br>
   * Link: <code>/api/v1.0/assets</code> <br>
   * Method: POST
   *
   * @param assetDTO new asset
   * @return created {@link AssetDTO} object
   */
  @PostMapping()
  public AssetDTO createAsset(@RequestBody @Valid AssetDTO assetDTO) {
    return assetService.createAsset(assetDTO);
  }

  /**
   * API Update an asset.<br>
   * Link: <code>/api/v1.0/assets/{id}</code> <br>
   * Method: PUT
   *
   * @param assetDTO edit asset
   * @return edited {@link AssetDTO} object
   */
  @PutMapping("/{id}")
  public AssetDTO updateAsset(
      @PathVariable(name = "id") Integer id, @RequestBody @Valid AssetDTO assetDTO) {
    return assetService.updateAsset(id, assetDTO);
  }

  /**
   * API Get asset report by category and state.<br>
   * Link: <code>/api/v1.0/assets/report</code> <br>
   * Method: GET
   *
   * @return {@link List} of {@link AssetReportDTO}
   */
  @GetMapping("/report")
  public List<AssetReportDTO> getAssetReport() {
    return assetService.getAssetReport();
  }
}
