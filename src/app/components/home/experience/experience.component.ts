import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {
  
  active = 0
  constants: Object = {};
  constructor(
    public analyticsService: AnalyticsService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.fetchData().subscribe(data => {
      this.constants = data["Experience"];
    });
  }
  
  fetchData() {
    return this.http.get<any>('../assets/i18n/constants.json');
  }

  openCompanyUrl(url: string){
    window.open(url, "_blank")
  }

}
