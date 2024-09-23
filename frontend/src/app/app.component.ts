import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  effect,
  signal,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProductsService } from './Services/products.service';
import { UsersIdService } from './Services/users-id.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-in-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('0.5s ease-in-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class AppComponent {
  bounce: any;
  opened = false;
  status = false;
  title = 'frontend_hamada';
  myForm: FormGroup;
  constructor(
    private translate: TranslateService,
    private _products: ProductsService,
    private _userIdService: UsersIdService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private cookieService: CookieService
  ) {
    var getLang: any = this.cookieService.get('language');

    if (getLang) {
      this.translate.setDefaultLang(getLang);
      this._products.langSignal.set(getLang);
      // console.log('from local home ' + this.cookieService.get('language'));
    } else {
      this.translate.setDefaultLang('ar');
      this._products.langSignal.set('ar');
      this.cookieService.set('language', 'ar');
    }

    this._userIdService.getUserId();
    console.log('user id: ' + this._userIdService.getUserId());

    this.myForm = this.fb.group({
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
      subject: [
        '',
        Validators.compose([Validators.required, Validators.minLength(4)]),
      ],
    });
  }

  e = effect(() => {
    this._products.langSignal();
    console.log('from home: ' + this._products.langSignal());
  });

  openDialog() {
    this.status = !this.status;
    console.log('clicked');
  }
  closeDialog() {
    this.status = false;
  }

  customerName: string = '';
  phoneNumber: string = '';
  subject: string = '';
  submitForm() {
    if (this.myForm.valid) {
      // console.log(this.myForm.get('name')?.value);
      this.customerName = this.myForm.get('name')?.value;
      this.phoneNumber = this.myForm.get('phone')?.value;
      this.subject = this.myForm.get('subject')?.value;
      this._products
        .send_email_from_angular(
          this.customerName,
          this.phoneNumber,
          this.subject
        )
        .subscribe({
          next: (val) => {
            if (val.message === 'Email Sent Successfully') {
              this.myForm.reset();

              this.spinner.show();

              setTimeout(() => {
                /** spinner ends after 5 seconds */
                this.spinner.hide();
                this.status = false;
              }, 4000);
            } else {
              if (this.cookieService.get('language') === 'ar') {
                this.toastr.error('خطأ في الاتصال', '');
              } else {
                this.toastr.error('Connection Error', '');
              }
              this.myForm.reset();
            }
          },
          error: (err: HttpErrorResponse) => {
            console.log('Error Is: ' + err.message);
          },
        });
    } else {
      console.log(this.myForm.status);
    }
  }
}
