import { useQuery } from '@tanstack/react-query';
import { fetchAllBranchesData } from '../services/googleSheetsApi';
import { getMockBranchData } from '../services/mockData';
import { getAllBranches } from '../services/branchConfig';

export const useSheetData = () => {
  return useQuery({
    queryKey: ['sheetData'],
    queryFn: async () => {
      try {
        console.log('🔄 Fetching data from Google Apps Script at:', new Date().toLocaleString('th-TH'));
        const realData = await fetchAllBranchesData(getAllBranches());
        
        // Debug: แสดงข้อมูลที่ได้รับ
        if (realData && realData.length > 0) {
          console.log('✅ Received data from', realData.length, 'branches');
          
          // นับจำนวนสาขาที่มีข้อมูล
          const successfulBranches = realData.filter((item: any) => item.success && item.data?.length > 0);
          console.log('📈 Successful branches with data:', successfulBranches.length);
          
          // แสดง sample data
          const firstBranch = successfulBranches[0];
          if (firstBranch) {
            console.log(`📊 Sample from Branch ${firstBranch.branch.id}:`, firstBranch.data?.slice(0, 2));
            console.log(`📋 Column structure:`, firstBranch.data?.[0] ? Object.keys(firstBranch.data[0]) : 'No columns');
            
            // นับ Column P values
            const columnPValues = firstBranch.data?.map((row: any) => row.COUNT || row.count || row.P).filter(Boolean);
            console.log(`🔢 Column P values sample:`, columnPValues?.slice(0, 10));
            const countP1 = firstBranch.data?.filter((row: any) => String(row.COUNT || row.count || row.P).trim() === '1').length || 0;
            const countEmpty = firstBranch.data?.filter((row: any) => {
              const val = row.COUNT || row.count || row.P;
              return val === '' || val === null || val === undefined;
            }).length || 0;
            console.log(`📊 Branch ${firstBranch.branch.id}: Total rows=${firstBranch.data?.length}, P="1"=${countP1}, P=empty=${countEmpty}`);
          }
          
          return realData;
        }
        
        throw new Error('No data received from API');
      } catch (error) {
        console.error('❌ API Error, using Mock Data:', error);
        return getMockBranchData();
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false, // ปิดเพื่อหลีกเลี่ยงปัญหาบนมือถือ
    refetchIntervalInBackground: false, // ปิดเมื่อ tab ไม่ active
    retry: 3,
    retryDelay: (attempt) => Math.pow(2, attempt) * 1000,
  });
};