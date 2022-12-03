import { Component, OnInit } from '@angular/core';

import { PositionListItem } from '../../position-list-item';
import { PositionDataService } from '../position-data.service';

import { faEye, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-position-list',
  templateUrl: './position-list.component.html',
  styleUrls: ['./position-list.component.css']
})
export class PositionListComponent implements OnInit {

  employeesTable: PositionListItem[] = [];
  dataKeys: string[] = [];

  /* FontAwesome Icons */
  faEye = faEye;
  faPencil = faPencil;
  faTrash = faTrash;
  
  constructor(private posDataService: PositionDataService) { };

  getData(): void {
    this.posDataService.getEmployees().subscribe(employees => {this.employeesTable = employees; this.dataKeys = Object.keys(this.employeesTable[0])});
  };
  
  ngOnInit(): void {
    this.getData();
    

  }
}
