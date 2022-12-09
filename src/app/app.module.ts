import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PositionListComponent } from './position-list/position-list.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CrudOptionsComponent } from './crud-options/crud-options.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalCrudComponent } from './modal-crud/modal-crud.component';


@NgModule({
  declarations: [
    AppComponent,
    PositionListComponent,
    CrudOptionsComponent,
    ModalCrudComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false}
    ),
    FontAwesomeModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
