// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { NgbCarousel, NgbSlide } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-banner-demo',
    templateUrl: './banner-demo.component.html',
    styleUrl: './banner-demo.component.scss',
    imports: [NgbCarousel, NgbSlide, NgClass]
})
export class BannerDemoComponent {

  carouselSlides = [
    {
      img: 'images/demo/banner1.png',
      alt: 'ASP.NET',
      caption: 'Learn how to build ASP.NET apps that can run anywhere',
      class: 'btn btn-outline-info btn-sm',
      link: 'http://go.microsoft.com/fwlink/?LinkID=525028&clcid=0x409'
    },
    {
      img: 'images/demo/banner2.png',
      alt: 'Visual Studio',
      caption: 'One platform for building modern web, native mobile and native desktop applications',
      class: 'btn btn-outline-primary btn-sm',
      link: 'http://angular.dev'
    },
    {
      img: 'images/demo/banner3.png',
      alt: 'Package Management',
      caption: 'Bring in libraries from NuGet and npm, and bundle with angular/cli',
      class: 'btn btn-outline-success btn-sm',
      link: 'http://go.microsoft.com/fwlink/?LinkID=525029&clcid=0x409'
    },
    {
      img: 'images/demo/banner4.png',
      alt: 'Eben Monney',
      caption: 'Follow me on social media for updates and tips on using this startup project',
      class: 'btn btn-outline-secondary btn-sm',
      link: 'https://www.ebenmonney.com/about'
    }
  ];
}
