import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../common/app.constants';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getPublicContent(): Observable<any> {
    return this.http.get(AppConstants.API_URL + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(AppConstants.API_URL + 'user', { responseType: 'text' });
  }

  getModeratorBoard(): Observable<any> {
    return this.http.get(AppConstants.API_URL + 'mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(AppConstants.API_URL + 'admin', { responseType: 'text' });
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(AppConstants.API_URL + 'user/me', httpOptions);
  }

  // filter APi

  getProdutByFilter(data:any) {
    return this.http.post(AppConstants.API_URL + 'public/detail/page-filter',data);
  }

  // add to card and wishlis
  AddtoCartandWishlist(data:any) {
    return this.http.post(
      AppConstants.API_URL + 'public/op/customer_product',
      data
    );
  }

  // remove order from order and wishlist

  removeOrder(data:any) {
    return this.http.delete(
      AppConstants.API_URL + `public/delete/customer_product?id=${data.id}&userId=${data.userId}`
    );
  }

  // get order id

  getOrderid(amount:any) {
    return this.http.post(
      AppConstants.API_URL + 'order-panel/add/payment',
      amount
    );
  }

  // save address {}

  updateAndSaveAddress(data) {
    return this.http.post(AppConstants.API_URL + 'op/address',data).toPromise();
  }

  // save order
  saveOrder(data) {
    return this.http.post(AppConstants.API_URL + 'order-panel/op/payment',data);
  }

  feachAddress(data: any) {
    return this.http.get(AppConstants.API_URL + `list/address/${data}`);
  }
}
