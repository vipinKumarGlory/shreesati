import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../_services/user.service';
import { PublicService } from '../_services/public.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title, MetaDefinition } from '@angular/platform-browser';
import { LabelType, Options } from 'ng5-slider';
import { TokenStorageService } from '../_services/token-storage.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  pageDetail: any = { name: 'Wishlist', productList: [] };
  product: any = { name: '' };
  promptMessage: string = '';
  pageLoaded: Promise<boolean>;
  @ViewChild('msgModel', { static: false }) msgModel: ModalDirective;
  isLoggedIn: boolean = false;
  loginUser: any = {};
  newData: any;
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
      this.loadDetail();
    }
  }
  navigateTDetail(product) {
    var link = document.getElementById('quick-view-modal-close');
    link.click();
    this.router.navigate(['/product/' + product.page.pageLink]);

    //routerLink="/product/{{product.page.pageLink}}"
  }
  setProductDetail(product) {
    this.product = product;
    this.product.storageData = this.product?.productDetail?.storageDataList[0];

    console.log('this.product');
    console.log(this.product);
  }
  updateSessionProductCust() {
    this.publicService.getCurrentUserProduct(this.loginUser.id).subscribe(
      (data) => {
        this.tokenStorageService.saveUserProduct(data);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  // addPrdToCustomer(viewType, productId) {
  //   this.promptMessage = '';
  //   let isActive: boolean = true;
  //   if (viewType === 'Remove-Wishlist') {
  //     viewType = 'Wishlist';
  //     isActive = false;
  //   }
  //   console.log('addPrdToCustomer' + productId);
  //   this.publicService
  //     .addPrdToCustomer(
  //       viewType,
  //       productId,
  //       Number.parseInt(this.loginUser.id),
  //       0,
  //       this.productQty,
  //       isActive
  //     )
  //     .subscribe(
  //       (data) => {
  //         this.productQty = 1;
  //         if (viewType === 'Wishlist') {
  //           this.promptMessage =
  //             'Product removed successfully from your wishlist.';
  //         } else if (viewType === 'Cart') {
  //           this.promptMessage = 'Product added successfully in your cart.';
  //         } else {
  //           this.promptMessage = 'Product added successfully.';
  //         }
  //         this.msgModel.show();
  //         this.updateSessionProductCust();
  //       },
  //       (err) => {
  //         console.log(err);
  //       }
  //     );
  // }

  // remove order from wishlist
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
        console.log('wish list', data);
        if (data.length > 0) {
          data.forEach((element) => {
            if (element.viewType == 'wishList') {
              debugger;
              this.pageDetail.productList.push(element);
              if (
                this.pageDetail.productList &&
                this.pageDetail.productList.length
              ) {
                this.newData = this.pageDetail.productList;
              }
              console.log('wishList-23', this.pageDetail.productList);
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



  //  add to card

  addToCard(product: any, type: any) {
    console.log('product', product);
    console.log('type', type);
    if (sessionStorage.getItem('auth-user')) {
      let payload = {
        id: product.id,
        productId: product.productId,
        viewType: type,
        customerId: JSON.parse(sessionStorage.getItem('auth-user')).id,
        orderQty: 1,
        isActive: true,
      };
      this.userService.AddtoCartandWishlist(payload).subscribe((res: any) => {
        console.log('add to cart ', res);
        if (res) {
          let element = document.getElementById('quick-view-modal-close');
          element.click();
          // route to the cart list
          if (type == 'cart') this.router.navigate(['cart']);
          else {
            this.router.navigate(['wishList']);
          }
        }
      });
    } else {
      let closeButton = document.getElementById('quick-view-modal-close');
      closeButton.click();

      // Open signIn model

      let signIn = document.getElementById('signInButton');
      signIn.click();
    }
  }
}

