import { Component, EventEmitter } from '@angular/core';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.css']
})
export class ModalConfirmComponent {

  id!: number;

  public confirmed: EventEmitter<boolean> = new EventEmitter();

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal){ };

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        console.log(`Closed with ${result}`);
      },
      (reason) => {
        console.log(`Dismissed `)
      }
    )
  }

  confirmSelection(){
    console.log("Deleted position from modal");
    this.activeModal.dismiss('Deleted Item');
    this.confirmed.emit(true);
  }

}
