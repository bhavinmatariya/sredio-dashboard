import { Routes } from '@angular/router';
import { TimesheetDashboardComponent } from './component/timesheet-dashboard/timesheet-dashboard.component';
import { TimeSummaryComponent } from './component/time-summary/time-summary.component';
import { ProjectHoursComponent } from './component/project-hours/project-hours.component';
import { TrackActivityComponent } from './component/track-activity/track-activity.component';
import { SrEdSummaryComponent } from './component/sr-ed-summary/sr-ed-summary.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: TimesheetDashboardComponent,
  },
  {
    path: 'summary',
    component: TimeSummaryComponent,
  },
  {
    path: 'project-hours',
    component: ProjectHoursComponent,
  },
  {
    path: 'track-activity',
    component: TrackActivityComponent,
  },
  {
    path: 'sr-ed-summary',
    component: SrEdSummaryComponent,
  },
];
