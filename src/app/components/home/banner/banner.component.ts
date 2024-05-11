import { Component, OnInit, AfterViewInit, Input } from '@angular/core';

import {trigger, state, style, animate, transition, keyframes, stagger, query } from "@angular/animations"
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  animations: [
    trigger('bannerTrigger', [
      transition(":enter", [
        animate('1s', keyframes([
          style({ opacity: 0, transform: 'translateY(-50px)', offset: 0 }),
          style({ opacity: 0.5, transform: 'translateY(10px)', offset: 0.3 }),
          style({ opacity: 1, transform: 'translateY(0)', offset: 1 })
        ]))
      ])
    ])
  ]
})
export class BannerComponent implements OnInit {
  
  constants: Object = {};

  constructor(
    public analyticsService: AnalyticsService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.fetchData().subscribe(data => {
      this.constants = data["Banner"];
    });
  }
  
  fetchData() {
    return this.http.get<any>('../assets/i18n/constants.json');
  }
}
