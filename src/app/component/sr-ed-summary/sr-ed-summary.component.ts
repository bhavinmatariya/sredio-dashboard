import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SredRow, SredSummary } from '../../models/sred-summary.model';
import { DataService } from '../../services/data-service/data.service';
import { CommonModule } from '@angular/common';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-sr-ed-summary',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatPaginatorModule, MatPaginatorModule],
  templateUrl: './sr-ed-summary.component.html',
  styleUrl: './sr-ed-summary.component.scss',
})
export class SrEdSummaryComponent {
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<SredRow>();
  columnMappings: { [key: string]: string } = {};
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private dataService: DataService) {}

  ngAfterViewInit() {
    this.fetchSredSummaryData();
    this.dataSource.sort = this.sort;
  }

  fetchSredSummaryData(): void {
    this.dataService.getSredSummary().subscribe({
      next: (data: SredSummary) => {
        console.log('Fetched Data:', data);

        // Create column mappings from original keys to display-friendly names
        const originalKeys = Object.keys(data.rows[0]);
        const displayNames = data.columns; // Use the columns array for display names

        this.columnMappings = originalKeys.reduce((acc, key, index) => {
          acc[key] = displayNames[index];
          return acc;
        }, {} as { [key: string]: string });

        this.displayedColumns = originalKeys; // Keep original keys for binding
        this.dataSource.data = data.rows; // Set data source

        console.log('Displayed Columns:', this.displayedColumns);
        console.log('Column Mappings:', this.columnMappings);
        console.log('Data Source:', this.dataSource.data);
      },
      error: (err) =>
        console.error('Error fetching SRED summary data:', err),
    });
  }

  generateDynamicTable(data: SredRow[]) {
    console.log('Dynamic table generation for data:', data);
    // Add any additional logic for data processing here
  }
}
