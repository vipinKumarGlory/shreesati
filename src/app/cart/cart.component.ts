import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../_services/user.service';
import { PublicService } from '../_services/public.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title, MetaDefinition } from '@angular/platform-browser';
import { LabelType, Options } from 'ng5-slider';
import { TokenStorageService } from '../_services/token-storage.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  pageDetail: any = { name: 'Cart', productList: [] };
  product: any = { name: '' };
  promptMessage: string = '';
  pageLoaded: Promise<boolean>;
  @ViewChild('msgModel', { static: false }) msgModel: ModalDirective;
  isLoggedIn: boolean = false;
  loginUser: any = {};
  constructor(
    private tokenStorageService: TokenStorageService,
    private publicService: PublicService,
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    this.route.paramMap.subscribe((params) => {
      this.ngOnInit();
    });
  }
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.loginUser = this.tokenStorageService.getUser();
    }
    this.loadDetail();
  }
  getSubTotal() {
    let subTotal = 0;
    this.pageDetail.productList.forEach((x) => {
      subTotal += x.productDetail.productStock.productRate;
    });
    return subTotal;
  }
  getTotal() {
    let discountedRate = 0;
    this.pageDetail.productList.forEach((x) => {
      discountedRate += x.productDetail.productStock.discountedRate;
    });
    return discountedRate;
  }
  getDiscount() {
    let subTotalRate = this.getSubTotal();
    let discountedRate = this.getTotal();
    return subTotalRate - discountedRate;
  }
  // navigateTDetail(product) {
  //   var link = document.getElementById('quick-view-modal-close');
  //   link.click();
  //   this.router.navigate(['/product/' + product.page.pageLink]);

  //   //routerLink="/product/{{product.page.pageLink}}"
  // }
  // setProductDetail(product) {
  //   this.product = product;
  //   this.product.storageData = this.product.storageDataList[0];

  //   console.log('this.product');
  //   console.log(this.product);
  // }
  // updateSessionProductCust(){
  //   this.publicService.getCurrentUserProduct(this.loginUser.id).subscribe(
  //     data => {
  //       this.pageDetail.productList = data;
  //     },
  //     err => {
  //       console.log(err);
  //     }
  //   );
  // }
  // addPrdToCustomer(viewType, productId) {
  //   this.promptMessage = "";
  //   let isActive: boolean = true;
  //   if (viewType === "Remove-Cart") {
  //     viewType = "Cart";
  //     isActive = false;
  //   }
  //   console.log('addPrdToCustomer' + productId);
  //   this.publicService.addPrdToCustomer(viewType, productId, Number.parseInt(this.loginUser.id), 0, this.productQty, isActive).subscribe(
  //     data => {
  //       console.log("remove",data);

  //       this.productQty = 1;
  //       if (viewType === "Wishlist") {
  //         this.promptMessage = "Product removed successfully from your wishlist."

  //       }
  //       else if (viewType === "Cart") {
  //         this.promptMessage = "Product removed successfully from your cart."
  //       }
  //       else {
  //         this.promptMessage = "Product added successfully."
  //       }
  //       this.msgModel.show();
  //       // this.loadDetail()
  //     },
  //     err => {
  //       console.log(err);
  //     }
  //   );
  // }

  removeOrder(product: any) {
    let payload = {
      userId: this.loginUser.id,
      id: product.id,
    };
    this.userService.removeOrder(payload).subscribe((res) => {
      console.log('remove', res);
      this.loadDetail();
    });
  }
  loadDetail() {
    //  let userProducts = JSON.parse(userProductJson);
    this.publicService.getCurrentUserProduct(this.loginUser.id).subscribe(
      (data) => {
        this.pageDetail.productList = [];
        console.log('cart list', data);
        if (data.length > 0) {
          data.forEach((element) => {
            if (element.viewType == 'cart') {
              debugger;
              this.pageDetail.productList.push(element);
              console.log('list', this.pageDetail.productList);
            }
          });
        }

        this.pageLoaded = Promise.resolve(true);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  getMax(ary) {
    return Math.max.apply(null, ary);
  }

  getMin(ary) {
    return Math.min.apply(null, ary);
  }

  productQty = 0;

  handleMinus() {
    this.productQty--;
  }
  handlePlus() {
    this.productQty++;
  }

  // checkOut order
  checkOut() {
    this.router.navigate(['/checkOut']);
  }
}
