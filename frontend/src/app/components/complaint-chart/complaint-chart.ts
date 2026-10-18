import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../services/mock-data.service';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-complaint-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './complaint-chart.html',
  styleUrl: './complaint-chart.css'
})
export class ComplaintChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('doughnutCanvas') doughnutCanvas!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  stats = { open: 0, inProgress: 0, resolved: 0, closed: 0, total: 0 };

  constructor(private mockData: MockDataService) {}

  ngAfterViewInit() {
    const data = this.mockData.getComplaintChartData();
    this.stats = { ...data, total: data.open + data.inProgress + data.resolved + data.closed };
    this.initChart(data);
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }

  initChart(data: any) {
    const ctx = this.doughnutCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Open', 'In Progress', 'Resolved', 'Closed'],
        datasets: [{
          data: [data.open, data.inProgress, data.resolved, data.closed],
          backgroundColor: ['#DC4545', '#F9CE60', '#1D5245', '#71948F'],
          borderColor: ['#ffffff'],
          borderWidth: 2,
          hoverOffset: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#213934',
            titleFont: { family: 'Inter', size: 12, weight: 700 },
            bodyFont: { family: 'Inter', size: 12 },
            padding: 12,
            cornerRadius: 10,
          }
        }
      }
    });
  }
}
