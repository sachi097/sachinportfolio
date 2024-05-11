import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit {

  active = 0
  constants: Object = {};
  constructor(
    public analyticsService: AnalyticsService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.fetchData().subscribe(data => {
      this.constants = data["Education"];
    });
  }
  
  fetchData() {
    return this.http.get<any>('../assets/i18n/constants.json');
  }

  openUniversityUrl(url: string){
    window.open(url, "_blank")
  }

}
