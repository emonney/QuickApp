// ======================================
// Author: Ebenezer Monney
// Copyright (c) 2023 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { BaseChartDirective } from 'ng2-charts';

require('chart.js');


@Component({
  selector: 'app-statistics-demo',
  templateUrl: './statistics-demo.component.html',
  styleUrls: ['./statistics-demo.component.scss']
})
export class StatisticsDemoComponent implements OnInit, OnDestroy {

  chartOptions;
  chartType = 'line';
  chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  chartData = [
    {
      data: [65, 59, 80, 81, 56, 55],
      label: 'Series A',
      fill: 'origin',
      /*
      // grey color
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      */
    },
    {
      data: [28, 48, 40, 19, 86, 27],
      label: 'Series B',
      fill: 'origin',
      /*
      // dark grey color
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
      */
    },
    {
      data: [18, 48, 77, 9, 100, 27],
      label: 'Series C',
      fill: 'origin',
      /*
      // darker grey color
      backgroundColor: 'rgba(128,128,128,0.2)',
      borderColor: 'rgba(128,128,128,1)',
      pointBackgroundColor: 'rgba(128,128,128,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(128,128,128,0.8)'
      */
    }
  ];

  timerReference: any;


  @ViewChild(BaseChartDirective)
  chart?: BaseChartDirective;

  constructor(private alertService: AlertService) {

  }

  ngOnInit() {
    this.refreshChartOptions();
    this.timerReference = setInterval(() => this.randomize(), 5000);
  }

  ngOnDestroy() {
    clearInterval(this.timerReference);
  }

  refreshChartOptions() {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: false,
        fontSize: 16,
        text: 'Important Stuff'
      }
    }

    if (this.chartType != 'line') {
      this.chartOptions = baseOptions;
    }
    else {
      const lineChartOptions = {
        elements: {
          line: {
            tension: 0.5
          }
        }
      }

      this.chartOptions = { ...baseOptions, ...lineChartOptions };
    }
  }

  randomize(): void {
    for (let i = 0; i < this.chartData.length; i++) {
      for (let j = 0; j < this.chartData[i].data.length; j++) {
        this.chartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
      }
    }

    this.chart?.update();
  }

  changeChartType(type: string) {
    this.chartType = type;
    this.refreshChartOptions();
  }

  showMessage(msg: string): void {
    this.alertService.showMessage('Demo', msg, MessageSeverity.info);
  }

  showDialog(msg: string): void {
    this.alertService.showDialog(msg, DialogType.prompt, (val) => this.configure(true, val), () => this.configure(false));
  }

  configure(response: boolean, value?: string) {

    if (response) {

      this.alertService.showStickyMessage('Simulating...', '', MessageSeverity.wait);

      setTimeout(() => {

        this.alertService.resetStickyMessage();
        this.alertService.showMessage('Demo', `Your settings was successfully configured to \"${value}\"`, MessageSeverity.success);
      }, 2000);
    } else {
      this.alertService.showMessage('Demo', 'Operation cancelled by user', MessageSeverity.default);
    }
  }

  chartClicked(e): void {
    //console.log(e);
  }

  chartHovered(e): void {
    //console.log(e);
  }
}
