import { Injectable, effect, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, retry } from 'rxjs';
import { environment } from '../../environments/environment.development'; 
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  langSignal: any = signal('');
  totalCartItem = signal(0);
  searchItem = signal('');
  constructor(private _http: HttpClient, private cookieService: CookieService) {}

  getAllProducts(lang: any): Observable<any> {
    // return this._http.get<any>(`${environment.apiProduct}`).pipe(retry(2));
    return this._http
      .get<any>(`${environment.apiProductByLanguage}${lang.toUpperCase()}`)
      .pipe(retry(2));
  }
  getAllPromotions(lang: any): Observable<any> {
    // return this._http.get<any>(`${environment.apiProduct}`).pipe(retry(2));
    return this._http
      .get<any>(`${environment.apiPromotionByLanguage}${lang.toUpperCase()}`)
      .pipe(retry(2));
  }

  getAllCategories(lang: any): Observable<any> {
    return this._http
      .get<any>(`${environment.apiCategoryByLanguage}${lang.toUpperCase()}`)
      .pipe(retry(2));
  }

  // __________________________________________________________
  // search in Cart Before Add
  searchInCartBeforeADD(userId: string, itemId: number, itemType: string): Observable<any> {
    
    if(itemType === 'product'){
      return this._http
      .get(`http://127.0.0.1:8000/api/cart/?user_id=${userId}&product__id=${itemId}&item_type=${itemType}`)
      .pipe(retry(2));
    }
    else{
      return this._http
      .get(`http://127.0.0.1:8000/api/cart/?user_id=${userId}&promotion__id=${itemId}&item_type=${itemType}`)
      .pipe(retry(2));
    }
   
  }
  

  // Add To Cart ______________________________________________

  addToCart(obj: any): Observable<any> {
    return this._http.post<any>(environment.apiCart, obj).pipe(retry(2));
  }

  loadCartProducts(userID: string): Observable<any> {
    return this._http
      .get(`http://127.0.0.1:8000/api/cart/?user_id=${userID}`)
      .pipe(retry(2));
  }

  // __________________Cart qty
  editCartProduct(id: number, obj: any): Observable<any> {
    return this._http
      .put<any>(`${environment.apiCart}${id}/`, obj)
      .pipe(retry(2));
  }

  // __________________ Delete from Cart ___________

  deleteCartProduct(id: number): Observable<any> {
    return this._http
      .delete<any>(`${environment.apiCart}${id}/`)
      .pipe(retry(2));
  }

  // _____________ display product details

  getProductByID(id: number): Observable<any> {
    return this._http
      .get<any>(`${environment.apiProductByID}${id}/`)
      .pipe(retry(2));
  }
  getPromotionByID(id: number): Observable<any> {
    return this._http
      .get<any>(`${environment.apiPromotionByID}${id}/`)
      .pipe(retry(2));
  }

  productsByName(prdName: string): Observable<any> {
    console.log('from search '+ this.cookieService.get('language'));
    
    return this._http
      .get<any>(`${environment.apiProductByName}${prdName}&languages=${this.cookieService.get('language')?.toUpperCase()}`)
      .pipe(retry(2));
  }

  productsByCategoryID(id:number):Observable<any>{
    return this._http.get<any>(`${environment.apiPrdByCatID}${id}`)

  }

  // Send Email
  send_email_from_angular(customerName:string, phoneNumber:string, subject:string):Observable<any>{
    return this._http.get<any>(`http://127.0.0.1:8000/send/${customerName}/${phoneNumber}/${subject}`).pipe(retry(2))
  }

  // __________________Payment__________________
  paymentLogic(userID: string): Observable<any>{
      return this._http
        .get(`http://127.0.0.1:8000/api/cart/?user_id=${userID}`)
        .pipe(retry(2));
    
  }

  changeCartStauts(id:number, obj:any):Observable<any>{
    return this._http.put<any>(`http://127.0.0.1:8000/api/cart/${id}/`,obj).pipe(retry(2))
  }

  addOrder(obj:any):Observable<any>{
    return this._http.post<any>(`http://127.0.0.1:8000/api/ship/`,obj).pipe(retry(2))
  }
  // ____________________________________
 
  // send email with products details


  sendEmailProductsDetails(data: any []): Observable<any> {

    return this._http.post<any>('http://127.0.0.1:8000/sendwithproducts/',  data).pipe(retry(2))
   
  }
}
