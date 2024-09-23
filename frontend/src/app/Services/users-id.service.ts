import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UsersIdService {

  private readonly USER_ID_COOKIE_KEY = 'user_id';

  constructor(private cookieService: CookieService) {}

  getUserId(): string {
    const existingUserId = this.cookieService.get(this.USER_ID_COOKIE_KEY);
    if (existingUserId) {
      return existingUserId;
    } else {
      const newUserId = uuidv4();
      this.cookieService.set(this.USER_ID_COOKIE_KEY, newUserId, 120);
      return newUserId;
    }
  }
}
