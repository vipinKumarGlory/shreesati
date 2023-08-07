import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DetailComponent } from './detail/detail.component';
import { CartComponent } from './cart/cart.component';

import { WishlistComponent } from './wishlist/wishlist.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProfileComponent } from './profile/profile.component';
import { OrdersComponent } from './orders/orders.component';
import { CheckOutComponent } from './check-out/check-out.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'page/:pageLink', component: DetailComponent },
  { path: 'product/:pageLink', component: ProductDetailComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'cart', component: CartComponent },

  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  {path:'order',component:OrdersComponent},
  {path:'checkOut',component:CheckOutComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
