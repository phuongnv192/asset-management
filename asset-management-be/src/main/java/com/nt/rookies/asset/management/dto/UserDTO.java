package com.nt.rookies.asset.management.dto;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
  private Integer id;
  private String staffCode;
  private String firstName;
  private String lastName;
  private String username;
  private Date joinedDate;
  private String gender;
  private Date birthDate;
  private String type;
  private int status;
  private String location;
}
