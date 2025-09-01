import React, { useState, useMemo } from 'react';
import { DailyBookingData } from '../../types/booking';
import { getBranchById } from '../../services/branchConfig';
import { ExportButtons } from '../common/ExportButtons';
import { exportToCSV, exportToPNG } from '../../utils/exportUtils';

interface InterestedCustomersProps {
  data: DailyBookingData[];
  isLoading?: boolean;
}

export const InterestedCustomers: React.FC<InterestedCustomersProps> = ({ data, isLoading }) => {
  const [selectedDay, setSelectedDay] = useState<'all' | 'day30' | 'day31' | 'day1' | 'day2'>('all');

  const filteredData = useMemo(() => {
    if (selectedDay === 'all') return data;
    
    return data.map(item => {
      const displayValue = item[selectedDay as keyof DailyBookingData] as number;
      return {
        ...item,
        displayValue,
        total: displayValue
      };
    }).sort((a, b) => (b as any).displayValue - (a as any).displayValue);
  }, [data, selectedDay]);

  const totals = useMemo(() => {
    return data.reduce((acc, item) => ({
      day30: acc.day30 + item.day30,
      day31: acc.day31 + item.day31,
      day1: acc.day1 + item.day1,
      day2: acc.day2 + item.day2,
      total: acc.total + item.total
    }), { day30: 0, day31: 0, day1: 0, day2: 0, total: 0 });
  }, [data]);

  const handleExportCSV = () => {
    const csvData = filteredData.map((item, index) => ({
      'อันดับ': index + 1,
      'สาขา': item.branchName,
      'รหัสสาขา': `ID${item.branchId}`,
      ...(selectedDay === 'all' ? {
        'วันที่ 30': item.day30,
        'วันที่ 31': item.day31,
        'วันที่ 1': item.day1,
        'วันที่ 2': item.day2,
        'รวม': item.total
      } : {
        [getDayLabel(selectedDay)]: (item as any).displayValue || 0
      })
    }));
    
    const filename = selectedDay === 'all' 
      ? `ลูกค้าสนใจแต่ไม่เลือกวันนัด_${new Date().toLocaleDateString('th-TH')}`
      : `ลูกค้าสนใจ_${getDayLabel(selectedDay)}_${new Date().toLocaleDateString('th-TH')}`;
    
    exportToCSV(csvData, filename);
  };

  const handleExportPNG = () => {
    const filename = selectedDay === 'all' 
      ? `ลูกค้าสนใจแต่ไม่เลือกวันนัด_${new Date().toLocaleDateString('th-TH')}`
      : `ลูกค้าสนใจ_${getDayLabel(selectedDay)}_${new Date().toLocaleDateString('th-TH')}`;
    
    exportToPNG('interested-customers-table', filename);
  };

  const getDayLabel = (day: string) => {
    switch(day) {
      case 'day30': return 'วันที่ 30';
      case 'day31': return 'วันที่ 31';
      case 'day1': return 'วันที่ 1';
      case 'day2': return 'วันที่ 2';
      default: return 'ทั้งหมด';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        <span className="ml-3 text-gray-600">กำลังโหลดข้อมูลลูกค้าที่สนใจ...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">ไม่มีข้อมูลลูกค้าที่สนใจในขณะนี้</p>
      </div>
    );
  }

  return (
    <div id="interested-customers-table" className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">ลูกค้าลงทะเบียนแต่ไม่เลือกวันนัด</h2>
            <p className="text-orange-100">
              {selectedDay === 'all' 
                ? `ลูกค้าสนใจรวม: ${totals.total.toLocaleString()} คน (สามารถติดต่อเพิ่มเติม)`
                : `ลูกค้าสนใจ${getDayLabel(selectedDay)}: ${totals[selectedDay as keyof typeof totals].toLocaleString()} คน`
              }
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value as any)}
              className="bg-white text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              <option value="all">แสดงทั้งหมด</option>
              <option value="day30">วันที่ 30</option>
              <option value="day31">วันที่ 31</option>
              <option value="day1">วันที่ 1</option>
              <option value="day2">วันที่ 2</option>
            </select>
            <ExportButtons 
              onExportCSV={handleExportCSV}
              onExportPNG={handleExportPNG}
              className="no-print"
            />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                อันดับ
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                สาขา
              </th>
              {selectedDay === 'all' ? (
                <>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider bg-red-50">
                    วันที่ 30
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider bg-yellow-50">
                    วันที่ 31
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider bg-green-50">
                    วันที่ 1
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider bg-purple-50">
                    วันที่ 2
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider bg-orange-50">
                    รวม
                  </th>
                </>
              ) : (
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider bg-orange-50">
                  {getDayLabel(selectedDay)}
                </th>
              )}
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ดูรายละเอียด
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item, index) => {
              const branch = getBranchById(item.branchId);
              const isTopPerformer = index < 3;
              
              return (
                <tr 
                  key={item.branchId} 
                  className={`hover:bg-gray-50 transition-colors duration-150 ${
                    isTopPerformer ? 'bg-gradient-to-r from-orange-50 to-red-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`
                        inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold
                        ${index === 0 ? 'bg-yellow-400 text-yellow-900' : 
                          index === 1 ? 'bg-gray-300 text-gray-700' : 
                          index === 2 ? 'bg-orange-300 text-orange-900' : 
                          'bg-gray-100 text-gray-600'}
                      `}>
                        {index + 1}
                      </span>
                      {index < 3 && (
                        <span className="ml-2 text-lg">
                          {index === 0 ? '🏆' : index === 1 ? '🥈' : '🥉'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      ID{item.branchId}
                    </div>
                    <div className="text-sm text-gray-500 max-w-xs">
                      {item.branchName}
                    </div>
                  </td>
                  {selectedDay === 'all' ? (
                    <>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-gray-900">
                          {item.day30.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-gray-900">
                          {item.day31.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-gray-900">
                          {item.day1.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-gray-900">
                          {item.day2.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-bold text-orange-900">
                          {item.total.toLocaleString()}
                        </span>
                      </td>
                    </>
                  ) : (
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-bold text-orange-900">
                        {((item as any).displayValue || 0).toLocaleString()}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4 text-center">
                    {branch && (
                      <a
                        href={branch.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        ดูใน Sheet
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
            {/* Totals Row */}
            <tr className="bg-gradient-to-r from-orange-100 to-red-100 border-t-2 border-orange-300">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-600 text-white text-sm font-bold">
                    Σ
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-bold text-orange-900">
                  รวมทุกสาขา
                </div>
                <div className="text-sm text-orange-600">
                  Total All Branches
                </div>
              </td>
              {selectedDay === 'all' ? (
                <>
                  <td className="px-6 py-4 text-center">
                    <span className="text-lg font-bold text-orange-900">
                      {totals.day30.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-lg font-bold text-orange-900">
                      {totals.day31.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-lg font-bold text-orange-900">
                      {totals.day1.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-lg font-bold text-orange-900">
                      {totals.day2.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xl font-bold text-orange-900 bg-orange-200 px-3 py-1 rounded">
                      {totals.total.toLocaleString()}
                    </span>
                  </td>
                </>
              ) : (
                <td className="px-6 py-4 text-center">
                  <span className="text-xl font-bold text-orange-900 bg-orange-200 px-3 py-1 rounded">
                    {totals[selectedDay as keyof typeof totals].toLocaleString()}
                  </span>
                </td>
              )}
              <td className="px-6 py-4 text-center">
                <span className="text-sm text-orange-600 font-medium">
                  -
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="bg-gray-50 px-6 py-4">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>แสดง {filteredData.length} สาขาจากทั้งหมด 41 สาขา</span>
          <span>💡 ลูกค้าที่สนใจแต่ยังไม่เลือกวันนัด - สามารถติดต่อเพิ่มเติมได้</span>
        </div>
      </div>
    </div>
  );
};