import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  showStatusFlag = false;
  constructor( ) {}

  ngOnInit(): void {}
  showSatus() {
    this.showStatusFlag = true
  }
}
