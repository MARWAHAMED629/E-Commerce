import { Component, Inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { ProductsService } from '../../Services/products.service'; 
import { CookieService } from 'ngx-cookie-service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-dialog-box',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    NgxSpinnerModule,
  ],
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css'],
})
export class DialogBoxComponent implements OnInit {
  totalPrice = 0;
  productsID: any[] = [];
  cartProducts: any[] = [];
  productsDetails: any[] = [];
  paymetn_type = 'cash';
  myFormVisa: FormGroup;
  myFormCash: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogBoxComponent,
    private fb: FormBuilder,
    private _products: ProductsService,
    private _cookieService: CookieService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.myFormVisa = this.fb.group({
      name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
        ]),
      ],
      phone: [
        '',
        Validators.compose([Validators.required, Validators.minLength(11)]),
      ],
      address: [
        '',
        Validators.compose([Validators.required, Validators.minLength(4)]),
      ],

      region: [
        '',
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],

      visaNumber: [
        '',
        Validators.compose([Validators.required, Validators.minLength(14)]),
      ],

      csv: [
        '',
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
    });

    this.myFormCash = fb.group({
      nameCash: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ]),
      ],
      phoneCash: [
        '',
        Validators.compose([Validators.required, Validators.minLength(11)]),
      ],
      emailCash: [
        '',
        Validators.compose([Validators.required, Validators.email]),
      ],
      addressCash: [
        '',
        Validators.compose([Validators.required, Validators.minLength(4)]),
      ],

      regionCash: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
        ]),
      ],
    });
  }
  ngOnInit() {}

  // onNoClick(): void {
  //   this.dialogRef.close();
  // }

  closeDialog() {
    this.dialogRef.close();
  }

  submitFormUsingVisa() {
    if (this.myFormVisa.valid) {
      console.log('by visa');
      console.log(this.myFormVisa.value);
      this.dialogRef.close();
    }
  }
  submitFormUsingCash() {
    if (this.myFormCash.valid) {
      //   console.log('by cash');
      //   console.log(this.myFormCash.value);
      //   this.dialogRef.close();

      this._products
        .paymentLogic(this._cookieService.get('user_id'))
        .subscribe({
          next: (val:any) => {
            console.log(val);

            this.cartProducts = val;

            this.cartProducts.forEach((e) => {
              this.totalPrice += e.totalPrice;

              this.productsID.push(e.id);
              if (e.product.name) {
                console.log('Product is: ' + e.product.name);
                this.productsDetails.push({
                  name: e.product.name,
                  qty: e.qty,
                  totalItem: e.totalPrice,
                });
              } else {
                console.log('promotion is: ' + e.promotion.name);
                this.productsDetails.push({
                  name: e.promotion.name,
                  qty: e.qty,
                  totalItem: e.totalPrice,
                });
              }
              console.log('ids ', this.productsID);
              console.log('Details: ', this.productsDetails);
            });

            console.log('total price is: ' + this.totalPrice);

            // ________________________________________
            const requestData: any = {
              data: this.productsDetails,
              client_name: this.myFormCash.value['nameCash'],
              client_phone: this.myFormCash.value['phoneCash'],
              addressCash: this.myFormCash.value['addressCash'],
              regionCash: this.myFormCash.value['regionCash'],
              totalPriceInvoice: this.totalPrice,
              paymentMethod: this.paymetn_type,
              emailAddress: this.myFormCash.value['emailCash'],
            };

            this._products.sendEmailProductsDetails(requestData).subscribe({
              next: (val:any) => {
                this.cartProducts.forEach((item: any) => {
                  // this.prdIDS.push(item.id)
                  this._products
                    .changeCartStauts(item.id, {
                      user_id: this._cookieService.get('user_id'),
                      id: item.id,
                      item_type: item.item_type,
                      complete: true,
                    })
                    .subscribe({
                      next: (value:any) => {},
                      error: (err: HttpErrorResponse) => {
                        console.log(err.error);
                      },
                    });
                });

                this._products
                  .addOrder({
                    user_id: this._cookieService.get('user_id'),
                    customer_name: this.myFormCash.get('nameCash')?.value,
                    order: this.productsID,
                    phone: this.myFormCash.get('phoneCash')?.value,
                    address: this.myFormCash.get('addressCash')?.value,
                    state: this.myFormCash.get('regionCash')?.value,
                    payment_status: true,
                  })
                  .subscribe({
                    next: (value:any) => {
                      console.log(this.productsDetails);
                      /*
          ,this.myFormCash.get('nameCash')?.value,this.myFormCash.get('phoneCash')?.value
          */
                      console.log('Name: ' + this.myFormCash.value['nameCash']);
                      console.log(
                        'Phone ' + this.myFormCash.value['phoneCash']
                      );
                    },
                    error: (err: HttpErrorResponse) => {
                      console.log(err.error);
                    },
                  });

                // console.log('from products mail ' + val);
                this.spinner.show();
                
                setTimeout(() => {
                  this.closeDialog();
                  this.loadCart();
                  this.spinner.hide();
                  this.router.navigate(['/home']);
                }, 3000);
              },
              error: (err: HttpErrorResponse) => {
                console.log(err.error);
              },
            });
          },
          error: (err: HttpErrorResponse) => {
            console.log(err.error);
          },
        });
    }
  }

  changeDetechtion(e: any) {
    console.log(e.value);
    this.paymetn_type = e.value;
  }

  // ____________ Load Cart Product QTY ____________
  loadCart() {
    this._products
      .loadCartProducts(this._cookieService.get('user_id'))
      .subscribe({
        next: (value:any) => {
          this._products.totalCartItem.set(value.length);
        },
        error: (err: HttpErrorResponse) => {
          console.log(err.error);
        },
      });
  }

  e = effect(() => {
    this._products.totalCartItem();
  });
}
