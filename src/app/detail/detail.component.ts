import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../_services/user.service';
import { PublicService } from '../_services/public.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title, MetaDefinition } from '@angular/platform-browser';
import { LabelType, Options, ChangeContext } from 'ng5-slider';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  pageLink: string = '';
  pageDetail: any = { name: '' };
  product: any = { name: '' };
  pageLoaded: Promise<boolean>;
  pageFilter: any = {};
  productFilterCatagoriesList = [];
  ResevedProductList: any = [];
  userData:any

  contact = {
    name: '',
    email: '',
    subject: '',
    company: '',
    message: '',
  };
  constructor(
    private publicService: PublicService,
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    private route: ActivatedRoute,
    private UserService: UserService
  ) {
    this.route.paramMap.subscribe((params) => {
      this.ngOnInit();
    });
  }
  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('auth-user'))
    this.pageLink = this.route.snapshot.params.pageLink;
    console.log('this.pageLink');
    console.log(this.pageLink);
    this.loadDetail();
  }
  navigateToDetail(product) {
    var link = document.getElementById('quick-view-modal-close');
    link.click();
    this.router.navigate(['/product/' + product.page.pageLink]);

    //routerLink="/product/{{product.page.pageLink}}"
  }
  setProductDetail(product) {
    this.product = product;
    this.product.storageData = this.product.storageDataList[0];

    console.log('this.product');
    console.log(this.product);
  }
  loadDetail() {
    this.publicService.getPageDetail(this.pageLink).subscribe(
      (data) => {
        this.pageDetail = data;
        this.ResevedProductList = JSON.parse(JSON.stringify(this.pageDetail));
        //this.metaService.updateTag({ name:'title',content : this.pageDetail.name},"property='name'");
        this.titleService.setTitle('SatiShree | ' + this.pageDetail.name);
        if (
          this.pageDetail.productList !== undefined &&
          this.pageDetail.productList !== null &&
          this.pageDetail.productList.length > 0
        ) {
          this.product = this.pageDetail.productList[0];
          this.loadFilter();
          this.product.storageData = this.product.storageDataList[0];
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
  tagsList: any = [];
  catList: any = [];
  subCatList: any = [];
  colorList: any = [];
  collectionList: any = [];
  getSubCat(id) {
    return this.subCatList.filter((x) => x.parentId === id);
  }
  filterProject(productIds, data) {
    console.log('product data', productIds);
    console.log('product list', this.pageDetail.productList);
    console.log('data', data);
    if (data.isChecked) {
      this.productFilterCatagoriesList.push(data.name);
    } else {
      let index = this.productFilterCatagoriesList.findIndex(
        (res) => res == data.name
      );
      this.productFilterCatagoriesList.splice(index, 1);
    }
    console.log(this.productFilterCatagoriesList);
    let payload = {
      dataId: this.minPrice,
      data1Id: this.maxPrice,
      dataForList: this.productFilterCatagoriesList,
    };
    if (payload.dataForList.length > 0) {
      this.UserService.getProdutByFilter(payload).subscribe((res: any) => {
        if (res.length > 0) {
          this.pageDetail['productList'] = res[0].productList;
        } else {
          this.pageDetail['productList'] = res;
        }

        console.log('filter res', this.pageDetail);
      });
    } else {
      this.pageDetail.productList = this.ResevedProductList.productList;
    }

    // if (data.isChecked)
    //   this.pageDetail.productList = this.pageDetail.productList.filter((x) =>
    //     productIds.includes(x.id)
    //   );
  }

  loadFilter() {
    this.tagsList = [];
    this.catList = [];
    this.subCatList = [];
    this.colorList = [];
    this.collectionList = [];

    let priceRange: any = [];

    let discountRange: any = [];
    this.pageDetail.productList.forEach((product) => {
      if (!priceRange.includes(product.productStock.productRate)) {
        priceRange.push(product.productStock.productRate);
      }
      if (!discountRange.includes(product.productStock.discountedPer)) {
        discountRange.push(product.productStock.discountedPer);
      }
      product.productSubDataList.forEach((x) => {
        if (x.dataFor === 'Category') {
          let catId = x.rootData.comboParentId;
          let cat = this.catList.find((f) => f.id === catId);
          if (cat === undefined || cat === null) {
            this.catList.push({
              name: x.rootData.comboParentValue,
              id: x.rootData.comboParentId,
              count: 1,
            });
          } else {
            this.catList.find((f) => f.id === catId).count =
              this.catList.find((f) => f.id === catId).count + 1;
          }

          let subCatId = x.rootData.comboId;
          let subCat = this.subCatList.find((f) => f.id === subCatId);
          if (subCat === undefined || subCat === null) {
            this.subCatList.push({
              name: x.rootData.comboValue,
              id: x.rootData.comboId,
              count: 1,
              product: [product.id],
              parentId: catId,
            });
          } else {
            this.subCatList.find((f) => f.id === subCatId).count =
              this.subCatList.find((f) => f.id === subCatId).count + 1;
            this.subCatList
              .find((f) => f.id === subCatId)
              .product.push(product.id);
          }
        }
        if (x.dataFor === 'Product Section') {
          let sectionId = x.longVal;
          let section = this.collectionList.find((f) => f.id === sectionId);
          if (section === undefined || section === null) {
            this.collectionList.push({
              name: x.stringVal,
              id: x.longVal,
              count: 1,
              product: [product.id],
            });
          } else {
            this.collectionList.find((f) => f.id === sectionId).count =
              this.collectionList.find((f) => f.id === sectionId).count + 1;
            this.collectionList
              .find((f) => f.id === sectionId)
              .product.push(product.id);
          }
        }
        if (x.dataFor === 'Colors') {
          let sectionId = x.stringVal2;
          let section = this.collectionList.find((f) => f.id === sectionId);
          if (section === undefined || section === null) {
            this.colorList.push({
              name: x.stringVal,
              id: x.stringVal2,
              count: 1,
              colorCode: x.stringVal2,
              product: [product.id],
            });
          } else {
            this.colorList.find((f) => f.id === sectionId).count =
              this.colorList.find((f) => f.id === sectionId).count + 1;
            this.colorList
              .find((f) => f.id === sectionId)
              .product.push(product.id);
          }
        }
        if (x.dataFor === 'Tags') {
          let sectionId = x.longVal;
          let section = this.collectionList.find((f) => f.id === sectionId);
          if (section === undefined || section === null) {
            this.tagsList.push({
              name: x.stringVal,
              id: x.longVal,
              count: 1,
              product: [product.id],
            });
          } else {
            this.tagsList.find((f) => f.id === sectionId).count =
              this.tagsList.find((f) => f.id === sectionId).count + 1;
            this.tagsList
              .find((f) => f.id === sectionId)
              .product.push(product.id);
          }
        }
      });
    });

    this.minValueDiscount = this.getMin(discountRange) - 10;
    if (this.minValueDiscount < 0) {
      this.minValueDiscount = 0;
    }
    this.maxValueDiscount = this.getMax(discountRange) + 10;
    if (this.maxValueDiscount > 100) {
      this.maxValueDiscount = 100;
    }

    this.minValuePrice = this.getMin(priceRange) - 100;
    if (this.minValuePrice < 0) {
      this.minValuePrice = 0;
    }
    this.maxValuePrice = this.getMax(priceRange) + 100;

    this.minDiscount = this.minValueDiscount;
    this.maxDiscount = this.maxValueDiscount;
    this.minPrice = this.minValuePrice - 100;
    this.maxPrice = this.maxValuePrice + 100;

    this.rangePriceOptions.floor = this.minValuePrice;
    this.rangePriceOptions.ceil = this.maxValuePrice;

    this.rangeDiscountOptions.floor = this.minValueDiscount;
    this.rangeDiscountOptions.ceil = this.maxValueDiscount;
  }

  value = 1;

  handleMinus() {

    this.value--;
  }
  handlePlus() {
    this.value++;
  }

  minValueDiscount: number = 100;
  maxValueDiscount: number = 500;

  minDiscount: number = this.minValueDiscount;
  maxDiscount: number = this.maxValueDiscount;

  minValuePrice: number = 0;
  maxValuePrice: number = 5000;

  minPrice: number = this.minValuePrice - 100;
  maxPrice: number = this.maxValuePrice + 100;

  rangePriceOptions: Options = {
    floor: 100,
    ceil: 5000,
  };
  rangeDiscountOptions: Options = {
    floor: 0,
    ceil: 100,
  };

  // allow only number to enter inout field
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

  // contact form
  submit(data: NgForm) {
    if (data.valid) {
      console.log(this.contact);
    }
  }

  //  add to card

  addToCard(product: any, type: any) {
    console.log('product', product);
    console.log('type', type);
    if (sessionStorage.getItem('auth-user')) {

      let payload = {
        id: 0,
        productId: product.id,
        viewType: type,
        customerId: JSON.parse(sessionStorage.getItem('auth-user')).id,
        orderQty: 1,
        isActive: product.isActive,
      };
      this.UserService.AddtoCartandWishlist(payload).subscribe((res: any) => {
        console.log('add to cart ', res);
        if (res) {
          let element = document.getElementById('quick-view-modal-close');
          element.click();
          // route to the cart list
          if (type == 'cart') this.router.navigate(['cart'])
          else{this.router.navigate(['wishList']) }
        }
      });
    } else {
      let closeButton = document.getElementById('quick-view-modal-close');
      closeButton.click()

      // Open signIn model

      let signIn = document.getElementById('signInButton');
      signIn.click()
    }
  }

  // onrage change
  onRangeChange(event: ChangeContext) {
    console.log('event', event);
    setTimeout(() => {
      let payload = {
        dataId: this.minPrice,
        data1Id: this.maxPrice,
        dataForList: this.productFilterCatagoriesList,
      };

      this.UserService.getProdutByFilter(payload).subscribe((res: any) => {
        if (res.length > 0) {
          this.pageDetail['productList'] = res[0].productList;
        } else {
          this.pageDetail['productList'] = res;
        }

        console.log('filter res', this.pageDetail);
      });
    }, 1000);
  }

  // add to wish list

  addTowishlist(id:any,product:any) {
    let productWishListElement = document.getElementById(id)

    let addClass = productWishListElement.children[0].classList.contains('fa-heart-o')

    if (productWishListElement.children[0].classList.contains('fa-heart-o')) {
      productWishListElement.children[0].classList.remove('fa-heart-o');
      productWishListElement.children[0].classList.add('fa-heart');
      this.addToCard(product,'wishList')
    } else {
      productWishListElement.children[0].classList.remove('fa-heart');
      productWishListElement.children[0].classList.add('fa-heart-o');
      let payload = {
        userId: this.userData.id,
        id:product.id
      };
      this.UserService.removeOrder(payload).subscribe((res) => {});
    }


  }
}
