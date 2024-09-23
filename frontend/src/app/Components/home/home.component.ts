import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ProductsService } from '../../Services/products.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { CookieService } from 'ngx-cookie-service';
import { Route, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { trigger, transition, useAnimation } from '@angular/animations';
import {
  backInDown,
  bounce,
  bounceIn,
  fadeIn,
  flash,
  flipInX,
  flipInY,
  jackInTheBox,
  jello,
  lightSpeedInLeft,
  lightSpeedInRight,
  rollIn,
  wobble,
  zoomIn,
} from 'ng-animate';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    TranslateModule,
    MatIconModule,
    
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('flipInX', [
      transition(
        '* => *',
        useAnimation(flipInX, {
          // Set the duration to 5seconds and delay to 2seconds
          params: { timing: 2, delay: 0 },
        })
      ),
    ]),

    trigger('fadeIn', [
      transition(
        '* => *',
        useAnimation(fadeIn, {
          // Set the duration to 5seconds and delay to 2seconds
          params: { timing: 1.2, delay: 0 },
        })
      ),
    ]),
    trigger('jackInTheBox', [
      transition(
        '* => *',
        useAnimation(jackInTheBox, {
          // Set the duration to 5seconds and delay to 2seconds
          params: { timing: 1.5, delay: 0.2 },
        })
      ),
    ]),
    trigger('flash', [
      transition(
        '* => *',
        useAnimation(flash, {
          // Set the duration to 5seconds and delay to 2seconds
          params: { timing: 1.2, delay: 0 },
        })
      ),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  bounce: any;
  products: any = [];
  promotions: any = [];
  categories: any = [];
  checkLang = '';
  // lang: any = '';
  constructor(
    private _products: ProductsService,
    private _cookieService: CookieService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
    // if (localStorage.getItem('language') === 'ar') {
    //   this.toastr.success('تم اضافة المنتج ', '');

    // } else {
    //   this.toastr.success('Product Has Been Added', 'Success');
    // }
    this.loadCategories();
    this.loadPromotion();
    this.loadProducts();
  }

  loadProducts() {
    this._products.getAllProducts(this._products.langSignal()).subscribe({
      next: (data: any) => {
        this.products = data;

        // console.log(data);
        // for(let i = 0; i < data.length; i++){
        //   console.log(data[i]['is_active']);

        // }
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.error);
        // if (this._cookieService.get('language') === 'ar') {
        //   this.toastr.error('خطأ في الاتصال', '');
        // } else {
        //   this.toastr.error('Connection Error', '');
        // }
      },
    });
  }

  loadCategories() {
    this._products.getAllCategories(this._products.langSignal()).subscribe({
      next: (data: any) => {
        this.categories = data;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.error);
      },
    });
  }

  loadPromotion() {
    this._products.getAllPromotions(this._products.langSignal()).subscribe({
      next: (data: any) => {
        this.promotions = data;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.error);
      },
    });
  }

  parsePriceToInt(num: string, vat: number) {
    var vatPrice = 0;
    vatPrice = parseInt(num) + (parseInt(num) * vat) / 100;
    return vatPrice;
  }

  e = effect(() => {
    this._products.langSignal();
    this.checkLang = this._products.langSignal();
    console.log('from home: ' + this._products.langSignal());
    this.loadProducts();
    this.loadPromotion();
    this.loadCategories();
  });

  addItemToCart(prdId: number, item_type: string) {
    this._products
      .searchInCartBeforeADD(
        this._cookieService.get('user_id'),
        prdId,
        item_type
      )
      .subscribe({
        next: (val: any) => {
          // console.log(val);

          var products: any[] = [];
          var promotion: any[] = [];
          val.map((ele: any) => {
            // products.push(ele['product']['id'] || ele['promotion']['id']);
            if (ele['product']['id']) {
              products.push(ele['product']['id']);
            } else {
              promotion.push(ele['promotion']['id']);
            }
          });
          // console.log(promotion);

          if (products.includes(prdId) || promotion.includes(prdId)) {
            if (this._cookieService.get('language') === 'ar') {
              this.toastr.info('المنتج موجود مسبقاََ', '');
            } else {
              this.toastr.info('Product Already Existent!', '');
            }
          } else {
            if (item_type === 'product') {
              this._products
                .addToCart({
                  user_id: this._cookieService.get('user_id'),
                  product: prdId,
                  promotion: null,
                  complete: false,
                  item_type,
                  qty: 1,
                })
                .subscribe({
                  next: (val: any) => {
                    console.log('product has been added');
                    this._products
                      .loadCartProducts(this._cookieService.get('user_id'))
                      .subscribe({
                        next: (val: any) => {
                          this._products.totalCartItem.set(val.length);

                          if (this._cookieService.get('language') === 'ar') {
                            this.toastr.success('تم اضافة المنتج ', '');
                          } else {
                            this.toastr.success(
                              'Product Added Successfully',
                              ''
                            );
                          }
                        },
                        error: (err: HttpErrorResponse) => {
                          console.log(err.error);
                          
                          // if (this._cookieService.get('language') === 'ar') {
                          //   this.toastr.error('خطأ في الاتصال', '');
                          // } else {
                          //   this.toastr.error('Connection Error', '');
                          // }
                        },
                      });
                  },
                  error: (err: HttpErrorResponse) => {
                    console.log(err.error);
                    // if (this._cookieService.get('language') === 'ar') {
                    //   this.toastr.error('خطأ في الاتصال', '');
                    // } else {
                    //   this.toastr.error('Connection Error', '');
                    // }
                  },
                });
            } else {
              this._products
                .addToCart({
                  user_id: this._cookieService.get('user_id'),
                  product: null,
                  promotion: prdId,
                  complete: false,
                  item_type,
                  qty: 1,
                })
                .subscribe({
                  next: (val: any) => {
                    console.log('product has been added');
                    this._products
                      .loadCartProducts(this._cookieService.get('user_id'))
                      .subscribe({
                        next: (val: any) => {
                          this._products.totalCartItem.set(val.length);

                          if (this._cookieService.get('language') === 'ar') {
                            this.toastr.success('تم اضافة المنتج ', '');
                          } else {
                            this.toastr.success(
                              'Product Added Successfully',
                              ''
                            );
                          }
                        },
                        error: (err: HttpErrorResponse) => {
                          console.log(err.error);
                          // if (this._cookieService.get('language') === 'ar') {
                          //   this.toastr.error('خطأ في الاتصال', '');
                          // } else {
                          //   this.toastr.error('Connection Error', '');
                          // }
                        },
                      });
                  },
                  error: (err: HttpErrorResponse) => {
                    console.log(err.error);
                    // if (this._cookieService.get('language') === 'ar') {
                    //   this.toastr.error('خطأ في الاتصال', '');
                    // } else {
                    //   this.toastr.error('Connection Error', '');
                    // }
                  },
                });
            }
          }
        },

        error: (err: HttpErrorResponse) => {
          console.log(err.error);
          // if (this._cookieService.get('language') === 'ar') {
          //   this.toastr.error('خطأ في الاتصال', '');
          // } else {
          //   this.toastr.error('Connection Error', '');
          // }
        },
      });
    // ________________________________________
  }

  displayItem(id: number) {
    this.router.navigate(['/product', id]);
  }

  displayPromotionItem(id: number) {
    this.router.navigate(['/promotionItem', id]);
  }

  goToProductByCat(id: number) {
    this.router.navigate(['/productByCat', id]);
  }

  getPercentage(oldPrice: number, newPrice: number) {
    let per = ((oldPrice - newPrice) / oldPrice) * 100;
    return Number(per);
  }
}
