import { Component, EventEmitter, OnInit } from '@angular/core';

import { PositionListItem } from 'src/position-list-item';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { PositionDataService } from '../position-data.service';
import { OperatorFunction, Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';

import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-add',
  templateUrl: './modal-add.component.html',
  styleUrls: ['./modal-add.component.css']
})
export class ModalAddComponent implements OnInit {
  newPositionForm!: FormGroup;
  public nameModel: any;
  public surnameModel: any;
  public positionModel: any;


  public positionAdded: EventEmitter<boolean> = new EventEmitter();
  autocompletes: string[][];

  constructor (private modalService: NgbModal, public activeModal: NgbActiveModal, private posDataService: PositionDataService) { this.autocompletes = []; };

  ngOnInit(): void {
     this.posDataService.getEmployees().subscribe(employees => {
       this.autocompletes[0] = [];
       this.autocompletes[1] = [];
       this.autocompletes[2] = [];

      employees.forEach(elem => {

        this.autocompletes[0].findIndex(x => x == elem.name) === -1 ? this.autocompletes[0].push(elem.name) : null ;
        this.autocompletes[1].findIndex(x => x == elem.surname) === -1 ? this.autocompletes[1].push(elem.surname) : null ;
        this.autocompletes[2].findIndex(x => x == elem.positionCovered) === -1 ? this.autocompletes[2].push(elem.positionCovered) : null ;
      });
     })

    this.newPositionForm = new FormGroup({
      nome: new FormControl('', Validators.required),
      cognome: new FormControl('', Validators.required),
      positionCovered: new FormControl('', Validators.required),
      busyOnTask: new FormControl('')
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

  nameAutocomplete: OperatorFunction<string, readonly string[]> = (text$ : Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map((term) => term.length < 2 ? [] : this.autocompletes[0].filter((val) => val.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)),
  );

  surnameAutocomplete: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map((term) => term.length < 2 ? [] : this.autocompletes[1].filter((val) => val.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)),
  );

  positionCoveredAutocomplete: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map((term) => term.length < 2 ? [] : this.autocompletes[2].filter((val) => val.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)),
  )

  onSubmit() {
    let newPosition = {
      name: this.newPositionForm.value.nome,
      surname: this.newPositionForm.value.cognome,
      positionCovered: this.newPositionForm.value.positionCovered,
      busyOnTask: this.newPositionForm.value.busyOnTask === "" ? false : this.newPositionForm.value.busyOnTask,
    }

    console.log(newPosition);

    this.posDataService.addEmployee(newPosition as PositionListItem).subscribe(employee => {
      console.log(`Added wmployee with id: ${employee.id}`);
      this.activeModal.dismiss('Added Employee');
      this.positionAdded.emit(true);
    });
  }

}
