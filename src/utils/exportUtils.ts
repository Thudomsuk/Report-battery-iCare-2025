import { BookingData, CategoryData, MonthlyData, DailyBookingData, TimeSlotData } from '../types/booking';

// Export ไฟล์ CSV
export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');

  downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
};

// Export ภาพ PNG
export const exportToPNG = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // ใช้ html2canvas (ต้องติดตั้ง)
    const html2canvasModule = await import('html2canvas') as any;
    const html2canvas = html2canvasModule.default || html2canvasModule;
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });
    
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL();
    link.click();
  } catch (error) {
    console.error('Error exporting PNG:', error);
  }
};

// ดาวน์โหลดไฟล์
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// แปลงข้อมูล Summary By Branch เป็น CSV format
export const formatBranchDataForCSV = (data: BookingData[]) => {
  return data.map(item => ({
    'สาขา': item.branchName,
    'รหัสสาขา': `ID${item.branchId}`,
    'มีนาคม': item.mar,
    'เมษายน': item.apr,
    'พฤษภาคม': item.may,
    'รวม': item.total
  }));
};

// แปลงข้อมูล Category เป็น CSV format
export const formatCategoryDataForCSV = (data: CategoryData[], branches: any[]) => {
  return data.map(item => {
    const row: any = {
      'รุ่น iPhone': item.model,
      'รวมทั้งหมด': item.total
    };
    
    branches.slice(0, 15).forEach(branch => {
      row[`ID${branch.id}`] = item.branches[branch.id] || 0;
    });
    
    return row;
  });
};

// แปลงข้อมูล Total Category เป็น CSV format
export const formatTotalCategoryDataForCSV = (data: CategoryData[]) => {
  return data.map(item => ({
    'รุ่น iPhone': item.model,
    'จำนวนการจอง': item.total,
    'เปอร์เซ็นต์': ((item.total / data.reduce((sum, d) => sum + d.total, 0)) * 100).toFixed(1) + '%'
  }));
};

// แปลงข้อมูล Monthly เป็น CSV format
export const formatMonthlyDataForCSV = (data: MonthlyData[]) => {
  return data.map(item => ({
    'สาขา': item.branchName,
    'รหัสสาขา': `ID${item.branchId}`,
    'กันยายน': item.september,
    'ตุลาคม': item.october,
    'รวม': item.total,
    'เปอร์เซ็นต์กันยายน': ((item.september / item.total) * 100).toFixed(1) + '%',
    'เปอร์เซ็นต์ตุลาคม': ((item.october / item.total) * 100).toFixed(1) + '%'
  }));
};

// แปลงข้อมูล Daily Booking เป็น CSV format
export const formatDailyBookingDataForCSV = (data: DailyBookingData[]) => {
  return data.map(item => ({
    'สาขา': item.branchName,
    'รหัสสาขา': `ID${item.branchId}`,
    'วันที่ 30': item.day30,
    'วันที่ 31': item.day31,
    'วันที่ 1': item.day1,
    'วันที่ 2': item.day2,
    'รวม': item.total
  }));
};

// แปลงข้อมูล Time Slot เป็น CSV format
export const formatTimeSlotDataForCSV = (data: TimeSlotData[]) => {
  const total = data.reduce((sum, item) => sum + item.total, 0);
  
  return data.map(item => ({
    'ช่วงเวลา': item.timeSlot,
    'วันที่ 30': item.day30,
    'วันที่ 31': item.day31,
    'วันที่ 1': item.day1,
    'วันที่ 2': item.day2,
    'รวม': item.total,
    'เปอร์เซ็นต์': ((item.total / total) * 100).toFixed(1) + '%'
  }));
};