export interface SredSummary {
    summary: SummaryDetails;
    columns: string[];
    rows: SredRow[];
    totals: Totals;
  }
  
  export interface SummaryDetails {
    startDate: string;
    endDate: string;
  }
  
  export interface SredRow {
    name: string;
    trackingScore: number;
    totalWorkedHours: number;
    totalTrackedHours: number;
    new: number;
    fiber: number;
    fdTest: number;
    totalSredHours: number;
    sredPercentage: number;
  }
  
  export interface Totals {
    trackingScore: number;
    totalWorkedHours: number;
    totalTrackedHours: number;
    new: number;
    fiber: number;
    fdTest: number;
    totalSredHours: number;
    sredPercentage: number;
  }
  