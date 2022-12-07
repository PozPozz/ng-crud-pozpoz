import { Component, OnInit, Input } from '@angular/core';

import { PositionListItem } from 'src/position-list-item';
import { PositionDataService } from '../position-data.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalCrudComponent } from '../modal-crud/modal-crud.component';

import { faEye, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-crud-options',
  templateUrl: './crud-options.component.html',
  styleUrls: ['./crud-options.component.css']
})
export class CrudOptionsComponent implements OnInit {
  @Input() id!: number;

  /* FontAwesome Icons */
  faEye = faEye;
  faPencil = faPencil;
  faTrash = faTrash;
    

  constructor( private posDataService: PositionDataService, public modalService: NgbModal) {};

  ngOnInit(): void {

  };

  showDetails (id: number) {
    
    this.posDataService.getEmployeeById(id).subscribe(employee => {
      console.log(employee);
      const modalRef = this.modalService.open(ModalCrudComponent);
      modalRef.componentInstance.employee = employee;
      
    }) 
  };

  editDetails(id: number) {

  }

  deleteItem(id: number) {

  }

}
