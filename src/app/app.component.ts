import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import { PublicService } from './_services/public.service';
import { AppConstants } from './common/app.constants';
import { AuthService } from './_services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './_services/user.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  form: any = {};
  isLoginFailed = false;
  errorMessage = '';
  currentUser: any;
  googleURL = AppConstants.GOOGLE_AUTH_URL;
  facebookURL = AppConstants.FACEBOOK_AUTH_URL;
  githubURL = AppConstants.GITHUB_AUTH_URL;
  linkedinURL = AppConstants.LINKEDIN_AUTH_URL;

  footerList: any = [];
  menuList: any = [];
  constructor(
    private tokenStorageService: TokenStorageService,
    private publicService: PublicService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('googleURL');
    console.log(this.googleURL);
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    this.loadMenu();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      console.log('user');
      console.log(user);

      this.username = user.displayName;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
  onSubmit(): void {
    this.authService.register(this.formRegister).subscribe(
      (data) => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      (err) => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }
  getMenuList(apiLst: any) {
    apiLst
      .filter(
        (x) =>
          x.rootId === 0 &&
          x.pageType !== 'Product' &&
          x.pageType !== 'Information (Footer Link)' &&
          x.pageType !== 'Information (Page)'
      )
      .forEach((menu) => {
        menu.childMenu = [];
        apiLst
          .filter((y) => y.rootId === menu.id)
          .forEach((subMenu) => {
            menu.childMenu.push(subMenu);
          });
        this.menuList.push(menu);
      });
    apiLst
      .filter(
        (x) => x.rootId === 0 && x.pageType === 'Information (Footer Link)'
      )
      .forEach((menu) => {
        this.footerList.push(menu);
      });
    this.menuList = this.menuList.sort(function (a, b) {
      return a['priorityOrder'] - b['priorityOrder'];
    });
    this.footerList = this.footerList.sort(function (a, b) {
      return a['priorityOrder'] - b['priorityOrder'];
    });
    console.log('this.menuList');
    console.log(this.menuList);
  }
  formType: string = 'Login';
  formRegister: any = {};
  isSuccessful = false;
  isSignUpFailed = false;
  errorRegisterMessage = '';
  loadMenu() {
    this.publicService.getPageList('ALL').subscribe(
      (data) => {
        this.getMenuList(data);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  loginObservable() {
    this.outerObservable()
      .pipe(switchMap((outerResult: any) => this.innerObservable(outerResult)))
      .subscribe(
        (data: any) => {
          this.tokenStorageService.saveUserProduct(data);
          window.location.reload();
        },
        (err) => {
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
        }
      );
  }
  outerObservable() {
    // Return the outer observable
    return this.authService.login(this.form);
  }

  innerObservable(data: any) {
    this.login(data.user);
    this.tokenStorageService.saveToken(data.accessToken);
    return this.publicService.getCurrentUserProduct(data.user.id);
  }
  onLogin(): void {
    this.loginObservable();
  }

  login(user): void {
    this.tokenStorageService.saveUser(user);
    this.isLoginFailed = false;
    this.isLoggedIn = true;
    this.currentUser = this.tokenStorageService.getUser();
  }

  // order list
  routerToOrders() {
    this.router.navigate(['order']);
  }
}
