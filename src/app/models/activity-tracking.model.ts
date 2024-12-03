export interface OverallStats {
  overallTrackerHrs: number;
  overallTrackedWorkedHrs: number;
}

export interface ActivityChartData {
  monthId: number;
  cumulativeHours: number;
  totalHours: number;
}

export interface Month {
  monthId: number;
  month: string;
}

export interface ActivityTracking {
  overallStats: OverallStats;
  chartData: ActivityChartData[];
  months: Month[];
}


