import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap, Observable, ObservableInput, Subject, BehaviorSubject } from 'rxjs';

import { PositionListItem } from '../../position-list-item';
import { PositionDataService } from '../position-data.service';

import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-position-list',
  templateUrl: './position-list.component.html',
  styleUrls: ['./position-list.component.css']
})
export class PositionListComponent implements OnInit {

  private searchTerms = new BehaviorSubject<string>(''); 
  employeesTable: PositionListItem[] = [];
  employeesTable$!: Observable<PositionListItem[]>;
  dataKeys: string[] = [];
  sortKeyId!: string;
  firstSort = true;
  optionalRegexp: string = '';
  lastQuery: string = '';

  faArrrowUp = faArrowUp;
  faArrowDown = faArrowDown;

  constructor(private posDataService: PositionDataService) { };

  getData(sortOptions?: string): void {
    this.posDataService.getEmployees(sortOptions).subscribe(employees => {
      this.employeesTable = employees; 
      this.dataKeys = [];
      Object.keys(this.employeesTable[0]).forEach(key => {
        if (key != 'id') this.dataKeys.push(key);
      })

      
      console.log('EMployees table',employees)
      console.log(this.lastQuery);
    });
  };


//Modify: add parameter for optional filter RegExp that was already added
  setSortParameters(key: string, defOrder?: string): void {
    let order: string;
    if(defOrder){
      order = defOrder;
      defOrder == 'asc' ? this.firstSort = true : this.firstSort = false;
    } else {
      this.firstSort == true ? order = "asc" : order = "desc";
    }
    let sortString: string = '';

    if(this.optionalRegexp?.trim().length! > 0){
      sortString = `sort_by=${key}&sort_order=${order}&${this.optionalRegexp}`;
      this.lastQuery = sortString;
    } else {
      sortString = `sort_by=${key}&sort_order=${order}`;
      this.lastQuery = sortString;
    }

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
      if(employees.length < 1){
        this.employeesTable$ = this.searchTerms.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((term: string) => this.posDataService.searchEmployeeBySurname(term))
        )

        this.employeesTable$.subscribe(employees => {
          this.employeesTable = employees;
          this.searchTerms.subscribe(val => this.optionalRegexp = `surname=${val}`)
          

          console.log("Termine Search: (bySurname)", term);
          console.log("OptionalRegexp: (bySurname)", this.optionalRegexp);
          })
      } else {
        this.employeesTable = employees;
        this.searchTerms.subscribe(val => this.optionalRegexp = `name=${val}`)
        // this.optionalRegexp = `name=${term}`;
        console.log("Termine Search: (byName)", term);
        console.log("OptionalRegexp: (byName)", this.optionalRegexp);

      }
    });

    }
  
  ngOnInit(): void {
    this.sortKeyId = 'id';
    this.setSortParameters("id");

  }
}
