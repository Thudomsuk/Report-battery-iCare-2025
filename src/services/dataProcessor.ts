import { BookingData, CategoryData, MonthlyData, DailyBookingData, TimeSlotData } from '../types/booking';
import { BranchData } from '../types/branch';

export const processSummaryByBranch = (branchDataList: BranchData[]): BookingData[] => {
  const summaryData: BookingData[] = [];

  branchDataList.forEach(({ branch, data }) => {
    if (!data || data.length === 0) return;

    // Debug: ดูข้อมูลตัวอย่างจาก branch แรก
    if (branch.id === 227) {
      console.log(`Branch ${branch.id} sample data:`, data.slice(0, 3));
      console.log('Available columns:', data[0] ? Object.keys(data[0]) : 'No data');
    }

    let mar = 0, apr = 0, may = 0, total = 0;

    // นับจำนวนการจองจากข้อมูลจริง (คืนกลับมาเหมือนเดิม)
    data.forEach((row: any) => {
      const count = parseInt(row.COUNT || row.count || '1') || 1; // ใช้ Column P (COUNT)
      const day = parseInt(row.DAY || row.day || '0') || 0; // ใช้ Column O (DAY)
      const dateStr = row['วันที่เลือกจอง'] || row['วันที่'] || row.I || ''; // Column I
      
      total += count;
      
      // แยกตามเดือนจากวันที่
      if (dateStr) {
        const dateObj = new Date(dateStr);
        const month = dateObj.getMonth() + 1; // 1-12
        
        if (month === 3) mar += count;      // มีนาคม
        else if (month === 4) apr += count; // เมษายน  
        else if (month === 5) may += count; // พฤษภาคม
      } else if (day >= 18 && day <= 31) {
        // หากไม่มีวันที่ ใช้ DAY แทน (สมมติว่าเป็นเดือนปัจจุบัน)
        may += count; // ใส่ใน พฤษภาคม
      }
    });

    summaryData.push({
      branchId: branch.id,
      branchName: branch.name,
      mar,
      apr,
      may,
      total
    });
  });

  return summaryData.sort((a, b) => b.total - a.total);
};

export const processSummaryByCategory = (branchDataList: BranchData[]): CategoryData[] => {
  const categoryMap = new Map<string, Record<number, number>>();

  branchDataList.forEach(({ branch, data }) => {
    if (!data || data.length === 0) return;

    data.forEach((row: any) => {
      // Debug: ตรวจสอบข้อมูลจาก branch แรก
      if (branch.id === 227 && Math.random() < 0.1) {
        console.log('Category processing - Sample row from branch 227:', row);
        console.log('Available columns:', Object.keys(row));
        console.log('COUNT value:', row.COUNT, 'Model:', row.B || row['เลือกรุ่น iPhone ที่ต้องการเปลี่ยน Battery']);
      }
      
      // ใช้ Column B สำหรับรุ่น iPhone
      const model = row['เลือกรุ่น iPhone ที่ต้องการเปลี่ยน Battery'] || 
                    row['รุ่น iPhone'] || 
                    row.B || 
                    row.iPhone || 
                    '';
      
      if (!model || model === '' || model.toLowerCase().includes('total')) return;

      if (!categoryMap.has(model)) {
        categoryMap.set(model, {});
      }

      const branchData = categoryMap.get(model)!;
      const currentValue = branchData[branch.id] || 0;
      
      // ตรวจหา COUNT จาก Column P - เฉพาะค่า 1 เท่านั้นที่นับ
      let count = 0;
      const countValue = row.COUNT || row.count || row.P || '';
      if (String(countValue).trim() === '1') {
        count = 1;
      }

      branchData[branch.id] = currentValue + count;
    });
  });

  const categoryData: CategoryData[] = Array.from(categoryMap.entries()).map(([model, branches]) => {
    const total = Object.values(branches).reduce((sum, value) => sum + value, 0);
    return { model, branches, total };
  });

  return categoryData.sort((a, b) => b.total - a.total);
};

export const processSummaryTotalByCategory = (branchDataList: BranchData[]): CategoryData[] => {
  // ใช้ข้อมูลเดียวกันกับ processSummaryByCategory 
  // เพราะเป็นการรวมข้อมูลทั้งหมดอยู่แล้ว
  return processSummaryByCategory(branchDataList);
};

export const processSummaryByMonth = (branchDataList: BranchData[]): MonthlyData[] => {
  const monthlyData: MonthlyData[] = [];

  branchDataList.forEach(({ branch, data }) => {
    if (!data || data.length === 0) return;

    let september = 0, october = 0;

    data.forEach((row: any) => {
      const count = parseInt(row.COUNT || row.count || '1') || 1;
      const dateStr = row['วันที่เลือกจอง'] || row['วันที่'] || row.I || '';
      
      if (dateStr) {
        const dateObj = new Date(dateStr);
        const month = dateObj.getMonth() + 1; // 1-12
        
        if (month === 9) september += count;      // กันยายน
        else if (month === 10) october += count; // ตุลาคม
      }
    });

    monthlyData.push({
      branchId: branch.id,
      branchName: branch.name,
      september,
      october,
      total: september + october
    });
  });

  return monthlyData.sort((a, b) => b.total - a.total);
};

export const processDailyBookingData = (branchDataList: BranchData[]): DailyBookingData[] => {
  console.log('📊 Processing Daily Booking Data for', branchDataList.length, 'branches');
  const dailyData: DailyBookingData[] = [];

  branchDataList.forEach(({ branch, data }) => {
    if (!data || data.length === 0) return;

    let day30 = 0, day31 = 0, day1 = 0, day2 = 0;

    data.forEach((row: any) => {
      // Debug: ตรวจสอบ structure ของ row
      if (branch.id === 227 && Math.random() < 0.1) { // แสดง 10% ของข้อมูลเพื่อ debug
        console.log('Daily processing - Sample row from branch 227:', row);
        console.log('Available columns:', Object.keys(row));
        console.log('DAY value:', row.DAY, 'COUNT value:', row.COUNT);
        console.log('All possible day values:', {
          DAY: row.DAY,
          O: row.O,
          DAY30: row.DAY30,
          DAY31: row.DAY31,
          DAY1: row.DAY1,
          DAY2: row.DAY2
        });
      }
      
      // ตรวจหา COUNT จาก Column P - เฉพาะค่า 1 เท่านั้นที่นับ (คืนกลับมาเหมือนเดิม)
      let count = 0;
      const countValue = row.COUNT || row.count || row.P || '';
      if (String(countValue).trim() === '1') {
        count = 1;
      }
      
      // ตรวจสอบ DAY column สำหรับวันที่
      const dayValue = row.DAY || row.O || row.DAY30 || row.DAY31 || row.DAY1 || row.DAY2 || '';
      const dayStr = String(dayValue).toLowerCase().trim();
      
      // นับตาม column O
      if (dayStr === '30' || dayStr === 'day30') {
        day30 += count;
      } else if (dayStr === '31' || dayStr === 'day31') {
        day31 += count;
      } else if (dayStr === '1' || dayStr === 'day1') {
        day1 += count;
      } else if (dayStr === '2' || dayStr === 'day2') {
        day2 += count;
      }
    });

    const total = day30 + day31 + day1 + day2;
    
    // Debug: แสดงผลลัพธ์การประมวลผลของแต่ละสาขา
    if (branch.id === 227 || total > 0) {
      console.log(`📈 Branch ${branch.id} (${branch.name}): Day30=${day30}, Day31=${day31}, Day1=${day1}, Day2=${day2}, Total=${total}`);
    }
    
    dailyData.push({
      branchId: branch.id,
      branchName: branch.name,
      day30,
      day31,
      day1,
      day2,
      total
    });
  });

  return dailyData.sort((a, b) => b.total - a.total);
};

export const processTimeSlotData = (branchDataList: BranchData[]): TimeSlotData[] => {
  // Initialize all 6 time slots to ensure they appear even with 0 bookings
  const timeSlots: Record<string, { day30: number; day31: number; day1: number; day2: number }> = {
    '10:00-11:59': { day30: 0, day31: 0, day1: 0, day2: 0 },
    '12:00-13:59': { day30: 0, day31: 0, day1: 0, day2: 0 },
    '14:00-15:59': { day30: 0, day31: 0, day1: 0, day2: 0 },
    '16:00-17:59': { day30: 0, day31: 0, day1: 0, day2: 0 },
    '18:00-19:59': { day30: 0, day31: 0, day1: 0, day2: 0 },
    '20:00-21:59': { day30: 0, day31: 0, day1: 0, day2: 0 }
  };

  branchDataList.forEach(({ data }) => {
    if (!data || data.length === 0) return;

    data.forEach((row: any) => {
      // สำหรับ Time Slot Summary ใช้ข้อมูลทั้งหมด ไม่ว่าจะมี Column P หรือไม่
      let count = 1; // นับทุกรายการที่มีการลงทะเบียน
      
      const timestamp = row['ประทับเวลา'] || row.A || ''; // Column A
      const day = row.DAY || row.O || row.DAY30 || row.DAY31 || row.DAY1 || row.DAY2 || ''; // Column DAY หรือ O

      if (!timestamp) return;

      // แยกเวลาจาก timestamp
      let timeSlot = 'ไม่ระบุ';
      if (timestamp) {
        const timeMatch = timestamp.match(/(\d{1,2}):(\d{2})/);
        if (timeMatch) {
          const hour = parseInt(timeMatch[1]);
          
          if (hour >= 10 && hour < 12) timeSlot = '10:00-11:59';
          else if (hour >= 12 && hour < 14) timeSlot = '12:00-13:59';
          else if (hour >= 14 && hour < 16) timeSlot = '14:00-15:59';
          else if (hour >= 16 && hour < 18) timeSlot = '16:00-17:59';
          else if (hour >= 18 && hour < 20) timeSlot = '18:00-19:59';
          else if (hour >= 20 && hour < 22) timeSlot = '20:00-21:59';
          else return; // Skip นอกเวลา entries to focus on the 6 main time slots
        }
      }


      const dayStr = String(day).toLowerCase().trim();
      if (dayStr === '30' || dayStr === 'day30') {
        timeSlots[timeSlot].day30 += count;
      } else if (dayStr === '31' || dayStr === 'day31') {
        timeSlots[timeSlot].day31 += count;
      } else if (dayStr === '1' || dayStr === 'day1') {
        timeSlots[timeSlot].day1 += count;
      } else if (dayStr === '2' || dayStr === 'day2') {
        timeSlots[timeSlot].day2 += count;
      }
    });
  });

  const result: TimeSlotData[] = Object.entries(timeSlots).map(([timeSlot, data]) => ({
    timeSlot,
    day30: data.day30,
    day31: data.day31,
    day1: data.day1,
    day2: data.day2,
    total: data.day30 + data.day31 + data.day1 + data.day2
  }));

  return result.sort((a, b) => b.total - a.total);
};

export const processInterestedCustomersData = (branchDataList: BranchData[]): DailyBookingData[] => {
  console.log('📊 Processing Interested Customers Data for', branchDataList.length, 'branches');
  const interestedData: DailyBookingData[] = [];

  branchDataList.forEach(({ branch, data }) => {
    if (!data || data.length === 0) return;

    let day30 = 0, day31 = 0, day1 = 0, day2 = 0;

    data.forEach((row: any) => {
      // นับเฉพาะรายการที่ Column P (COUNT) ว่างเปล่า = ลูกค้าสนใจแต่ไม่ได้เลือกวันนัด
      const countValue = row.COUNT || row.count || row.P || '';
      const isEmpty = String(countValue).trim() === '' || countValue === null || countValue === undefined;
      
      if (!isEmpty) return; // ข้ามรายการที่มีค่า COUNT
      
      let count = 1; // นับ 1 สำหรับลูกค้าที่สนใจ
      
      // ตรวจสอบ DAY column สำหรับวันที่
      const dayValue = row.DAY || row.O || row.DAY30 || row.DAY31 || row.DAY1 || row.DAY2 || '';
      const dayStr = String(dayValue).toLowerCase().trim();
      
      // นับตาม column O
      if (dayStr === '30' || dayStr === 'day30') {
        day30 += count;
      } else if (dayStr === '31' || dayStr === 'day31') {
        day31 += count;
      } else if (dayStr === '1' || dayStr === 'day1') {
        day1 += count;
      } else if (dayStr === '2' || dayStr === 'day2') {
        day2 += count;
      }
    });

    const total = day30 + day31 + day1 + day2;
    
    // Debug: แสดงผลลัพธ์การประมวลผลของแต่ละสาขา
    if (branch.id === 227 || total > 0) {
      console.log(`💡 Interested Customers Branch ${branch.id} (${branch.name}): Day30=${day30}, Day31=${day31}, Day1=${day1}, Day2=${day2}, Total=${total}`);
    }
    
    interestedData.push({
      branchId: branch.id,
      branchName: branch.name,
      day30,
      day31,
      day1,
      day2,
      total
    });
  });

  return interestedData.sort((a, b) => b.total - a.total);
};