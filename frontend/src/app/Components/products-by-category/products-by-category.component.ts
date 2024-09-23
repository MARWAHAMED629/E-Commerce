import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../Services/products.service'; 
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { trigger, transition, useAnimation } from '@angular/animations';
import {
  backInDown,
  bounce,
  fadeIn,
  flash,
  jackInTheBox,
  jello,
  lightSpeedInLeft,
  wobble,
  zoomIn,
} from 'ng-animate';

@Component({
  selector: 'app-products-by-category',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    TranslateModule,
    MatIconModule,
  ],
  templateUrl: './products-by-category.component.html',
  styleUrls: ['./products-by-category.component.css'],

  animations: [
    trigger('fadeIn', [
      transition(
        '* => *',
        useAnimation(fadeIn, {
          // Set the duration to 5seconds and delay to 2seconds
          params: { timing: 1.2, delay: 0 },
        })
      ),
    ]),
  ],
})
export class ProductsByCategoryComponent implements OnInit {
  bounce: any;
  checkLang = '';
  catID: any = 0;
  products: any = [];
  constructor(
    private activatedRouter: ActivatedRoute,
    private _products: ProductsService,
    private router: Router,
    private toastr: ToastrService,
    private _cookieService: CookieService
  ) {
    this.catID = Number(this.activatedRouter.snapshot.paramMap.get('id'));
    console.log(this.catID);
  }
  ngOnInit() {
    this.loadPrdByCatID();
  }

  loadPrdByCatID() {
    this._products.productsByCategoryID(this.catID).subscribe({
      next: (data:any) => {
        this.products = data;
        console.log(this.products);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.error);
      },
    });
  }

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
          } 
          
          
          
          else {
            if(item_type === 'product'){
              this._products.addToCart({
               
                  user_id: this._cookieService.get('user_id'),
                  product: prdId,
                  promotion:null,
                  complete: false,
                  item_type,
                  qty: 1,
                

              }).subscribe({
                next: (val:any) => {
                  console.log('product has been added');
                  this._products
                    .loadCartProducts(
                      this._cookieService.get('user_id'),
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
            }else{
              this._products.addToCart({
               
                user_id: this._cookieService.get('user_id'),
                product: null,
                promotion:prdId,
                complete: false,
                item_type,
                qty: 1,
              

            }).subscribe({
              next: (val:any) => {
                console.log('product has been added');
                this._products
                  .loadCartProducts(
                    this._cookieService.get('user_id'),
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

  // e = effect(() => {
  //   this._products.langSignal();
  //   console.log('from prdByCatID: ' + this._products.langSignal());
  //   this.loadPrdByCatID();

  // });
}
