import React, { useState, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/layout/Header';
import { TabNavigation, TabType } from './components/layout/TabNavigation';
import { DailyBranchSummary } from './components/reports/DailyBranchSummary';
import { CurrentVsTarget } from './components/reports/CurrentVsTarget';
import { InterestedCustomers } from './components/reports/InterestedCustomers';
import { TotalCategory } from './components/reports/TotalCategory';
import { MonthlySummary } from './components/reports/MonthlySummary';
import { TimeSlotBookings } from './components/reports/TimeSlotBookings';
import { LoadingSpinner } from './components/layout/LoadingSpinner';
import { useSheetData } from './hooks/useSheetData';
import { 
  processSummaryByCategory, 
  processSummaryTotalByCategory, 
  processSummaryByMonth,
  processDailyBookingData,
  processInterestedCustomersData,
  processTimeSlotData
} from './services/dataProcessor';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dailyBranch');
  const { data: branchDataList, isLoading, error, dataUpdatedAt, refetch } = useSheetData();

  const processedData = useMemo(() => {
    if (!branchDataList || branchDataList.length === 0) {
      return {
        byCategory: [],
        totalByCategory: [],
        byMonth: [],
        dailyBranch: [],
        interestedCustomers: [],
        timeSlotBookings: []
      };
    }

    const successfulData = branchDataList.filter((item: any) => item.success && item.data.length > 0);

    return {
      byCategory: processSummaryByCategory(successfulData),
      totalByCategory: processSummaryTotalByCategory(successfulData),
      byMonth: processSummaryByMonth(successfulData),
      dailyBranch: processDailyBookingData(successfulData),
      interestedCustomers: processInterestedCustomersData(successfulData),
      timeSlotBookings: processTimeSlotData(successfulData)
    };
  }, [branchDataList]);

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt) : undefined;

  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    refetch();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">เกิดข้อผิดพลาดในการโหลดข้อมูล</h3>
                <div className="mt-2 text-sm text-red-700">
                  กรุณาตรวจสอบการเชื่อมต่อและลองใหม่อีกครั้ง
                  <div className="mt-2">
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
                    >
                      โหลดใหม่
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header lastUpdated={lastUpdated} isLoading={isLoading} onRefresh={handleRefresh} />
      
      <div className="container mx-auto px-4 py-6">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="mt-6">
          {isLoading && !branchDataList ? (
            <LoadingSpinner size="lg" message="กำลังโหลดข้อมูลจากทุกสาขา..." />
          ) : (
            <>
              
              {activeTab === 'dailyBranch' && (
                <DailyBranchSummary 
                  data={processedData.dailyBranch} 
                  isLoading={isLoading} 
                />
              )}
              
              
              {activeTab === 'currentVsTarget' && (
                <CurrentVsTarget 
                  branchDataList={branchDataList?.filter((item: any) => item.success && item.data.length > 0) || []} 
                />
              )}
              
              {activeTab === 'totalByCategory' && (
                <TotalCategory 
                  data={processedData.totalByCategory} 
                  isLoading={isLoading} 
                />
              )}
              
              {activeTab === 'byMonth' && (
                <MonthlySummary 
                  data={processedData.byMonth} 
                  isLoading={isLoading} 
                />
              )}
              
              {activeTab === 'interestedCustomers' && (
                <InterestedCustomers 
                  data={processedData.interestedCustomers} 
                  isLoading={isLoading} 
                />
              )}
              
              {activeTab === 'timeSlotBookings' && (
                <TimeSlotBookings 
                  data={processedData.timeSlotBookings} 
                  isLoading={isLoading} 
                />
              )}
            </>
          )}
        </div>
        
        {branchDataList && (
          <div className="mt-8 bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="font-medium">สถานะการโหลด:</span>
                  <span className="ml-2">
                    {branchDataList.filter((item: any) => item.success).length} / {branchDataList.length} สาขา
                  </span>
                </div>
                <div>
                  <span className="font-medium">สาขาที่มีข้อมูล:</span>
                  <span className="ml-2">
                    {branchDataList.filter((item: any) => item.success && item.data.length > 0).length} สาขา
                  </span>
                </div>
                <div>
                  <span className="font-medium">โหมดการทำงาน:</span>
                  <span className="ml-2 text-green-600">สด (Real-time)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
};

export default App;