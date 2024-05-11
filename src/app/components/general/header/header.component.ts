import { Component, OnInit, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import {trigger, style, query, transition, stagger, animate } from '@angular/animations'
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ThemingService } from 'src/app/services/theming/theming.service';
import { Theme } from 'src/app/theme';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations:[
    trigger("animateMenu",[
      transition(":enter",[
        query("*", [
          style({opacity: 0, transform: "translateY(-50%)"}),
          stagger(50,[
            animate(
              "250ms cubic-bezier(0.35, 0, 0.25, 1)",
              style({opacity: 1, transform: "none"}))
          ])
        ])
      ])
    ])
  ]
})



export class HeaderComponent implements OnInit {

  constants: Object = {};
  responsiveMenuVisible: Boolean = false;
  pageYPosition: number;
  cvName: string = "";
  private _themes = Object.values(Theme);
  themeType = 0;

  constructor(
    private router: Router,
    public analyticsService: AnalyticsService,
    private http: HttpClient,
    private themingService: ThemingService
  ) { }

  ngOnInit(): void {
    this.fetchData().subscribe(data => {
      this.constants = data["Header"];
    });
  }
 
  fetchData() {
    return this.http.get<any>('../assets/i18n/constants.json');
  }

  scroll(el) {
    if(document.getElementById(el)) {
      document.getElementById(el).scrollIntoView({behavior: 'smooth'});
    } else{
      this.router.navigate(['/home']).then(()=> document.getElementById(el).scrollIntoView({behavior: 'smooth'}) );
    }
    this.responsiveMenuVisible=false;
  }

  downloadCV(){
      this.cvName = this.constants["cvName"];
      // app url
      let url = window.location.href;
      // Open a new window with the CV
      window.open(url + "/../assets/cv/" + this.cvName, "_blank");
      this.analyticsService.sendAnalyticEvent("click_resume", "resume", "click");
  }

  public setNextTheme(themeType: number): void {
    this.themeType = themeType;
    this.themingService.setTheme(this._themes[this.themeType]);
  }

  @HostListener('window:scroll', ['getScrollPosition($event)'])
    getScrollPosition(event) {
        this.pageYPosition=window.pageYOffset
    }
}
