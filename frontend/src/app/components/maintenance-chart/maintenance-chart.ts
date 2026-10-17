import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../services/mock-data.service';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController);

@Component({
  selector: 'app-maintenance-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './maintenance-chart.html',
  styleUrl: './maintenance-chart.css'
})
export class MaintenanceChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  constructor(private mockData: MockDataService) {}

  ngAfterViewInit() {
    this.initChart();
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }

  initChart() {
    const data = this.mockData.getMaintenanceChartData();
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Collected (₹L)',
            data: data.collected,
            backgroundColor: 'rgba(29, 82, 69, 0.88)',
            borderColor: '#1D5245',
            borderWidth: 0,
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: 'Target (₹L)',
            data: data.target,
            backgroundColor: 'rgba(229, 233, 231, 0.75)',
            borderColor: '#E5E9E7',
            borderWidth: 0,
            borderRadius: 6,
            borderSkipped: false,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 10,
              boxHeight: 10,
              borderRadius: 3,
              useBorderRadius: true,
              padding: 16,
              font: { family: 'Inter', size: 12, weight: 500 },
              color: '#687572',
            }
          },
          tooltip: {
            backgroundColor: '#213934',
            titleFont: { family: 'Inter', size: 12, weight: 700 },
            bodyFont: { family: 'Inter', size: 12 },
            padding: 12,
            cornerRadius: 10,
            callbacks: {
              label: (ctx) => ` ₹${ctx.parsed.y}L`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: {
              font: { family: 'Inter', size: 12 },
              color: '#687572',
            }
          },
          y: {
            grid: {
              color: 'rgba(229, 233, 231, 0.8)',
              lineWidth: 1,
            },
            border: { dash: [4, 4], display: false },
            ticks: {
              font: { family: 'Inter', size: 11 },
              color: '#687572',
              callback: (value) => `₹${value}L`
            }
          }
        }
      }
    });
  }
}
