import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  constants: Object = {};

  constructor(
    public analyticsService: AnalyticsService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.fetchData().subscribe(data => {
      this.constants = data["Contact"];
    });
  }

  fetchData() {
    return this.http.get<any>('../assets/i18n/constants.json');
  }

}
