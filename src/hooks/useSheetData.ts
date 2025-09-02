import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { fetchAllBranchesData } from '../services/googleSheetsApi';
import { getMockBranchData } from '../services/mockData';
import { getAllBranches } from '../services/branchConfig';
import { useOnlineStatus } from './useOnlineStatus';

export const useSheetData = () => {
  const isOnline = useOnlineStatus();
  const wasOfflineRef = useRef(!isOnline);
  
  const query = useQuery({
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
        console.error('❌ API Error:', error);
        
        // เมื่อออฟไลน์ ไม่ให้ใช้ Mock Data ที่เป็น 0 
        // แต่ให้ throw error เพื่อให้ React Query ใช้ cached data แทน
        if (!isOnline) {
          console.log('📵 Offline detected - preserving cached data');
          throw error; // ให้ React Query ใช้ cached data
        }
        
        // เมื่อออนไลน์แต่ API error ให้ใช้ Mock Data
        console.log('🔄 Using Mock Data as fallback');
        return getMockBranchData();
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: isOnline ? 2 * 60 * 1000 : false, // หยุด auto-refresh เมื่อออฟไลน์
    refetchOnWindowFocus: false, // ปิดเพื่อหลีกเลี่ยงปัญหาบนมือถือ
    refetchIntervalInBackground: false, // ปิดเมื่อ tab ไม่ active
    networkMode: 'offlineFirst', // ใช้ cached data เมื่อออฟไลน์
    retry: (failureCount) => {
      // ไม่ retry เมื่อออฟไลน์
      if (!isOnline) return false;
      return failureCount < 3;
    },
    retryDelay: (attempt) => Math.pow(2, attempt) * 1000,
  });

  // Auto-refetch เมื่อกลับมาออนไลน์
  useEffect(() => {
    if (isOnline && wasOfflineRef.current) {
      console.log('🌐 Back online - auto refreshing data');
      query.refetch();
    }
    wasOfflineRef.current = !isOnline;
  }, [isOnline, query]);

  return query;
};