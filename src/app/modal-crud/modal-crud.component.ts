import { Component, OnInit } from '@angular/core';

import { PositionListItem } from 'src/position-list-item';
import { ModalDismissReasons, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PositionDataService } from '../position-data.service';

import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-crud',
  templateUrl: './modal-crud.component.html',
  styleUrls: ['./modal-crud.component.css']
})
export class ModalCrudComponent implements OnInit{
  employee!: PositionListItem;
  isModifying: boolean = false;

  detailsForm!: FormGroup;

  faPencil = faPencil;

  constructor (private modalService: NgbModal, public activeModal: NgbActiveModal, private posDataService: PositionDataService) { };

  ngOnInit(): void {
    this.detailsForm = new FormGroup({
      nome: new FormControl({value: this.employee?.name, disabled: true}, Validators.required),
      cognome: new FormControl({value: this.employee?.surname, disabled: true}, Validators.required),
      positionCovered: new FormControl({value: this.employee?.positionCovered, disabled: true}, Validators.required),
      busyOnTask: new FormControl({value: this.employee?.busyOnTask, disabled: true}, Validators.required)
    });
  }

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

  onSubmit() {
    let updatedPosition: PositionListItem;
    updatedPosition = this.detailsForm.value; 

    this.posDataService.updateEmployee(updatedPosition).subscribe(() => {
      console.log("Updated position from modal");
    })
  }

  toggleModify(){
    this.isModifying = !this.isModifying;

    if(this.isModifying){
      this.detailsForm.enable();
    } else {
      this.detailsForm.disable();
    }
  }
}
