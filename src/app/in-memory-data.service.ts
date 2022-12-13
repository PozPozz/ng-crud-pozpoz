import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { getStatusText, InMemoryDbService, RequestInfo, ResponseOptions, STATUS } from 'angular-in-memory-web-api';
import { PositionListItem } from 'src/position-list-item';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  createDb() {
    const EMPLOYEES = [
      { id: 1, name: 'Giovanni', surname: 'Lo Presti', positionCovered: 'Front-End Developer', busyOnTask: false },
      { id: 2, name: 'Marco', surname: 'Saraniti', positionCovered: 'Back-End Developer', busyOnTask: true },
      { id: 3, name: 'Sara', surname: 'Nicosia', positionCovered: 'Wordpress Developer', busyOnTask: false },
      { id: 4, name: 'Giulia', surname: 'Di Sefano', positionCovered: 'UI/UX Designer', busyOnTask: true },
      { id: 5, name: 'Giacomo', surname: 'Locura', positionCovered: 'Front-End Developer', busyOnTask: true },
      { id: 6, name: 'Alberto', surname: 'Fortuna', positionCovered: 'Data Analyst', busyOnTask: true },
      { id: 7, name: 'Giuseppe', surname: 'Reitano', positionCovered: 'HR', busyOnTask: false },
      { id: 8, name: 'Francesco', surname: 'Veridio', positionCovered: 'Senior Full-Stack', busyOnTask: true },
      { id: 9, name: 'Pierluigi', surname: 'Aiello', positionCovered: 'Project Manager', busyOnTask: true },
      { id: 10, name: 'Federica', surname: 'Bongiovi', positionCovered: 'Social Media Manager', busyOnTask: true},
      { id: 11, name: 'Paolo', surname: 'Di Bella', positionCovered: 'Photographer', busyOnTask: false },
      { id: 12, name: 'Luigi', surname: 'Nettio', positionCovered: 'Project Manager', busyOnTask: true },
      { id: 13, name: 'Luca', surname: 'Piscopo', positionCovered: 'UI/UX Designer', busyOnTask: false },
      { id: 14, name: 'Michele', surname: 'Ventimiglia', positionCovered: 'Full-Stack Developer', busyOnTask: true },
      { id: 15, name: 'Veronica', surname: 'Fieriti', positionCovered: 'Team Leader', busyOnTask: true },
      { id: 16, name: 'Samuele', surname: 'Pozzini', positionCovered: 'Full-Stack Developer', busyOnTask: true },
      { id: 17, name: 'Andrea', surname: 'Monaco', positionCovered: 'UI Designer', busyOnTask: false },
      { id: 18, name: 'Mattia', surname: 'Falzone', positionCovered: 'UI/UX Designer', busyOnTask: true },
      { id: 19, name: 'Gioele', surname: 'Pistorio', positionCovered: 'HR', busyOnTask: false },
      { id: 20, name: 'Matteo', surname: 'Pirrone', positionCovered: 'Back-End Developer', busyOnTask: true },
      { id: 21, name: 'Domenico', surname: 'Vinciguerra', positionCovered: 'Project Manager', busyOnTask: true },
      { id: 22, name: 'Roberto', surname: 'Benanti', positionCovered: 'Back-End Developer', busyOnTask: false },
      { id: 23, name: 'Gabriele', surname: 'Di Stefano', positionCovered: 'HR', busyOnTask: true},
      { id: 24, name: 'Bernadette', surname: 'Hart', positionCovered: 'Wordpress Developer', busyOnTask: false },
      { id: 25, name: 'Lorenzo', surname: 'Vitale', positionCovered: 'Data Analyst', busyOnTask: false }
  ];

  return{ EMPLOYEES };
  }

  genId(employees: PositionListItem[]){
    return employees.length > 0 ? Math.max(...employees.map(employe => employe.id)) + 1: 1;
  }

  get(reqInfo: RequestInfo) {
    if(reqInfo.query.has('sort_by') && reqInfo.query.has('sort_order') && reqInfo.collection){
      const sortBy = reqInfo.query.get('sort_by')![0];
      const sortOrder = reqInfo.query.get('sort_order')![0].toUpperCase();

      reqInfo.query.delete('sort_by');
      reqInfo.query.delete('sort_order');

      return reqInfo.utils.createResponse$(() => {
        const collection = reqInfo.collection as Array<{id: any}>;

        let data: any;
        if(reqInfo.id) {
          data = reqInfo.utils.findById(collection, reqInfo.id);
        } else {
          const filteredCollection = InMemoryDataService.applyQuery(collection, reqInfo.query);

          if(sortOrder === "DESC"){
          data = filteredCollection.sort((a, b) => {
            return a[sortBy] < b[sortBy] ? 1 : -1;
          });
          } else if (sortOrder === "ASC"){
            data = filteredCollection.sort((a, b) => {
              return a[sortBy] > b[sortBy] ? 1 : -1;
            });
          } else {
            data = filteredCollection;
          }
        }

        const options: ResponseOptions = data ? 
        {
          body: data,
          status: STATUS.OK 
        } :
        {
          body: { error: `'${reqInfo.collectionName}' with id='${reqInfo.id}' not found` },
          status: STATUS.NOT_FOUND
        };

        return InMemoryDataService.finishOptions(options, reqInfo);
      });
    } else {
      return undefined;
    }
  }

  private static finishOptions(options: ResponseOptions, {headers, url}: RequestInfo) {
    options.statusText = getStatusText(options.status!);
    options.headers = headers;
    options.url = url;

    return options;
  }

  private static applyQuery(collection: any[], query: Map<string, string[]>): any[] {
    const conditions: any = [];
    query.forEach((values, key) => {
        values.forEach(value => { 
          conditions.push({ key, rx: new RegExp(decodeURI(value), 'i') }); 
        });
    });

    const len: number = conditions.length;
    if (!len) {
      return collection;
    }

    return collection.filter(row => {
      let ok = true;
      let i = len;
      while(ok && i){
        i -= 1;
        const cond = conditions[i];
        ok = cond.rx.test(row[cond.name]);
      }
      return ok;
    });
  };
}
