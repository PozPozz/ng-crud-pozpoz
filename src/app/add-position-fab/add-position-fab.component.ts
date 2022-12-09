import { Component, EventEmitter, Output } from '@angular/core';
import { ModalAddComponent } from '../modal-add/modal-add.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { faAdd } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add-position-fab',
  templateUrl: './add-position-fab.component.html',
  styleUrls: ['./add-position-fab.component.css']
})
export class AddPositionFabComponent {

  @Output() positionAdded = new EventEmitter();

  faAdd = faAdd;

  constructor( public modalService: NgbModal) {};

  addPosition(){
    const modalRef = this.modalService.open(ModalAddComponent);
    modalRef.componentInstance.positionAdded.subscribe(() => {
      this.positionAdded.emit(null);
    })
  }
}
