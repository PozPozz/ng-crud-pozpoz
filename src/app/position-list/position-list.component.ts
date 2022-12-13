import { Component, OnInit } from '@angular/core';

import { PositionListItem } from '../../position-list-item';
import { PositionDataService } from '../position-data.service';


@Component({
  selector: 'app-position-list',
  templateUrl: './position-list.component.html',
  styleUrls: ['./position-list.component.css']
})
export class PositionListComponent implements OnInit {

  employeesTable: PositionListItem[] = [];
  dataKeys: string[] = [];
  firstSort = true;

  constructor(private posDataService: PositionDataService) { };

  getData(sortOptions?: string): void {
    this.posDataService.getEmployees(sortOptions).subscribe(employees => {this.employeesTable = employees; this.dataKeys = Object.keys(this.employeesTable[0])});
  };

  setSortParameters(key: string): void {
    let order: string;
    this.firstSort == true ? order = "asc" : order = "desc";
    let sortString = `sort_by=${key}&sort_order=${order}`;
    this.getData(sortString);
    this.firstSort = !this.firstSort;
  }
  
  ngOnInit(): void {
    this.setSortParameters("id");
  }
}
