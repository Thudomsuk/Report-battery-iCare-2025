import React from 'react';
import { MonthlyData } from '../../types/booking';
import { getBranchById } from '../../services/branchConfig';
import { ExportButtons } from '../common/ExportButtons';
import { exportToCSV, exportToPNG, formatMonthlyDataForCSV } from '../../utils/exportUtils';

interface MonthlySummaryProps {
  data: MonthlyData[];
  isLoading?: boolean;
}

export const MonthlySummary: React.FC<MonthlySummaryProps> = ({ data, isLoading }) => {
  const handleExportCSV = () => {
    const csvData = formatMonthlyDataForCSV(data);
    exportToCSV(csvData, `สรุปการจองตามเดือน_${new Date().toLocaleDateString('th-TH')}`);
  };

  const handleExportPNG = () => {
    exportToPNG('monthly-summary-table', `สรุปการจองตามเดือน_${new Date().toLocaleDateString('th-TH')}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">กำลังโหลดข้อมูลรายเดือน...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">ไม่มีข้อมูลการจองรายเดือนในขณะนี้</p>
      </div>
    );
  }

  const totalSeptember = data.reduce((sum, item) => sum + item.september, 0);
  const totalOctober = data.reduce((sum, item) => sum + item.october, 0);
  const grandTotal = totalSeptember + totalOctober;

  return (
    <div id="monthly-summary-table" className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-4">สรุปการจองตามเดือน</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-orange-100">
              <div>
                <div className="text-sm">กันยายน</div>
                <div className="text-lg font-bold text-yellow-300">{totalSeptember.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm">ตุลาคม</div>
                <div className="text-lg font-bold text-yellow-300">{totalOctober.toLocaleString()}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm">รวมทั้งสิ้น</div>
                <div className="text-xl font-bold text-yellow-300">{grandTotal.toLocaleString()}</div>
              </div>
            </div>
          </div>
          <ExportButtons 
            onExportCSV={handleExportCSV}
            onExportPNG={handleExportPNG}
            className="no-print"
          />
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
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider bg-orange-50">
                กันยายน 2024
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider bg-red-50">
                ตุลาคม 2024
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider bg-blue-50">
                รวม
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                สัดส่วน (ก.ย./ต.ค.)
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ดูรายละเอียด
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => {
              const branch = getBranchById(item.branchId);
              const isTopPerformer = index < 3;
              const septemberPercent = item.total > 0 ? (item.september / item.total * 100) : 0;
              const octoberPercent = item.total > 0 ? (item.october / item.total * 100) : 0;
              
              return (
                <tr 
                  key={item.branchId} 
                  className={`hover:bg-gray-50 transition-colors duration-150 ${
                    isTopPerformer ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''
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
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-gray-900">
                      {item.september.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-gray-900">
                      {item.october.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-lg font-bold text-blue-900">
                      {item.total.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-xs space-y-1">
                      <div className="text-orange-600 font-medium">
                        {septemberPercent.toFixed(1)}%
                      </div>
                      <div className="text-red-600 font-medium">
                        {octoberPercent.toFixed(1)}%
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {branch && (
                      <a
                        href={branch.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
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
          </tbody>
        </table>
      </div>
      
      <div className="bg-gray-50 px-6 py-4">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>แสดง {data.length} สาขาจากทั้งหมด 41 สาขา</span>
          <span>อัพเดทข้อมูลทุก 2 นาที</span>
        </div>
      </div>
    </div>
  );
};