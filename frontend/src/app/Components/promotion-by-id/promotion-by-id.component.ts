import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../Services/products.service'; 
import { HttpErrorResponse } from '@angular/common/http';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { TranslateModule } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-promotion-by-id',
  standalone: true,
  imports: [
    CommonModule,
    NgxImageZoomModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './promotion-by-id.component.html',
  styleUrls: ['./promotion-by-id.component.css'],
})
export class PromotionByIDComponent implements OnInit {
  checkLang = '';
  prdID: number = 0;
  name: string = '';
  old_price: string = '';
  new_price: number = 0;
  first_image: string = '';
  second_image: string = '';
  third_image: string = '';
  fourth_image: string = '';
  imgChange: string = '';
  item_type = '';

  constructor(
    private activatedRouter: ActivatedRoute,
    private _products: ProductsService,

    private _cookieService: CookieService,
    private toastr: ToastrService
  ) {
    this.prdID = Number(this.activatedRouter.snapshot.paramMap.get('id'));
  }
  ngOnInit() {
    this.getProduct();
  }

  getProduct() {
    this._products.getPromotionByID(this.prdID).subscribe({
      next: (val:any) => {
        // console.log(val);
        let {
          id,
          name,
          old_price,
          new_price,
          first_image,
          second_image,
          third_image,
          fourth_image,
          item_type,
        } = val;
        this.prdID = id;
        this.name = name;
        this.old_price = old_price;
        this.new_price = new_price;
        this.first_image = first_image;
        this.second_image = second_image;
        this.third_image = third_image;
        this.fourth_image = fourth_image;
        this.imgChange = this.first_image;
        this.item_type = item_type;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.error);
      },
    });
  }

  changeImage(src: string) {
    this.imgChange = src;
    console.log(this.imgChange);
  }

  addItemToCart(prdId: number, item_type: string) {
    this._products
      .searchInCartBeforeADD(
        this._cookieService.get('user_id'),
        prdId,
        item_type
      )
      .subscribe({
        next: (val:any) => {
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
            if (localStorage.getItem('language') === 'ar') {
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
                  next: (val:any) => {
                    console.log('product has been added');
                    this._products
                      .loadCartProducts(this._cookieService.get('user_id'))
                      .subscribe({
                        next: (val:any) => {
                          this._products.totalCartItem.set(val.length);

                          if (localStorage.getItem('language') === 'ar') {
                            this.toastr.success('تم اضافة المنتج ', '');
                          } else {
                            this.toastr.success(
                              'Product Added Successfully',
                              ''
                            );
                          }
                        },
                        error: (err: HttpErrorResponse) => {
                          if (localStorage.getItem('language') === 'ar') {
                            this.toastr.error('خطأ في الاتصال', '');
                          } else {
                            this.toastr.error('Connection Error', '');
                          }
                        },
                      });
                  },
                  error: (err: HttpErrorResponse) => {
                    if (localStorage.getItem('language') === 'ar') {
                      this.toastr.error('خطأ في الاتصال', '');
                    } else {
                      this.toastr.error('Connection Error', '');
                    }
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
                  next: (val:any) => {
                    console.log('product has been added');
                    this._products
                      .loadCartProducts(this._cookieService.get('user_id'))
                      .subscribe({
                        next: (val:any) => {
                          this._products.totalCartItem.set(val.length);

                          if (localStorage.getItem('language') === 'ar') {
                            this.toastr.success('تم اضافة المنتج ', '');
                          } else {
                            this.toastr.success(
                              'Product Added Successfully',
                              ''
                            );
                          }
                        },
                        error: (err: HttpErrorResponse) => {
                          if (localStorage.getItem('language') === 'ar') {
                            this.toastr.error('خطأ في الاتصال', '');
                          } else {
                            this.toastr.error('Connection Error', '');
                          }
                        },
                      });
                  },
                  error: (err: HttpErrorResponse) => {
                    if (localStorage.getItem('language') === 'ar') {
                      this.toastr.error('خطأ في الاتصال', '');
                    } else {
                      this.toastr.error('Connection Error', '');
                    }
                  },
                });
            }
          }
        },

        error: (err: HttpErrorResponse) => {
          if (localStorage.getItem('language') === 'ar') {
            this.toastr.error('خطأ في الاتصال', '');
          } else {
            this.toastr.error('Connection Error', '');
          }
        },
      });
    // ________________________________________
  }
  e = effect(() => {
    this.checkLang = this._products.langSignal();
  });
}
