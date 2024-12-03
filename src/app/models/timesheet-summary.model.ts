export interface TimesheetSummary {
  columns: string[];
  summary: TimesheetSummaryDetails;
  charts: TimesheetCharts;
  userTable: TimesheetUser[];
}

export interface TimesheetSummaryDetails {
  startDate: string;
  endDate: string;
  missingTimesheetsCount: number;
}

export interface TimesheetCharts {
  pieChart: PieChartData[];
  donutChart: DonutChartData;
}

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}

export interface DonutChartData {
  acceptedTimesheets: DonutChartSegment;
  createdTimesheets: DonutChartSegment;
}

export interface DonutChartSegment {
  percentage: number;
  numerator: number;
  denominator: number;
}

export interface TimesheetUser {
  name: string;
  unconfirmedTimesheets: number;
  confirmedTimesheets: number;
  missingTimesheets: number;
}
