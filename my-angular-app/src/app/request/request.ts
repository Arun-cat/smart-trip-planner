import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

@Component({
  selector: 'app-request',
  imports: [CommonModule, RouterModule],
  templateUrl: './request.html',
  styleUrl: './request.css',
  standalone: true
})
export class Request {

  loading: boolean = true;
  formattedAnswer: any[] = [];
  error: string = '';
  days: number = 0;
  place: string = '';
  category: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

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
    const prompt = `
Provide a concise, structured travel itinerary in JSON format for ${this.place} over ${this.days} days, focusing on ${this.category}.
- Include only essential details.
- For each day, list exactly 3 activities with a title and a short description (max 15 words each).
- Do not add disclaimers or extra text.
- Keep the total output concise and under 300 tokens.

Use the following JSON format:

[
  {
    "day": "Day 1",
    "activities": [
      {"title": "Activity 1", "description": "Short description here."},
      {"title": "Activity 2", "description": "Short description here."},
      {"title": "Activity 3", "description": "Short description here."}
    ]
  },
  {
    "day": "Day 2",
    "activities": [
      ...
    ]
  }
]

Return only the JSON object.
`;

    this.http.post<any>('http://127.0.0.1:8000/generate', { prompt }).subscribe({
      next: (res) => {
        try {
          this.formattedAnswer = res.answer;
        } catch (error) {
          this.error = 'Failed to parse the response.';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to fetch recommendations.';
        this.loading = false;
      }
    });
  }

  generatePDF() {
  const element = document.querySelector('.recommendation-box') as HTMLElement;
  const downloadBtn = element.querySelector('.download-btn') as HTMLElement;

  if (downloadBtn) {
    downloadBtn.style.display = 'none';
  }

  // Set backgroundColor option to capture background in html2canvas
  html2canvas(element as HTMLElement, { backgroundColor: null, scrollY: -window.scrollY }).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Fill background color
    pdf.setFillColor(230, 240, 255);
    pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

    // Image properties and dimensions
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Add image at top-left corner, scaled to page width
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);

    pdf.save('tripPlan.pdf');

    if (downloadBtn) {
      downloadBtn.style.display = 'block';
    }
  });
}


}
