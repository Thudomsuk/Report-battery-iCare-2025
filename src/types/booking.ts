export interface BookingData {
  branchId: number;
  branchName: string;
  mar: number;
  apr: number;
  may: number;
  total: number;
}

export interface DailyBookingData {
  branchId: number;
  branchName: string;
  day30: number;
  day31: number;
  day1: number;
  day2: number;
  total: number;
}

export interface CategoryData {
  model: string;
  branches: Record<number, number>;
  total: number;
}

export interface MonthlyData {
  branchId: number;
  branchName: string;
  september: number;
  october: number;
  total: number;
}

export interface DailyBooking {
  date: string;
  branchId: number;
  model: string;
  count: number;
}

export interface TimeSlotData {
  timeSlot: string;
  day30: number;
  day31: number;
  day1: number;
  day2: number;
  total: number;
}