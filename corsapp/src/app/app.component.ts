import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'corsapp';
  errMessage!: string;
  errCode!: number;
  resMessage!: string;
  requested = false;

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {

  }

  makeRequest() {
    this.requested = false;
    this.httpClient.get(`http://localhost:3000/api/hello?apiKey=f50b857e67db492d95fcb9da4697fd2d`).subscribe((res: any) => {
      this.resMessage = res.message;
      this.requested = true;
    }, (err: HttpErrorResponse) => {
      this.errMessage = err.message;
      this.errCode = err.status;
      this.requested = true;
    });
  }

}

