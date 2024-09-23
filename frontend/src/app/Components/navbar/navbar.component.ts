import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


import { MatListModule } from '@angular/material/list';

// import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppRoutingModule } from '../../app-routing.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProductsService } from '../../Services/products.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import {MatSidenavModule} from '@angular/material/sidenav';

import { trigger, transition, useAnimation } from '@angular/animations';
import { flip, flipInX, flipInY } from 'ng-animate';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    AppRoutingModule,
    MatListModule,

    TranslateModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [
    trigger('flipInY', [transition('* => *', useAnimation(flipInY, {
      // Set the duration to 5seconds and delay to 2seconds
      params: { timing: 2, delay: 0 }
    }))])
  ],
})
export class NavbarComponent implements OnInit {
  bounce: any;
  opened = false;
  cartTotal = 0;
  constructor(
    private translate: TranslateService,
    private _products: ProductsService,
    private _cookieService: CookieService,
    private _router: Router
  ) {}
  ngOnInit() {
    this.loadCartTottal();
  }

  switcLanguage(lang: string) {
    localStorage.setItem('language', lang);
    this._cookieService.set('language', lang);
    this.translate.use(lang);
    this._products.langSignal.set(lang.toUpperCase());
    console.log('from navbar ' + this._products.langSignal());
  }

  loadCartTottal() {
    this._products
      .loadCartProducts(this._cookieService.get('user_id'))
      .subscribe({
        next: (val:any) => {
          // console.log('total cart ' + val.length);
          this._products.totalCartItem.set(val.length);
        },
        error: (err: HttpErrorResponse) => {
          console.log(err.error);
        },
      });
  }
  e = effect(() => {
    this.cartTotal = this._products.totalCartItem();
    
  });

  // Search By Product Name
  searchByProduct(val: string) {
    if (val !== '') {
      // this._products.searchSubject.next(val)
      this._products.searchItem.set(val);
      this._router.navigate(['/searchProduct']);
    } else {
      this._router.navigate(['/home']);
    }
  }
}
