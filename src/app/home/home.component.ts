import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../_services/user.service';
import { PublicService } from '../_services/public.service';
import { slideAnimation } from './slide.animation';
import { Router } from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { trigger, transition, style, animate } from '@angular/animations';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('carouselAnimation', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition('* => void', [animate('300ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  widgetList: any = [];
  promptMessage:string = "";
  currentIndex = 0;
  @ViewChild('msgModel', { static: false }) msgModel: ModalDirective;

  constructor(private publicService: PublicService, private router: Router,private tokenStorageService: TokenStorageService) {
    // this.preloadImages();

  }

  // preloadImages() {
  //   this.slides.forEach(slide => {
  //     (new Image()).src = slide.image;
  //   });
  //   console.log('slides: ', this.slides)
  // }
  productQty:number = 1;
  handleProductQtyMinus() {
    this.productQty--;
  }
  handleProductQtyPlus() {
    this.productQty++;
  }

  addPrdToCustomer(viewType,productId){
    this.promptMessage = "";
    let isActive:boolean = true;
    console.log('addPrdToCustomer' + productId);
    this.publicService.addPrdToCustomer(viewType,productId,Number.parseInt(this.loginUser.id),0,this.productQty,isActive).subscribe(
      data => {
        this.productQty = 1;
       if(viewType === "Wishlist"){
        this.promptMessage = "Product added successfully in your wishlist."
       }
       else if(viewType === "Cart"){
        this.promptMessage = "Product added successfully in your cart."
       }
       else
       {
        this.promptMessage = "Product added successfully."
       }
        this.msgModel.show();
      },
      err => {
        console.log(err);
      }
    );
  }
  setCurrentSlideIndex(index) {
    this.currentIndex = index;
  }
  product: any = { name: "", storageData: { smallFileUrl: "", fileUrl: "" }, shortDescription:"",productStock: { discountedRate: 0, productRate: 0, } };
  isCurrentSlideIndex(index) {
    return this.currentIndex === index;
  }

  setProductDetail(product) {
    this.product = product;
    this.product.storageData = this.product.storageDataList[0];
    console.log('this.product');
    console.log(this.product);
  }
  navigateToDetail(product) {
    var link = document.getElementById('quick-view-modal-close');
    link.click();
    this.router.navigate(['/product/' + product.page.pageLink]);
  }
  prevSlide(lst) {
    this.currentIndex = (this.currentIndex < lst.length - 1) ? ++this.currentIndex : 0;
  }

  nextSlide(lst) {
    this.currentIndex = (this.currentIndex > 0) ? --this.currentIndex : lst.length - 1;
  }
  loadDetail() {
    this.publicService.getWidgetList().subscribe(
      data => {
        this.widgetList = data;
        this.widgetList = this.widgetList.sort(function (a, b) {
          return a['priorityOrder'] - b['priorityOrder']
        });
      },
      err => {
        console.log(err);
      }
    );
  }
  isLoggedIn:boolean = false;
  loginUser:any = {};
  ngOnInit(): void {
    debugger
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.loginUser = this.tokenStorageService.getUser();
      console.log('loginUser');
      console.log(this.loginUser);
    }

    this.loadDetail();
    // this.userService.getPublicContent().subscribe(
    //   data => {
    //     this.content = data;
    //   },
    //   err => {
    //     this.content = JSON.parse(err.error).message;
    //   }
    // );
  }

}
