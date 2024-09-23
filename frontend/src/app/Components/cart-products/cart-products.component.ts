import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../Services/products.service'; 
import { HttpErrorResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';

@Component({
  selector: 'app-cart-products',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './cart-products.component.html',
  styleUrls: ['./cart-products.component.css'],
})
export class CartProductsComponent implements OnInit {
  cartProducts: any[] = [];
  product: any[] = [];
  promotion: any[] = [];

  totalCartPrice: number = 0;
  checkLang = '';
  constructor(
    private _products: ProductsService,
    private _cookieService: CookieService,
    private toastr: ToastrService,
    private dialog: MatDialog,
   
  ) {}
  ngOnInit() {
    // console.log(this._products.langSignal());

    this.loadCart();
  }

  loadCart() {
    this.totalCartPrice = 0;
    this._products
      .loadCartProducts(this._cookieService.get('user_id'))
      .subscribe({
        next: (val:any) => {
          // console.log(val);
          this._products.totalCartItem.set(val.length);

          this.cartProducts = val;
          for (let item of this.cartProducts) {
            this.totalCartPrice += Number(item.totalPrice);
          }

          // console.log(this.cartProducts);
          // console.log('Total ' + this.totalCartPrice);
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

  // traceby
  trackByFun(index: number, prdID: any) {
    return prdID.id;
  }

  // __________________ ___________

  getNewQty(val: any, ordId: number, item_type: string) {
    let obj = {
      user_id: this._cookieService.get('user_id'),
      item_type,
      complete: false,
      qty: Number(val),
    };

    this._products.editCartProduct(ordId, obj).subscribe({
      next: (val:any) => {
        // console.log(val);
        this.loadCart();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.error.detail);
      },
    });
    console.log('Order Id: ' + ordId);
  }

  // __________ delete

  deleteItem(id: number) {
    this._products.deleteCartProduct(id).subscribe({
      next: (val:any) => {
        // console.log(val);
        if (localStorage.getItem('language') === 'ar') {
          this.toastr.success('تم حذف المنتج', '', {
            // toastClass:'custom-success-toast',
            // progressBar:true,
            // progressAnimation: 'increasing',
            // closeButton: true,
            // tapToDismiss: false,
          });
        } else {
          this.toastr.success('Product has been deleted', '');
        }

        this.loadCart();
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

  e = effect(() => {
    this._products.langSignal();
    console.log('cart ' + this._products.langSignal());
    this.checkLang = this._products.langSignal();
  });

  openDialog() {
    this.dialog.open(DialogBoxComponent, {
      // width:'350px',
      // height:'350px',
      data: {
        name: 'Ahmed Rashad',
        job: 'Programmer',
        age: 32,
      },
    });

    
 
  }


}
