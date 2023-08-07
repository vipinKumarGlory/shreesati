import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../common/app.constants';

@Injectable({
  providedIn: 'root'
})
export class PublicService {
  constructor(private http: HttpClient) { }
  
  getPageList(dataFor: string): Observable<any> {
    var data: any = {
      "dataFor": dataFor 
    }
    return this.http.post(AppConstants.API_URL + 'public/list/page', data);
  }
 
  getWidgetList(): Observable<any> {
    var data: any = {
      "dataFor": "PAGE",
      "dataId": 0
    }
    return this.http.post(AppConstants.API_URL + 'public/list/widget', data);
  }
  addPrdToCustomer(viewType,productId,customerId,orderId,orderQty,isActive){
    var data: any = {
      "id": 0,
      "productId": productId,
      "orderId": orderId,
      "viewType": viewType,
      "customerId": customerId,
      "orderQty":orderQty,
      "isActive":isActive
    }
    return this.http.post(AppConstants.API_URL + 'public/op/customer_product', data);
  }
  getCurrentUserProduct(userId): Observable<any> {
    var data: any = {
      "data1For": "ALL",
      "dataId": userId
    }
    return this.http.post(AppConstants.API_URL + 'public/list/customer_product', data);
  }
  getPageDetail(pageLink: string): Observable<any> {
    var data: any = {
      "dataFor": pageLink 
    }
    return this.http.post(AppConstants.API_URL + 'public/detail/page', data);
  }
   
}