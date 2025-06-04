import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
  standalone: true,
  imports: [CommonModule]
})
export class AdminDashboardComponent {
  email: string = '';
  password: string = '';
  users: any[] = [];
  errorMessage: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router,private cdr: ChangeDetectorRef) {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.password = params['password'];
      if (this.email && this.password) {
        this.fetchUsers();
      } else {
        this.errorMessage = 'Missing admin credentials.';
      }
    });
  }

  fetchUsers() {
    const params = new HttpParams()
      .set('email', this.email)
      .set('password', this.password);
    this.http.get<any[]>('http://127.0.0.1:8000/admin/users', { params }).subscribe({
      next: (res) => {
        this.users = res;
        this.cdr.detectChanges();
        console.log('Fetched users:', res);
      },
      error: (err) => {
        this.errorMessage = 'Failed to fetch users.';
      }
    });
  }

deleteUser(userId: number) {
  const params = new HttpParams()
    .set('email', this.email)     // assuming username stores the admin's email
    .set('password', this.password);
  this.http.delete(`http://127.0.0.1:8000/admin/users/${userId}`, { params }).subscribe({
    next: (res: any) => {
      alert(res.message);
      this.fetchUsers();
    },
    error: (err) => {
      alert('Failed to delete user.');
    }
  });
}
}
