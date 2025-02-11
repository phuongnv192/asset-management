package com.nt.rookies.asset.management.entity;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
@Entity
@Table(name = "assignment")
public class Assignment {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "id", nullable = false)
  private Integer id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "asset_id", nullable = false)
  private Asset asset;

  @ManyToOne(optional = false)
  @JoinColumn(name = "assign_by", nullable = false)
  private User assignBy;

  @ManyToOne(optional = false)
  @JoinColumn(name = "assign_to", nullable = false)
  private User assignTo;

  @ManyToOne
  @JoinColumn(name = "request_by")
  private User requestBy;

  @ManyToOne
  @JoinColumn(name = "accepted_by")
  private User acceptedBy;

  @Column(name = "assigned_date", nullable = false)
  private Date assignedDate;

  @Column(name = "returned_date")
  private Date returnedDate;

  @Column(name = "note", length = 300)
  private String note;

  @Column(name = "state", length = 30, nullable = false)
  private String state;
}
