import { BranchData } from '../types/branch';
import { getAllBranches } from './branchConfig';

// Mock data สำหรับทดสอบ - จำลองข้อมูลจาก Google Sheets
export const getMockBranchData = (): BranchData[] => {
  const branches = getAllBranches();
  
  return branches.map(branch => ({
    branch,
    data: generateMockDataForBranch(branch.id),
    lastUpdated: new Date(),
    success: true
  }));
};

const generateMockDataForBranch = (branchId: number) => {
  // จำลองข้อมูล Summary_ByBranch
  const mar = Math.floor(Math.random() * 100) + 20;
  const apr = Math.floor(Math.random() * 600) + 100;
  const may = Math.floor(Math.random() * 400) + 50;
  
  // จำลองข้อมูล iPhone models
  const iPhoneModels = [
    'iPhone 12 / 12 Pro',
    'iPhone 13',
    'iPhone 12 Pro Max',
    'iPhone 11',
    'iPhone 13 Pro Max',
    'iPhone 13 Pro',
    'iPhone 14 Pro',
    'iPhone 14 Pro Max',
    'iPhone 14',
    'iPhone XR',
    'iPhone 11 Pro',
    'iPhone XS',
    'iPhone 13 mini',
    'iPhone 12 mini',
    'iPhone SE (2nd generation)',
    'iPhone 8 Plus',
    'iPhone 7 Plus',
    'iPhone 14 Plus',
    'iPhone 8',
    'iPhone X'
  ];
  
  const mockData = [
    // ข้อมูลสำหรับ Summary_ByBranch
    {
      branch: `ID${branchId}`,
      MAR: mar,
      APR: apr,
      MAY: may,
      September: Math.floor(Math.random() * 300) + 50,
      October: Math.floor(Math.random() * 400) + 100
    }
  ];
  
  // เพิ่มข้อมูลสำหรับแต่ละ iPhone model
  iPhoneModels.forEach(model => {
    const dayData: any = { iPhone: model };
    
    // จำลองข้อมูลรายวัน (สำหรับ Summary_ByCategory)
    for (let day = 20; day <= 23; day++) {
      dayData[`DAY ${day}`] = Math.floor(Math.random() * 30);
    }
    
    // จำลองข้อมูลรวม (สำหรับ SummaryTotal_ByCategory)
    dayData.Total = Math.floor(Math.random() * 200) + 10;
    
    mockData.push(dayData);
  });
  
  return mockData;
};