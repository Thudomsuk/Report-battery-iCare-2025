import React from 'react';
import { CategoryData } from '../../types/booking';
import { getAllBranches } from '../../services/branchConfig';
import { ExportButtons } from '../common/ExportButtons';
import { exportToCSV, exportToPNG, formatTotalCategoryDataForCSV } from '../../utils/exportUtils';

interface TotalCategoryProps {
  data: CategoryData[];
  isLoading?: boolean;
}

export const TotalCategory: React.FC<TotalCategoryProps> = ({ data, isLoading }) => {
  const allBranches = getAllBranches();
  
  // Calculate total bookings per branch across all iPhone models
  const branchTotals = allBranches.map(branch => {
    const total = data.reduce((sum, item) => sum + (item.branches[branch.id] || 0), 0);
    return { ...branch, total };
  });
  
  // Sort branches by total bookings (high to low)
  const branches = branchTotals.sort((a, b) => b.total - a.total);

  const handleExportCSV = () => {
    const csvData = formatTotalCategoryDataForCSV(data);
    exportToCSV(csvData, `สรุปการจองตามรุ่นรวม_${new Date().toLocaleDateString('th-TH')}`);
  };

  const handleExportPNG = () => {
    exportToPNG('total-category-table', `สรุปการจองตามรุ่นรวม_${new Date().toLocaleDateString('th-TH')}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">กำลังโหลดข้อมูลรุ่นรวม...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">ไม่มีข้อมูลการจองรวมตามรุ่นในขณะนี้</p>
      </div>
    );
  }

  const totalAllBookings = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <div id="total-category-table" className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">สรุปการจองตามรุ่น (รวมทั้งหมด)</h2>
            <p className="text-purple-100">รุ่นทั้งหมดรวมทุกวันของแต่ละสาขา - ทั้งหมด {totalAllBookings.toLocaleString()} ครั้ง</p>
          </div>
          <ExportButtons 
            onExportCSV={handleExportCSV}
            onExportPNG={handleExportPNG}
            className="no-print"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="sticky left-0 bg-gray-100 px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r-2 border-gray-200 z-10">
                  รุ่น iPhone
                </th>
                {branches.map((branch) => (
                  <th
                    key={branch.id}
                    className="px-2 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[60px]"
                    title={branch.name}
                  >
                    <span className="text-xs">ID{branch.id}</span>
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider bg-blue-50 border-l-2 border-gray-200">
                  รวม
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={item.model} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="sticky left-0 bg-white px-4 py-3 whitespace-nowrap border-r-2 border-gray-200 z-10">
                    <div className="text-sm font-medium text-gray-900 max-w-[200px]">
                      {item.model}
                    </div>
                    <div className="text-xs text-gray-500">
                      อันดับ {index + 1}
                    </div>
                  </td>
                  {branches.map((branch) => {
                    const count = item.branches[branch.id] || 0;
                    return (
                      <td key={branch.id} className="px-2 py-3 text-center">
                        {count > 0 ? (
                          <span className="text-xs font-medium text-gray-900">
                            {count}
                          </span>
                        ) : (
                          <span className="text-gray-300 text-xs">-</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center bg-blue-50 border-l-2 border-gray-200">
                    <span className="text-lg font-bold text-blue-900">
                      {item.total.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
              {/* Branch Totals Row */}
              <tr className="bg-gradient-to-r from-blue-100 to-indigo-100 border-t-2 border-blue-300">
                <td className="sticky left-0 bg-blue-100 px-4 py-3 whitespace-nowrap border-r-2 border-blue-300 z-10">
                  <div className="text-sm font-bold text-blue-900">
                    รวมทุกรุ่น
                  </div>
                  <div className="text-xs text-blue-600">
                    Total All Models
                  </div>
                </td>
                {branches.map((branch) => (
                  <td key={branch.id} className="px-2 py-3 text-center">
                    <span className="text-sm font-bold text-blue-900">
                      {branch.total.toLocaleString()}
                    </span>
                  </td>
                ))}
                <td className="px-4 py-3 text-center bg-blue-200 border-l-2 border-blue-300">
                  <span className="text-xl font-bold text-blue-900">
                    {totalAllBookings.toLocaleString()}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-gray-50 px-6 py-4">
        <div className="text-sm text-gray-600">
          <span>แสดง {data.length} รุ่น จากทั้งหมด 41 สาขา</span>
        </div>
      </div>
    </div>
  );
};