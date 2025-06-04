import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Auth } from '../auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true
})
export class Login {
  email: string = '';
  password: string = '';
  isAdmin: boolean = false;  // 🔥 Added property
  errorMessage: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: Auth
  ) { }

  onSubmit() {
  const payload = {
    email: this.email,
    password: this.password
  };

  console.log('Admin Login Payload:', payload);
  // If admin checkbox is checked, call /admin-login
  if (this.isAdmin) {
    this.http.post('http://127.0.0.1:8000/admin-login', payload).subscribe({
      next: (res: any) => {
        console.log('Admin login response:', res);
        // Navigate to admin dashboard
        this.router.navigate(['/admin-dashboard'], {
          queryParams: {
            email: this.email,
            password: this.password
          }
        });
      },
      error: (err) => {
        console.error('Admin login failed:', err);
        this.errorMessage = 'Invalid email or password (admin)';
      }
    });
  } 
  else {
    this.http.post('http://127.0.0.1:8000/login', payload).subscribe({
      next: (res: any) => {
        console.log('User login response:', res);
        this.authService.setUser(res.username, res.email);
        this.errorMessage = '';
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('User login failed:', err);
        this.errorMessage = 'Invalid email or password';
      }
    });
  }
}

}
