import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error-popup',
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.scss']
})
export class ErrorPopupComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) {}
  @Input() title;
  @Input() content;

  ngOnInit(): void {
    this.title =this.title;
    this.content =this.content;
  }

}
