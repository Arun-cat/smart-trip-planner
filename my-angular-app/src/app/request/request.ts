import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-request',
  imports: [CommonModule, RouterModule],
  templateUrl: './request.html',
  styleUrl: './request.css',
  standalone: true
})
export class Request {

  loading: boolean = true;
  answer: string = '';
  error: string = '';
  days: number = 0;
  place: string = '';
  category: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.days = +params['days'];
      this.place = params['place'];
      this.category = params['category'];
      if (this.days && this.place && this.category) {
        this.fetchRecommendations();
      } else {
        this.loading = false;
        this.error = 'Missing query parameters.';
      }
    });
  }

  fetchRecommendations() {
    const prompt = `Suggest places to visit in ${this.place} for ${this.days} days under the category ${this.category}.`;
    console.log(prompt)
    this.http.post<any>('http://127.0.0.1:8000/generate', { prompt }).subscribe({
      
      next: (res) => {
        this.answer = res.answer;
        this.loading = false;
        console.log(res.answer)
      },
      error: (err) => {
        this.error = 'Failed to fetch recommendations.';
        this.loading = false;
      }
    });
  }
}
