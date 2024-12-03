import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Chart, Colors } from 'chart.js/auto';
import { DataService } from '../../services/data-service/data.service';
import { ProjectHours, BarChartData } from '../../models/project-hours.model';

@Component({
  selector: 'app-project-hours',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-hours.component.html',
  styleUrls: ['./project-hours.component.scss'],
})
export class ProjectHoursComponent {
  @ViewChild('projectHoursBarChartCanvas')
  projectHoursBarChartCanvas!: ElementRef<HTMLCanvasElement>;

  barChartData: BarChartData[] = [];
  barChartInstance!: Chart;

  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.loadTimesheetData();
  }

  loadTimesheetData(): void {
    this.dataService.getProjectHours().subscribe({
      next: (data: ProjectHours) => {
        console.log(data);
        this.barChartData = data.projects.map((project) => ({
          projectName: project.projectName,
          value: project.hours,
        }));
        this.cdr.detectChanges();
        this.createBarChart();
      },
      error: (error) =>
        console.error('Failed to fetch timesheet summary', error),
    });
  }

  createBarChart(): void {
    if (!this.projectHoursBarChartCanvas) {
      console.error('Bar chart canvas is not available');
      return;
    }

    const ctx = this.projectHoursBarChartCanvas.nativeElement.getContext('2d');
    if (ctx) {
      this.barChartInstance = new Chart(ctx, {
        type: 'bar', // Bar chart type
        data: {
          labels: this.barChartData.map((item) => item.projectName), // X-axis labels
          datasets: [
            {
              label: 'Project Hours',
              data: this.barChartData.map((item) => item.value), // Y-axis values
              backgroundColor: this.barChartData.map((_, index) =>
                this.getBarColor(index)
              ), // Bar colors
              borderWidth: 1, // Bar border width
            },
          ],

          // datasets: this.barChartData.map((item, index) => ({
          //   label: item.projectName, // Each bar gets its own legend
          //   data: [item.value], // Single data point for this dataset
          //   backgroundColor: this.getBarColor(index), // Dynamic bar color
          //   borderWidth: 1,
          // })),
        },
        options: {
          responsive: true,
          scales: {
            x: {
              beginAtZero: true,
              grid: {
                display: false,
              },
              ticks: {
                font: {
                  size: 12,
                },
                color: 'black',
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              },
              ticks: {
                font: {
                  size: 12,
                },
                color: 'black',
              },
            },
          },
          plugins: {
            legend: {
              display: false,
              position: 'top',
            },
            tooltip: {
              enabled: true,
            },
          },
        },
      });
    } else {
      console.error('Unable to render bar chart');
    }
  }

  // Helper functions to dynamically assign colors
  private getBarColor(index: number): string {
    const colors = ['#46588c', '#a60c3c', '#c90c1c', '#3e1db5', '#301b69', '#042636', '#bf5881', '#782fed', '#9a1bcc', '#7f029c'];
    return colors[index % colors.length]; // Cycle through colors if there are more bars than colors
  }
}
