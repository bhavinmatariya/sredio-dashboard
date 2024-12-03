import { Component } from '@angular/core';
import { TrackActivityComponent } from "../track-activity/track-activity.component";
import { ProjectHoursComponent } from "../project-hours/project-hours.component";
import { SrEdSummaryComponent } from "../sr-ed-summary/sr-ed-summary.component";
import { TimeSummaryComponent } from "../time-summary/time-summary.component";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-timesheet-dashboard',
  standalone: true,
  imports: [TrackActivityComponent, ProjectHoursComponent, SrEdSummaryComponent, TimeSummaryComponent, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule],
  templateUrl: './timesheet-dashboard.component.html',
  styleUrl: './timesheet-dashboard.component.scss',
  providers: [
    MatDatepickerModule,
  ],
})
export class TimesheetDashboardComponent {

}
