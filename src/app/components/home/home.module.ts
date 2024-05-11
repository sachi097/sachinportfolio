import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AboutComponent } from './about/about.component';
import { BannerComponent } from './banner/banner.component';
import { ContactComponent } from './contact/contact.component';
import { ExperienceComponent } from './experience/experience.component';
import { MoreprojectsComponent } from './more-projects/more-projects.component';
import { projectsComponent } from './projects/projects.component';
import { NgbModule, NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AnimationComponent } from './animation/animation.component';
import { HumanAnimationComponent } from './human-animation/human-animation.component';
import { EducationComponent } from './education/education.component';
import { CertificationsComponent } from './certifications/certifications.component';

@NgModule({
  declarations: [
    HomeComponent,
    HumanAnimationComponent,
    AnimationComponent,
    BannerComponent,
    AboutComponent,
    ExperienceComponent,
    projectsComponent,
    MoreprojectsComponent,
    EducationComponent,
    ContactComponent,
    CertificationsComponent
  ],
  imports: [
    CommonModule,
    NgbNavModule,
    HttpClientModule,
    CarouselModule
  ]
})
export class HomeModule { }
