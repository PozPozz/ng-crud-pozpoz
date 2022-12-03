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

  
  getEmployees(): Observable<PositionListItem[]>{
    return this.http.get<PositionListItem[]>(this.dataUrl).pipe(
      tap(_ => console.log("Fetched Employees")),
      catchError(this.handleError<PositionListItem[]>('getEmployees', []))
      );
    }
    
    getEmployeeById(id: number): Observable<PositionListItem> {
      const url = `${this.dataUrl}/${id}`;
      
      return this.http.get<PositionListItem>(url).pipe(
        tap(_ => console.log(`Fetched Employee with id: ${id}`)),
        catchError(this.handleError<PositionListItem>('getEmployee [Employee with id: ${id}]'))
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
