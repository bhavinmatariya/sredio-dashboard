import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { DataService } from '../../services/data-service/data.service';
import { CommonModule } from '@angular/common';
import {
  ActivityTracking,
  Month,
  ActivityChartData,
} from '../../models/activity-tracking.model';

@Component({
  selector: 'app-track-activity',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './track-activity.component.html',
  styleUrl: './track-activity.component.scss',
})
export class TrackActivityComponent {
  @ViewChild('donutChartCanvas')
  donutChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barLineChartCanvas')
  barLineChartCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild(MatSort) sort!: MatSort;

  donutChartConfig!: ChartConfiguration<'doughnut'>;
  barLineChartConfig!: ChartConfiguration<'bar' | 'line'>;

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<{ [key: string]: number | string }>();

  constructor(private dataService: DataService) {}

  ngAfterViewInit(): void {
    this.fetchActivityTrackingData();

    this.dataSource.sort = this.sort;
  }

  fetchActivityTrackingData(): void {
    this.dataService.getActivityTracking().subscribe({
      next: (data: ActivityTracking) => {
        this.generateDynamicTable(data);
        this.setupDonutChartConfig(data);
        this.setupBarWithLineChartConfig(data);
        this.createCharts();
      },
      error: (err) =>
        console.error('Error fetching activity tracking data:', err),
    });
  }

  generateDynamicTable(data: ActivityTracking) {
    // Map monthId to month names
    const monthMapping: { [key: number]: string } = {};
    data.months.forEach((month: Month) => {
      monthMapping[month.monthId] = month.month;
    });

    // Dynamically build columns
    this.displayedColumns = [
      'type',
      ...data.months.map((month: Month) => month.month),
    ];

    // Create rows for Cumulative Hours and Total Hours
    const cumulativeHoursRow: { [key: string]: number | string } = {
      type: 'Cumulative Hours',
    };
    const totalHoursRow: { [key: string]: number | string } = {
      type: 'Total Hours',
    };

    data.chartData.forEach((item: ActivityChartData) => {
      const month = monthMapping[item.monthId];
      cumulativeHoursRow[month] = item.cumulativeHours;
      totalHoursRow[month] = item.totalHours;
    });

    // Set the data for the table
    this.dataSource.data = [cumulativeHoursRow, totalHoursRow];
  }

  setupDonutChartConfig(data: ActivityTracking): void {
    const overallStats = data.overallStats;

    // Plugin for center text
    const centerTextPlugin = {
      id: 'centerTextPlugin',
      beforeDraw: (chart: any) => {
        const { width, height, ctx } = chart;
        const text = `${overallStats.overallTrackerHrs}%`;
        ctx.save();
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = '#FF5722';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, width / 2, height / 2.3);
        ctx.restore();
      },
    };

    this.donutChartConfig = {
      type: 'doughnut',
      data: {
        labels: ['Overall Hours', 'Tracked Hours'],
        datasets: [
          {
            data: [
              overallStats.overallTrackedWorkedHrs,
              overallStats.overallTrackerHrs,
            ],
            backgroundColor: ['#E0E0E0', '#FF5722'], // Colors for the segments
            hoverBackgroundColor: ['#BDBDBD', '#E64A19'], // Hover colors
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
          title: {
            text: 'Overall Tracked Hours / Overall Worked Hours',
            display: true,
            position: 'bottom',
            align: 'center',
            color: 'black',
          },
        },
      },
      plugins: [centerTextPlugin],
    };
  }

  setupBarWithLineChartConfig(data: ActivityTracking): void {
    const chartData = data.chartData;
    const months = data.months;

    const labels = months.map((month: Month) => month.month);
    const cumulativeHours = chartData.map(
      (item: ActivityChartData) => item.cumulativeHours
    );
    const totalHours = chartData.map(
      (item: ActivityChartData) => item.totalHours
    );

    this.barLineChartConfig = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            type: 'line',
            label: 'Total Hours',
            data: totalHours,
            backgroundColor: '#2196F3',
            borderColor: '#2196F3',
            borderWidth: 2,
            tension: 0.4,
            fill: false,
            pointStyle: 'circle',
            order: 1,
          },
          {
            type: 'bar',
            label: 'Cumulative Hours',
            data: cumulativeHours,
            backgroundColor: '#FF9800',
            hoverBackgroundColor: '#FF5722',
            borderWidth: 1,
            order: 2,
          },
        ],
      },
      options: {
        responsive: true,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            enabled: true,
          },
        },
        scales: {
          x: {
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            grid: {
              drawTicks: false,
              drawOnChartArea: true,
            },
          },
        },
      },
    };
  }

  createCharts(): void {
    const donutCtx = this.donutChartCanvas.nativeElement.getContext('2d');
    const barLineCtx = this.barLineChartCanvas.nativeElement.getContext('2d');

    if (donutCtx) {
      new Chart(donutCtx, this.donutChartConfig);
    } else {
      console.error('Failed to create donut chart');
    }

    if (barLineCtx) {
      new Chart(barLineCtx, this.barLineChartConfig);
    } else {
      console.error('Failed to create bar with line chart');
    }
  }
}
