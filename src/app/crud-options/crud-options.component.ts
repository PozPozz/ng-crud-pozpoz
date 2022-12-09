import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
  @Output() dataChanged: EventEmitter<any> = new EventEmitter();

  /* FontAwesome Icons */
  faEye = faEye;
  faPencil = faPencil;
  faTrash = faTrash;
    

  constructor( private posDataService: PositionDataService, public modalService: NgbModal) {};

  ngOnInit(): void {

  };

  private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}

  showDetails (id: number) {
    
    this.posDataService.getEmployeeById(id).subscribe(employee => {
      const modalRef = this.modalService.open(ModalCrudComponent);
      modalRef.componentInstance.employee = employee;
      
    }) 
  };

  deleteItem(id: number) {
    this.posDataService.deleteEmployee(id).subscribe(() => {
      this.dataChanged.emit(null);
    })
  }

}
