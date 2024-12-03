// export interface ProjectHours {
//   charts: ProjectHoursChart;
// }

export interface ProjectHoursChart {
  barChart: BarChartData[];
}

// export interface BarChartData {
//   projectName: string;
//   value: number;
// }

// export interface Project {
//   projectId: number;
//   project: string;
// }

export interface projectHoursChartData {
  projectId: number;
  projectName: string;
  hours: number;
}

export interface BarChartData {
  projectName: string;
  value: number;
}

// export interface ProjectHours {
//   projects: BarChartData[];
// }

export interface ProjectSummary {
  startDate: string; // Format: YYYY-MM-DD
  endDate: string; // Format: YYYY-MM-DD
}

export interface Project {
  projectId: number;
  projectName: string;
  hours: number;
  color: string; // Hex color code
}

export interface ProjectHours {
  summary: ProjectSummary;
  projects: Project[];
}
