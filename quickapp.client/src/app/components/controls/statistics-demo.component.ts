// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

import { Component, OnInit, OnDestroy, inject, viewChild } from '@angular/core';
import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartEvent, ChartType } from 'chart.js';
import { NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownButtonItem, NgbDropdownItem }
  from '@ng-bootstrap/ng-bootstrap';

interface ChartEventArgs { event: ChartEvent; active: object[] }

@Component({
  selector: 'app-statistics-demo',
  templateUrl: './statistics-demo.component.html',
  styleUrl: './statistics-demo.component.scss',
  imports: [BaseChartDirective, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownButtonItem, NgbDropdownItem]
})
export class StatisticsDemoComponent implements OnInit, OnDestroy {
  private alertService = inject(AlertService);

  chartOptions: object | undefined;
  chartType: ChartType = 'line';
  chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  chartData = [
    {
      data: [65, 59, 80, 81, 56, 55],
      label: 'Series A',
      fill: 'origin',
    },
    {
      data: [28, 48, 40, 19, 86, 27],
      label: 'Series B',
      fill: 'origin',
    },
    {
      data: [18, 48, 77, 9, 100, 27],
      label: 'Series C',
      fill: 'origin',
    }
  ];

  timerReference: ReturnType<typeof setInterval> | undefined;

  readonly chart = viewChild.required(BaseChartDirective);

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
    };

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
      };

      this.chartOptions = { ...baseOptions, ...lineChartOptions };
    }
  }

  randomize(): void {
    for (const series of this.chartData) {
      for (let j = 0; j < series.data.length; j++) {
        series.data[j] = Math.floor((Math.random() * 100) + 1);
      }
    }

    this.chart().update();
  }

  changeChartType(type: ChartType) {
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
        this.alertService.showMessage('Demo', `Your settings was successfully configured to "${value}"`, MessageSeverity.success);
      }, 2000);
    } else {
      this.alertService.showMessage('Demo', 'Operation cancelled by user', MessageSeverity.default);
    }
  }


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  chartHovered(e: ChartEventArgs): void {
    // Demo
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  chartClicked(e: Partial<ChartEventArgs>): void {
    // Demo
  }
}
