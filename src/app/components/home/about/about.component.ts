import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constants: Object = {};

  constructor(
    public analyticsService: AnalyticsService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.fetchData().subscribe(data => {
      this.constants = data["About"];
    });
  }
  
  fetchData() {
    return this.http.get<any>('../assets/i18n/constants.json');
  }
}
