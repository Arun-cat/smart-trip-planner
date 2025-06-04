import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../auth';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  standalone: true,
})
export class Dashboard {

  username: string | null = null;

  numberOfDays: number | null = null;
  place: string = '';
  category: string = '';
  categories: string[] = ['Friends', 'Family', 'Couples', 'Business', 'Solo'];

  constructor(
    private router: Router,
    private authService: Auth
  ) { }

  ngOnInit() {
    this.username = this.authService.getUsername();
  }

  onSubmit() {

    if (this.numberOfDays && this.place && this.category) {
      this.router.navigate(['/request'], {
        queryParams: {
          days: this.numberOfDays,
          place: this.place,
          category: this.category
        }
      });
    }
  }
}
