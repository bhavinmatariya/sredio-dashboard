import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ActivityTracking } from '../../models/activity-tracking.model';
import { TimesheetSummary } from '../../models/timesheet-summary.model';
import { ProjectHours } from '../../models/project-hours.model';
import { SredSummary } from '../../models/sred-summary.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly jsonUrl = 'assets/db.json'; // Path to the JSON file in the assets folder

  constructor(private http: HttpClient) {}

  // Fetch the full dataset from db.json
  getDataset(): Observable<{
    activityTracking: ActivityTracking;
    timesheetSummary: TimesheetSummary;
    projectHours: ProjectHours;
    sredSummary: SredSummary;
  }> {
    return this.http.get<{
      activityTracking: ActivityTracking;
      timesheetSummary: TimesheetSummary;
      projectHours: ProjectHours;
      sredSummary: SredSummary;
    }>(this.jsonUrl);
  }

  // Fetch specific parts of the dataset
  getActivityTracking(): Observable<ActivityTracking> {
    return this.http.get<{ activityTracking: ActivityTracking }>(this.jsonUrl).pipe(
      map((data) => data.activityTracking)
    );
  }
  
  getTimesheetSummary(): Observable<TimesheetSummary> {
    return this.http.get<{ timesheetSummary: TimesheetSummary }>(this.jsonUrl).pipe(
      map((data) => data.timesheetSummary)
    );
  }
  
  getSredSummary(): Observable<SredSummary> {
    return this.http.get<{ sredSummary: SredSummary }>(this.jsonUrl).pipe(
      map((data) => data.sredSummary)
    );
  }
  
  getProjectHours(): Observable<ProjectHours> {
    return this.http.get<{ projectHours: ProjectHours }>(this.jsonUrl).pipe(
      map((data) => data.projectHours)
    );
  }
}
