import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { ProductsService } from '../../Services/products.service'; 
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatIconModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  checkLang = '';
  constructor( private translate: TranslateService, private _products: ProductsService){}


  e = effect(() => {
    this._products.langSignal();
    this.checkLang = this._products.langSignal();
    console.log('from home: ' + this._products.langSignal());
    
  });
  
}
