import { Component, HostListener, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../_services/user.service';
import { PublicService } from '../_services/public.service';
import { Router } from '@angular/router';

declare var Razorpay: any;
@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css'],
})
export class CheckOutComponent implements OnInit {
  // payment success
  paymentSuccess(event: any) {
    let payload = {
      products: this.pageDetail.productList,
      addressId: this.addressId,
      userId: this.userInfo.id,
      paymentData: {
        paymentId: event.razorpay_payment_id,
        orderId: event.razorpay_order_id,
        description: event.razorpay_signature,
      },
    };

    this.userService.saveOrder(payload).subscribe((res) => {
      if (res) {
        this.router.navigate(['order']);
      }
    });
  }
  @HostListener('window:payment.success', ['$event'])
  onPaymentSuccess(event: any): void {
    let payload = {
      products: this.pageDetail.productList,
      addressId: this.addressId,
      userId: this.userInfo.id,
      paymentData: {
        paymentId: event.detail.razorpay_payment_id,
        orderId: event.detail.razorpay_order_id,
        description: event.detail.razorpay_signature,
      },
    };
    this.userService.saveOrder(payload).subscribe((res) => {
      if (res) {
        this.router.navigate(['order']);
      }
    });
  }
  pageLoaded: Promise<boolean>;
  pageDetail: any = { name: 'Cart', productList: [] };
  addressId: any;
  userInfo = {
    name: '',
    id: '',
    email: '',
  };

  delivaryAddress = {
    name: '',
    number: '',
    alrnateNumber: '',
    pincode: '',
    locality: '',
    address: '',
    city: '',
    state: '',
    landmark: '',
    addressType: '',
  };

  openCondiation = {
    userLognOpen: false,
    userAddressOpen: false,
    orderSummaryopen: false,
    payment: false,
  };

  userInfoFlag: boolean = false;
  userAddressFlag: boolean = false;
  orderSummaryFlag: boolean = false;
  paymentFlag: boolean = false;
  constructor(
    private userService: UserService,
    private publicService: PublicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.pageLoaded = Promise.resolve(true);

    let userData = JSON.parse(sessionStorage.getItem('auth-user'));
    if (userData) {
      (this.userInfo.name = userData.displayName),
        (this.userInfo.email = userData.email);
      this.userInfo.id = userData.id;
      this.userInfoFlag = true;
    }
    this.feachItems();

    // feach Address

    this.userService
      .feachAddress(JSON.parse(sessionStorage.getItem('auth-user')).id)
      .subscribe((res: any) => {
        if (res) {
          this.delivaryAddress.address = res[0].address;
          this.delivaryAddress.addressType = res[0].type;
          this.delivaryAddress.alrnateNumber = res[0].alternateNo;
          this.delivaryAddress.city = res[0].city;
          this.delivaryAddress.landmark = res[0].landMark;
          this.delivaryAddress.locality = res[0].locality;
          this.delivaryAddress.name = res[0].name;
          this.delivaryAddress.number = res[0].mobile;
          this.delivaryAddress.pincode = res[0].pinCode;
          this.delivaryAddress.state = res[0].state;
        }
      });
  }

  // feach all cart orders

  feachItems() {
    this.publicService
      .getCurrentUserProduct(JSON.parse(sessionStorage.getItem('auth-user')).id)
      .subscribe(
        (data) => {
          this.pageDetail.productList = [];
          console.log('cart list', data);
          if (data.length > 0) {
            data.forEach((element) => {
              if (element.viewType == 'cart') {
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

  // payment methord

  payNow() {
    let payload = {
      dataFor: '12222',
    };
    this.userService.getOrderid(payload).subscribe((res: any) => {
      if (res) {
        console.log(res.id);

        const RazorpayOptions = {
          key: 'rzp_test_jg5DLX3jNS9fJ4',
          amount: res.amount,
          currency: 'INR',
          name: this.userInfo.name,
          description: 'Billing for order',
          image: 'assets/img/fashion/4.jpg',
          order_id: res.id,
          handler: function (response: any) {
            var event2 = new CustomEvent('payment.success', {
              detail: response,
              bubbles: true,
              cancelable: true,
            });

            window.dispatchEvent(event2);

            console.log('success', event2.detail);
          },

          prefill: {
            name: this.userInfo.name,
            email: 'vipin@gmail.com',
            contact: '7895292262',
          },
          notes: {
            address: '',
          },
          theme: {
            color: '#1732a4',
          },
        };

        var rzp1 = new Razorpay(RazorpayOptions);
        rzp1.open();
        rzp1.on('payment.failed', function (response: any) {
          console.log('Payment Failure reason', response.error.reason);
        });
      }
    });
  }

  logout() {}

  countinueFlow(type: any) {
    switch (type) {
      case 'login':
        this.userInfoFlag = true;
        this.openCondiation.userLognOpen = false;
        this.openCondiation.userAddressOpen = true;
        break;
      case 'address':
        this.userAddressFlag = true;
        this.openCondiation.userAddressOpen = false;
        this.openCondiation.orderSummaryopen = true;

        break;
      case 'order':
        this.orderSummaryFlag = true;
        this.openCondiation.orderSummaryopen = false;
        this.openCondiation.payment = true;
        break;
    }
  }

  change(type: any) {
    switch (type) {
      case 'login':
        this.userInfoFlag = false;
        this.openCondiation.userLognOpen = true;
        this.openCondiation.userAddressOpen = false;
        this.openCondiation.orderSummaryopen = false;

        break;
      case 'address':
        this.userAddressFlag = false;
        this.openCondiation.userAddressOpen = true;
        this.openCondiation.orderSummaryopen = false;
        this.openCondiation.userLognOpen = false;

        break;
      case 'order':
        this.orderSummaryFlag = false;
        this.openCondiation.orderSummaryopen = true;
        this.openCondiation.userLognOpen = false;
        this.openCondiation.userAddressOpen = false;

        break;
    }
  }

  // check address is valid or not
  async checkValidation(data: NgForm) {
    console.log('address', data.value);
    data.value['userId'] = this.userInfo.id;
    if (data.valid) {
      //  await  this.userService.updateAndSaveAddress(data.value).subscribe((res:any) => {
      //     if (res) {
      //         this.addressId = res.id
      //         return true;
      //     }
      //   },(error))

      let res: any = await this.userService.updateAndSaveAddress(data.value);
      if (res) {
        this.addressId = res.data.id;
        return true;
      }
    }

    return false;
  }

  // / allow only number to enter inout field
  keyValidation(event: any, type: string): any {
    if (type == 'number') {
      var key = event.which || event.keyCode;
      if (key < 48 || key > 57) {
        // Check if the key is not a number
        event.preventDefault();
        return false;
      }
    } else {
      const key = event.key;
      const isAlphabet = /^[A-Za-z\s]+$/.test(key);
      if (!isAlphabet) {
        event.preventDefault();
        return false;
      }
    }
  }

  removeOrder(id: any) {
    console.log('id',id);

    let index = this.pageDetail.productList.indexOf(res => { res.id == id })
    console.log('index', index);

    this.pageDetail.productList.splice(index,1)
  }
}
