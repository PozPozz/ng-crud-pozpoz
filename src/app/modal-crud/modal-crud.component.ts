import { Component } from '@angular/core';

import { PositionListItem } from 'src/position-list-item';
import { ModalDismissReasons, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { faPencil } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-modal-crud',
  templateUrl: './modal-crud.component.html',
  styleUrls: ['./modal-crud.component.css']
})
export class ModalCrudComponent {
  employee!: PositionListItem;
  isModifying: boolean = false;

  faPencil = faPencil;

  constructor (private modalService: NgbModal, public activeModal: NgbActiveModal) { };

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        console.log(`Closed with ${result}`);
      },
      (reason) => {
        console.log(`Dismissed ${this.getDismissReason(reason)}`)
      }
    )
  }

  private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}

  toggleModify(){
    this.isModifying = !this.isModifying;
  }
}
