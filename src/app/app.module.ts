import { BrowserModule, Meta, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
 import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { DetailComponent } from './detail/detail.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { SafeHtmlPipe } from './_helpers/pipes/safe-html.pipe';
import { ImgMagnifier } from 'ng-img-magnifier';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { Ng5SliderModule } from 'ng5-slider';
import { ProfileComponent } from './profile/profile.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CartComponent } from './cart/cart.component';
import { OrdersComponent } from './orders/orders.component';
import { StatusComponent } from './orders/status/status.component';
import { CartListComponent } from './cart-list/cart-list.component';
import { CheckOutComponent } from './check-out/check-out.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    WishlistComponent,
    CartComponent,
    DetailComponent,
    ProductDetailComponent,
    ProfileComponent,

    SafeHtmlPipe,
     OrdersComponent,
     StatusComponent,
     CartListComponent,
     CheckOutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    ImgMagnifier,
    Ng5SliderModule,
    ModalModule.forRoot(),
    BrowserAnimationsModule,

  ],
  providers: [authInterceptorProviders, Meta, Title],
  bootstrap: [AppComponent],
})
export class AppModule {}
