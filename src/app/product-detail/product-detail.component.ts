import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../_services/user.service';
import { PublicService } from '../_services/public.service';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  pageLink: string = "";
  pageDetail: any;
  starRating = 3;
  productReview: any = {
    reviewPoint: 3,

  }
  reviewFormSubmit() {

    let currentDate = new Date();
    if (this.isLoggedIn) {
      this.productReview.userName = this.loginUser.displayName;
    }
    this.productReview.reviewOn = currentDate.toLocaleDateString('en-US');
    this.product.reviewList.push(this.productReview);
    this.promptMessage = "Product review added successfully."
    this.msgModel.show();
    this.productReview = {
      reviewPoint: 3,
      reviewMsg: "",
      userEmail: "",
      userName: "",
    }
  }
  @ViewChild('msgModel', { static: false }) msgModel: ModalDirective;
  isLoggedIn: boolean = false;
  loginUser: any = {};
  constructor(private publicService: PublicService, private tokenStorageService: TokenStorageService, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      this.ngOnInit();
    });

  }
  ngOnInit(): void {
    this.pageLink = this.route.snapshot.params.pageLink;
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.loginUser = this.tokenStorageService.getUser();
      console.log('loginUser');
      console.log(this.loginUser);
    }

    this.loadDetail();
  }
  product: any = { name: "", reviewList: [] };
  setProductDetail(product) {
    this.product = product;
    console.log('this.product');
    console.log(this.product);
  }
  loadDetail() {
    this.publicService.getPageDetail(this.pageLink).subscribe(
      data => {
        this.pageDetail = data;
        console.log(' this.pageDetail');
        console.log(this.pageDetail);
        if (this.pageDetail.productList !== undefined && this.pageDetail.productList !== null && this.pageDetail.productList.length > 0) {
          this.product = this.pageDetail.productList[0];
          this.product.storageData = this.product.storageDataList[0];
          this.product.reviewList = [];
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  productQty: number = 1;
  handleProductQtyMinus() {
    this.productQty--;
  }
  handleProductQtyPlus() {
    this.productQty++;
  }
  promptMessage: string = "";
  addPrdToCustomer(viewType, productId) {
    this.promptMessage = "";
    let isActive: boolean = true;
    console.log('addPrdToCustomer' + productId);
    this.publicService.addPrdToCustomer(viewType, productId, Number.parseInt(this.loginUser.id), 0, this.productQty, isActive).subscribe(
      data => {
        this.productQty = 1;
        if (viewType === "Wishlist") {
          this.promptMessage = "Product added successfully in your wishlist."
        }
        else if (viewType === "Cart") {
          this.promptMessage = "Product added successfully in your cart."
        }
        else {
          this.promptMessage = "Product added successfully."
        }
        this.msgModel.show();
      },
      err => {
        console.log(err);
      }
    );
  }
}