import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css'],
})
export class StatusComponent implements OnInit {
  @Output() backToOrderList = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit(): void {}
  backToOrder() {
    console.log('click');

    this.backToOrderList.emit(false);
  }
}
