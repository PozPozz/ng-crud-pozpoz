import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { PositionListItem } from 'src/position-list-item';
import { PositionDataService } from '../position-data.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalCrudComponent } from '../modal-crud/modal-crud.component';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

import { faEye, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-crud-options',
  templateUrl: './crud-options.component.html',
  styleUrls: ['./crud-options.component.css']
})
export class CrudOptionsComponent implements OnInit {
  @Input() id!: number;
  @Output() dataChanged: EventEmitter<any> = new EventEmitter();

  /* FontAwesome Icons */
  faEye = faEye;
  faPencil = faPencil;
  faTrash = faTrash;
    

  constructor( private posDataService: PositionDataService, public modalService: NgbModal) {};

  ngOnInit(): void {

  };

  showDetails (id: number) {
    
    this.posDataService.getEmployeeById(id).subscribe(employee => {
      const modalRef = this.modalService.open(ModalCrudComponent);
      modalRef.componentInstance.employee = employee;
      modalRef.componentInstance.dataUpdated.subscribe((state: any) => {
        this.dataChanged.emit(state)
      })
    }) 
  };

  deleteItem(id: number) {

    const modalRef = this.modalService.open(ModalConfirmComponent);
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.confirmed.subscribe((state: any) => {
      this.posDataService.deleteEmployee(id).subscribe(() => {
        this.dataChanged.emit(state);
      })
    })

  }

}
