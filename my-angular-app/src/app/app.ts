import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
// import { Auth } from './auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true
})
export class App {
  protected title = 'my-angular-app';

  // constructor(private authService: Auth) {}
  
  ngOnInit() {
    // If no username is present in localStorage, clear all auth data
    // if (!this.authService.getUsername()) {
      // this.authService.clearUser();
    // }
  }
}
