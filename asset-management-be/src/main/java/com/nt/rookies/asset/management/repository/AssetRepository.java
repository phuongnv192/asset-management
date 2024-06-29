package com.nt.rookies.asset.management.repository;

import com.nt.rookies.asset.management.entity.Asset;
import com.nt.rookies.asset.management.entity.Location;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Integer> {

  /**
   * Get asset by location
   *
   * @return {@link List<Asset>}
   */
  List<Asset> findAllByLocation(Location location);

  /**
   * Delete asset by id
   *
   * @param id the id of an asset, Integer value
   */
  void deleteById(Integer id);

  Optional<Asset> findAssetByAssetCode(String assetCode);

  /**
   * Get asset report by category and state.
   *
   * @return list of report store as map
   */
  @Query(
      value =
          "select new map(a.category.categoryName as categoryName"
              + ", count (a.category.id) as total"
              + ", sum(case when a.state = 'Assigned' then 1 else 0 end) as assigned"
              + ", sum(case when a.state = 'Available' then 1 else 0 end) as available"
              + ", sum(case when a.state = 'Not available' then 1 else 0 end) as notAvailable"
              + ", sum(case when a.state = 'Waiting for recycling' then 1 else 0 end) as waitingForRecycling"
              + ", sum(case when a.state = 'Recycled' then 1 else 0 end) as recycled) "
              + "from Asset a "
              + "group by a.category.id")
  List<HashMap<String, Object>> getAssetReport();
}
