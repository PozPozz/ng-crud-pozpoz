import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap, Observable, ObservableInput, Subject } from 'rxjs';

import { PositionListItem } from '../../position-list-item';
import { PositionDataService } from '../position-data.service';

import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-position-list',
  templateUrl: './position-list.component.html',
  styleUrls: ['./position-list.component.css']
})
export class PositionListComponent implements OnInit {

  private searchTerms = new Subject<string>(); 
  employeesTable: PositionListItem[] = [];
  employeesTable$!: Observable<PositionListItem[]>;
  dataKeys: string[] = [];
  sortKeyId!: string;
  firstSort = true;

  faArrrowUp = faArrowUp;
  faArrowDown = faArrowDown;

  constructor(private posDataService: PositionDataService) { };

  getData(sortOptions?: string): void {
    this.posDataService.getEmployees(sortOptions).subscribe(employees => {this.employeesTable = employees; this.dataKeys = Object.keys(this.employeesTable[0])});
  };


//Modify: add parameter for optional filter RegExp that was already added
  setSortParameters(key: string): void {
    let order: string;
    this.firstSort == true ? order = "asc" : order = "desc";
    let sortString = `sort_by=${key}&sort_order=${order}`;
    this.getData(sortString);

    document?.querySelectorAll('th fa-icon')?.forEach(elem => {
      if (elem.parentElement!.id == `th__${key}`){
        this.sortKeyId = key;
      }
    })

    this.firstSort = !this.firstSort;
  }

  search(term: string): void {
    this.searchTerms.next(term);

    this.employeesTable$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.posDataService.searchEmployeeByName(term))
    )

    this.employeesTable$.subscribe(employees => {
      if(employees.length == 0){
        this.employeesTable$ = this.searchTerms.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((term: string) => this.posDataService.searchEmployeeBySurname(term))
        )

        this.employeesTable$.subscribe(employees => this.employeesTable = employees)
      } else {
        this.employeesTable = employees;
      }
    });
    }
  
  ngOnInit(): void {
    this.sortKeyId = 'id';
    this.setSortParameters("id");

  }
}
