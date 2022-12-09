import { Component, EventEmitter, OnInit } from '@angular/core';

import { PositionListItem } from 'src/position-list-item';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PositionDataService } from '../position-data.service';

import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-add',
  templateUrl: './modal-add.component.html',
  styleUrls: ['./modal-add.component.css']
})
export class ModalAddComponent implements OnInit {
  newPositionForm!: FormGroup;

  public positionAdded: EventEmitter<boolean> = new EventEmitter();

  constructor (private modalService: NgbModal, public activeModal: NgbActiveModal, private posDataService: PositionDataService) { };

  ngOnInit(): void {
    this.newPositionForm = new FormGroup({
      nome: new FormControl('', Validators.required),
      cognome: new FormControl('', Validators.required),
      positionCovered: new FormControl('', Validators.required),
      busyOnTask: new FormControl('', Validators.required)
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
    let newPosition = {
      name: this.newPositionForm.value.nome,
      surname: this.newPositionForm.value.cognome,
      positionCovered: this.newPositionForm.value.positionCovered,
      busyOnTask: this.newPositionForm.value.busyOnTask,
    }

    this.posDataService.addEmployee(newPosition as PositionListItem).subscribe(employee => {
      console.log(`Added wmployee with id: ${employee.id}`);
      this.activeModal.dismiss('Added Employee');
      this.positionAdded.emit(true);
    });
  }

}
