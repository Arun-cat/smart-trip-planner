import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private usernameKey = 'username';
  private emailKey = 'email';
  private isBrowser: boolean;
  private apiUrl = 'http://localhost:8000/generate';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  setUser(username: string, email: string) {
    if (this.isBrowser) {
      localStorage.setItem(this.usernameKey, username);
      localStorage.setItem(this.emailKey, email);
    }
  }

  getUsername(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.usernameKey);
    }
    return null;
  }

  getEmail(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.emailKey);
    }
    return null;
  }

  clearUser() {
    if (this.isBrowser) {
      localStorage.removeItem(this.usernameKey);
      localStorage.removeItem(this.emailKey);
    }
  }

  getAnswer(prompt: string): Observable<{ answer: string }> {
    return this.http.post<{ answer: string }>(this.apiUrl, { prompt });
  }
}
