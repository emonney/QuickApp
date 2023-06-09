// ======================================
// Author: Ebenezer Monney
// Copyright (c) 2023 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Component } from '@angular/core';



@Component({
  selector: 'app-banner-demo',
  templateUrl: './banner-demo.component.html',
  styleUrls: ['./banner-demo.component.scss']
})
export class BannerDemoComponent {

  carouselSlides = [
    {
      img: 'assets/images/demo/banner1.png',
      alt: 'ASP.NET',
      caption: 'Learn how to build ASP.NET apps that can run anywhere',
      class: 'btn btn-outline-info btn-sm',
      link: 'http://go.microsoft.com/fwlink/?LinkID=525028&clcid=0x409'
    },
    {
      img: 'assets/images/demo/banner2.png',
      alt: 'Visual Studio',
      caption: 'One platform for building modern web, native mobile and native desktop applications',
      class: 'btn btn-outline-primary btn-sm',
      link: 'http://angular.io'
    },
    {
      img: 'assets/images/demo/banner3.png',
      alt: 'Package Management',
      caption: 'Bring in libraries from NuGet and npm, and bundle with angular/cli',
      class: 'btn btn-outline-success btn-sm',
      link: 'http://go.microsoft.com/fwlink/?LinkID=525029&clcid=0x409'
    },
    {
      img: 'assets/images/demo/banner4.png',
      alt: 'Eben Monney',
      caption: 'Follow me on social media for updates and tips on using this startup project',
      class: 'btn btn-outline-secondary btn-sm',
      link: 'https://www.ebenmonney.com/about'
    }
  ];
}
