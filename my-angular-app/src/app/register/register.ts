import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule,CommonModule,RouterModule, HttpClientModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
  standalone: true
})
export class Register {

  constructor(private http: HttpClient,private router: Router) {}

  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  onSubmit() {
    if (
      this.name &&
      this.email &&
      this.password &&
      this.password === this.confirmPassword
    ) {
      const user = {
        username: this.name,
        email: this.email,
        password: this.password,
      };

      this.http.post('http://127.0.0.1:8000/register', user).subscribe({
        next: (res) => {
          alert('Registration successful!');
          // optionally reset the form here
          this.name = '';
          this.email = '';
          this.password = '';
          this.confirmPassword = '';
          this.router.navigate(['/']);
        },
        error: (err) => {
          alert(err.error.detail || 'Registration failed');
        },
      });
    }
  }
}
