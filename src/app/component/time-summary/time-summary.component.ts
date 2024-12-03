import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { DataService } from '../../services/data-service/data.service';
import {
  DonutChartSegment,
  PieChartData,
  TimesheetCharts,
  TimesheetSummary,
  TimesheetUser,
} from '../../models/timesheet-summary.model';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-time-summary',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './time-summary.component.html',
  styleUrl: './time-summary.component.scss',
})
export class TimeSummaryComponent {
  @ViewChildren('timesheetDonutChartCanvas')
  timesheetDonutChartCanvases!: QueryList<ElementRef<HTMLCanvasElement>>;

  @ViewChild('timesheetSummaryPieChartCanvas')
  timesheetSummaryPieChartCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild(MatSort) sort!: MatSort;

  donutChartData: { label: string; segment: DonutChartSegment }[] = [];
  pieChartData: PieChartData[] = [];

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<TimesheetUser>();
  columnMappings: { [key: string]: string } = {};

  pieChartInstance: any;

  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.loadTimesheetData();
    this.fetchActivityTrackingData();
    this.dataSource.sort = this.sort;
  }

  fetchActivityTrackingData(): void {
    this.dataService.getTimesheetSummary().subscribe({
      next: (data: TimesheetSummary) => {
        console.log('Fetched Data:', data);
  
        // Extract original keys and display names
        const originalKeys = Object.keys(data.userTable[0]);
        const displayNames = data.columns; // Assuming data.columns contains display-friendly names
  
        // Create column mappings from original keys to display-friendly names
        this.columnMappings = originalKeys.reduce((acc, key, index) => {
          acc[key] = displayNames[index] || key; // Fallback to the original key if no display name is provided
          return acc;
        }, {} as { [key: string]: string });
  
        // Set the displayed columns and data source
        this.displayedColumns = originalKeys; // Keep original keys for MatTable binding
        this.dataSource.data = data.userTable; // Populate data source with userTable data
  
        console.log('Displayed Columns:', this.displayedColumns);
        console.log('Column Mappings:', this.columnMappings);
        console.log('Data Source:', this.dataSource.data);
      },
      error: (err) =>
        console.error('Error fetching activity tracking data:', err),
    });
  }
  

  generateDynamicTable(data: TimesheetUser[]) {
    // Map monthId to month names
  }

  loadTimesheetData(): void {
    this.dataService.getTimesheetSummary().subscribe({
      next: (data: TimesheetSummary) => {
        this.donutChartData = [
          {
            label: 'Timesheets Accepted / Timesheets Expected',
            segment: data.charts.donutChart.acceptedTimesheets,
          },
          {
            label: 'Timesheets Created / Timesheets Expected',
            segment: data.charts.donutChart.createdTimesheets,
          },
        ];
        this.pieChartData = data.charts.pieChart;
        this.cdr.detectChanges();
        this.createDonutCharts();
        this.createPieChart();
      },
      error: (error) =>
        console.error('Failed to fetch timesheet summary', error),
    });
  }

  createDonutCharts(): void {
    this.timesheetDonutChartCanvases.forEach((canvas, index) => {
      const ctx = canvas.nativeElement.getContext('2d');
      const chartData = this.donutChartData[index].segment;

      if (ctx) {
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Remaining', 'Tracked'],
            datasets: [
              {
                data: [
                  chartData.denominator - chartData.numerator,
                  chartData.numerator,
                ],
                backgroundColor: ['#E0E0E0', '#4CAF50'],
                hoverBackgroundColor: ['#BDBDBD', '#388E3C'],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            cutout: '60%',
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true },
              title: {
                text: this.donutChartData[index].label,
                display: true,
                position: 'bottom',
                align: 'center',
                color: 'black',
              },
            },
          },
          plugins: [
            {
              id: 'centerTextPlugin',
              beforeDraw: (chart) => {
                const { width, height, ctx } = chart;
                ctx.save();
                ctx.font = 'bold 20px Arial';
                ctx.fillStyle = '#4CAF50';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(
                  `${chartData.percentage}%`,
                  width / 2,
                  height / 2.2
                );
                ctx.restore();
              },
            },
          ],
        });
      } else {
        console.error('Unable to render donut chart');
      }
    });
  }

  createPieChart(): void {
    if (!this.timesheetSummaryPieChartCanvas) {
      console.error('Pie chart canvas is not available');
      return;
    }

    const ctx =
      this.timesheetSummaryPieChartCanvas.nativeElement.getContext('2d');
    if (ctx) {
      this.pieChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.pieChartData.map((item) => item.name),
          datasets: [
            {
              data: this.pieChartData.map((item) => item.value),
              backgroundColor: this.pieChartData.map((item) => item.color),
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'right',
              labels: {
                font: {
                  size: 14,
                },
                color: 'black',
                boxWidth: 15,
                pointStyle: 'rectRounded',
                usePointStyle: true,
                padding: 15,
              },
            },
            tooltip: {
              enabled: true,
            },
            title: {
              text: 'Timesheets Summary',
              display: true,
              font: {
                size: 16,
              },
            },
          },
        },
        plugins: [
          {
            id: 'linesWithLabels',
            afterDraw: (chart) => {
              const { ctx, chartArea, data } = chart;
              const meta = chart.getDatasetMeta(0); // Get metadata of the pie dataset
              const centerX = (chartArea.left + chartArea.right) / 2;
              const centerY = (chartArea.top + chartArea.bottom) / 2;
              const radius = Math.min(chartArea.width, chartArea.height) / 2;

              ctx.save();
              ctx.font = '12px Arial';
              ctx.textAlign = 'left';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = 'black';

              // Draw lines and labels for each slice
              meta.data.forEach((arc: any, index) => {
                const startAngle = arc.startAngle;
                const endAngle = arc.endAngle;
                const angle = (startAngle + endAngle) / 2;
                const x = centerX + Math.cos(angle) * radius * 0.7;
                const y = centerY + Math.sin(angle) * radius * 0.7;

                const labelX = centerX + Math.cos(angle) * radius * 1.1;
                const labelY = centerY + Math.sin(angle) * radius * 1.1;

                // Draw line
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(labelX, labelY);
                ctx.strokeStyle = this.pieChartData[index].color; // Safely access the color
                ctx.lineWidth = 1;
                ctx.stroke();

                // Draw label
                const label = data.labels?.[index] ?? '';
                const align = labelX > centerX ? 'left' : 'right';
                ctx.textAlign = align;
                ctx.fillText(String(label), labelX, labelY); // Convert label to string
              });

              ctx.restore();
            },
          },
        ],
      });
    } else {
      console.error('Unable to render pie chart');
    }
  }

  updatePieChartColors(): void {
    if (!this.pieChartInstance) {
      console.error('Pie chart instance is not available');
      return;
    }

    // Update the dataset's backgroundColor property
    this.pieChartInstance.data.datasets[0].backgroundColor =
      this.pieChartData.map((item) => item.color);

    // Re-render the chart
    this.pieChartInstance.update();
  }

  onColorChange(newColor: string, index: number): void {
    // Update the color in the pieChartData array
    this.pieChartData[index].color = newColor;

    // Update the chart colors dynamically
    this.updatePieChartColors();
  }

  darkenColor(color: string, percentage: number): string {
    const num = parseInt(color.slice(1), 16);
    const amt = Math.round(2.55 * percentage * -100);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      '#' +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  }
}
