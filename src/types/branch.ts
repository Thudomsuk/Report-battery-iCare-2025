export interface Branch {
  id: number;
  name: string;
  sheetId: string;
  link: string;
}

export interface BranchData {
  branch: Branch;
  data: any[];
  lastUpdated: Date;
}