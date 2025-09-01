import React from 'react';
import { CategoryData } from '../../types/booking';
import { getAllBranches } from '../../services/branchConfig';
import { ExportButtons } from '../common/ExportButtons';
import { exportToCSV, exportToPNG, formatCategoryDataForCSV } from '../../utils/exportUtils';

interface CategorySummaryProps {
  data: CategoryData[];
  isLoading?: boolean;
}

export const CategorySummary: React.FC<CategorySummaryProps> = ({ data, isLoading }) => {
  const branches = getAllBranches();

  const handleExportCSV = () => {
    const csvData = formatCategoryDataForCSV(data, branches);
    exportToCSV(csvData, `สรุปการจองตามรุ่น_${new Date().toLocaleDateString('th-TH')}`);
  };

  const handleExportPNG = () => {
    exportToPNG('category-summary-table', `สรุปการจองตามรุ่น_${new Date().toLocaleDateString('th-TH')}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">กำลังโหลดข้อมูลรุ่น...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">ไม่มีข้อมูลการจองตามรุ่นในขณะนี้</p>
      </div>
    );
  }

  return (
    <div id="category-summary-table" className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">สรุปการจองตามรุ่น (รายวัน)</h2>
            <p className="text-green-100">รุ่นที่ลูกค้าจองในแต่ละวันของแต่ละสาขา</p>
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
                {branches.slice(0, 15).map((branch) => (
                  <th
                    key={branch.id}
                    className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[80px]"
                  >
                    <span className="text-xs">
                      ID{branch.id}
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider bg-blue-50 border-l-2 border-gray-200">
                  รวม
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.slice(0, 20).map((item, index) => (
                <tr key={item.model} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="sticky left-0 bg-white px-4 py-3 whitespace-nowrap border-r-2 border-gray-200 z-10">
                    <div className="text-sm font-medium text-gray-900 max-w-[200px]">
                      {item.model}
                    </div>
                    <div className="text-xs text-gray-500">
                      อันดับ {index + 1}
                    </div>
                  </td>
                  {branches.slice(0, 15).map((branch) => {
                    const count = item.branches[branch.id] || 0;
                    return (
                      <td key={branch.id} className="px-3 py-3 text-center">
                        {count > 0 ? (
                          <span className="text-sm font-medium text-gray-900">
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
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-gray-50 px-6 py-4">
        <div className="text-sm text-gray-600">
          <span>แสดง {Math.min(data.length, 20)} รุ่นแรก จาก {data.length} รุ่น จากทั้งหมด 41 สาขา</span>
        </div>
      </div>
    </div>
  );
};