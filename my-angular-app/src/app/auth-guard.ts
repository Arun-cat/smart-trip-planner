import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: Auth, private router: Router) {}

  canActivate(): boolean {
    // const isLoggedIn = this.authService.getUsername() !== null;
    // if (!isLoggedIn) {
      this.router.navigate(['/']);
    //   return false;
    // }
    return true;
  }
}


