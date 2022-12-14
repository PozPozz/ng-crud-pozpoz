import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { PositionListItem } from 'src/position-list-item';


@Injectable({
  providedIn: 'root'
})
export class PositionDataService {
  private dataUrl  = 'api/EMPLOYEES'; //Syntax :base/:collectionName

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(private http: HttpClient) { };

  
  getEmployees(filterRegexp?: string): Observable<PositionListItem[]>{
    if(filterRegexp){
      const queryStringURL = `${this.dataUrl}/?${filterRegexp}`;

      return this.http.get<PositionListItem[]>(queryStringURL).pipe(
        tap(_ => console.log("Fetched Filtered Employees")),
        catchError(this.handleError<PositionListItem[]>('getEmployees (Filtered)', []))
      )
    }

    return this.http.get<PositionListItem[]>(this.dataUrl).pipe(
      tap(_ => console.log("Fetched Employees")),
      catchError(this.handleError<PositionListItem[]>('getEmployees', []))
      );
  }
    
  getEmployeeById(id: number): Observable<PositionListItem> {
    const url = `${this.dataUrl}/${id}`;
    
    return this.http.get<PositionListItem>(url).pipe(
      tap(_ => console.log(`Fetched Employee with id: ${id}`)),
      catchError(this.handleError<PositionListItem>(`getEmployee [Employee with id: ${id}]`))
      );
  }

  deleteEmployee(id: number): Observable<PositionListItem> {
    const url = `${this.dataUrl}/${id}`;

    return this.http.delete<PositionListItem>(url).pipe(
      tap(_ => console.log(`Deleted Employee with id: ${id}`)),
      catchError(this.handleError<PositionListItem>(`deleteEmployee [Employee with id: ${id}]`))
    );
  }

  updateEmployee(employee: PositionListItem): Observable<PositionListItem> {
    return this.http.put<PositionListItem>(this.dataUrl, employee, this.httpOptions).pipe(
      tap(_ => console.log(`Modified Employee with id: ${employee.id}`, employee)),
      catchError(this.handleError<PositionListItem>(`updateEmployee [Employee with id ${employee.id}]`))
    );
  };

  addEmployee(employee: PositionListItem): Observable<PositionListItem> {
    return this.http.post<PositionListItem>(this.dataUrl, employee, this.httpOptions).pipe(
      tap(_ => console.log(`Added Employee with id: ${employee.id}`, employee)),
      catchError(this.handleError<PositionListItem>(`addEmployee [Employee`))
    );
  }

  searchEmployeeByName(term: string): Observable<PositionListItem[]> {
    if (!term.trim()) return this.http.get<PositionListItem[]>(this.dataUrl).pipe(
      tap(_ => console.log("Fetched Employees")),
      catchError(this.handleError<PositionListItem[]>('getEmployees', []))
      );

    return this.http.get<PositionListItem[]>(`${this.dataUrl}/?name=${term}`).pipe(
      tap(x => x.length ? console.log(`Found employee matching ${term}`) : console.log('No employees matching') ),
      catchError(this.handleError<PositionListItem[]>(`searchEmployee`, []))
    );
  }

  searchEmployeeBySurname(term: string): Observable<PositionListItem[]> {
    return this.http.get<PositionListItem[]>(`${this.dataUrl}/?surname=${term}`).pipe(
      tap(x => x.length ? console.log(`Found employee matching ${term}`) : console.log('No employees matching') ),
      catchError(this.handleError<PositionListItem[]>(`searchEmployee`, []))
    );
  }
      
  private handleError<T>(operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);

      console.log(`${operation} failed: ${error.message}`);;
      return of(result as T);
    };
  }
  
}
