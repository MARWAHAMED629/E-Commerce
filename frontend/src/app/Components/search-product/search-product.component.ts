import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../Services/products.service'; 
import { HttpErrorResponse } from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-search-product',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    TranslateModule,
  ],
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.css'],
})
export class SearchProductComponent implements OnInit {
  products: any = [];
  constructor(
    private _products: ProductsService,
    private router: Router,
    private toastr: ToastrService,
    private _cookieService: CookieService
  ) {}
  ngOnInit() {
    this._products.productsByName(this._products.searchItem()).subscribe({
      next: (val:any) => {
        // console.log(val);
        this.products = val;
        console.log(this.products);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.error);
      },
    });
  }

  e = effect(() => {
    this._products.searchItem();
    console.log(this._products.searchItem());
  });

  displayItem(id: number) {
    this.router.navigate(['/product', id]);
  }

  parsePriceToInt(num: string, vat: number) {
    var vatPrice = 0;
    vatPrice = parseInt(num) + (parseInt(num) * vat) / 100;
    return vatPrice;
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
          var products: any[] = [];
          val.map((ele: any) => {
            products.push(ele['product']['id']);
          });

          if (products.includes(prdId)) {
            // console.log('Existent');

            if (localStorage.getItem('language') === 'ar') {
              this.toastr.info('المنتج موجود مسبقاََ', '');
            } else {
              this.toastr.info('Product Already Existent!', '');
            }
          } else {
            let obj = {
              user_id: this._cookieService.get('user_id'),
              product: prdId,
              complete: false,
              qty: 1,
            };
            this._products.addToCart(obj).subscribe({
              next: (val:any) => {
                console.log('product has been added');
                this._products
                  .searchInCartBeforeADD(
                    this._cookieService.get('user_id'),
                    prdId,
                    item_type
                  )
                  .subscribe({
                    next: (val:any) => {
                      this._products.totalCartItem.set(val.length);

                      if (localStorage.getItem('language') === 'ar') {
                        this.toastr.success('تم اضافة المنتج ', '');
                      } else {
                        this.toastr.success('Product Added Successfully', '');
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

  
}
