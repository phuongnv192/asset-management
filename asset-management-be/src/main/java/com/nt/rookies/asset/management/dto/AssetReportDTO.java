package com.nt.rookies.asset.management.dto;

import lombok.Data;

@Data
public class AssetReportDTO {
  private String categoryName;
  private Integer total;
  private Integer assigned;
  private Integer available;
  private Integer notAvailable;
  private Integer waitingForRecycling;
  private Integer recycled;
}
