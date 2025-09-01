import React from 'react';
import { TimeSlotData } from '../../types/booking';
import { ExportButtons } from '../common/ExportButtons';
import { exportToCSV, exportToPNG } from '../../utils/exportUtils';

interface TimeSlotSummaryProps {
  data: TimeSlotData[];
  isLoading?: boolean;
}

export const TimeSlotSummary: React.FC<TimeSlotSummaryProps> = ({ data, isLoading }) => {
  const totals = data.reduce((acc, item) => ({
    day30: acc.day30 + item.day30,
    day31: acc.day31 + item.day31,
    day1: acc.day1 + item.day1,
    day2: acc.day2 + item.day2,
    total: acc.total + item.total
  }), { day30: 0, day31: 0, day1: 0, day2: 0, total: 0 });

  const handleExportCSV = () => {
    const csvData = data.map((item, index) => ({
      'อันดับ': index + 1,
      'ช่วงเวลา': item.timeSlot,
      'วันที่ 30': item.day30,
      'วันที่ 31': item.day31,
      'วันที่ 1': item.day1,
      'วันที่ 2': item.day2,
      'รวม': item.total,
      'เปอร์เซ็นต์': ((item.total / totals.total) * 100).toFixed(1) + '%'
    }));
    
    exportToCSV(csvData, `สรุปการจองตามช่วงเวลา_${new Date().toLocaleDateString('th-TH')}`);
  };

  const handleExportPNG = () => {
    exportToPNG('timeslot-summary-table', `สรุปการจองตามช่วงเวลา_${new Date().toLocaleDateString('th-TH')}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">กำลังโหลดข้อมูลช่วงเวลา...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">ไม่มีข้อมูลการจองตามช่วงเวลาในขณะนี้</p>
      </div>
    );
  }

  return (
    <div id="timeslot-summary-table" className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">สรุปการจองตามช่วงเวลา</h2>
            <p className="text-teal-100">ช่วงเวลาที่ลูกค้าลงทะเบียนในแต่ละวัน (ตาม Timestamp)</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 text-teal-100">
              <div>
                <div className="text-sm">วันที่ 30</div>
                <div className="text-lg font-bold text-yellow-300">{totals.day30.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm">วันที่ 31</div>
                <div className="text-lg font-bold text-yellow-300">{totals.day31.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm">วันที่ 1</div>
                <div className="text-lg font-bold text-yellow-300">{totals.day1.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm">วันที่ 2</div>
                <div className="text-lg font-bold text-yellow-300">{totals.day2.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm">รวมทั้งสิ้น</div>
                <div className="text-xl font-bold text-yellow-300">{totals.total.toLocaleString()}</div>
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
                ช่วงเวลา
              </th>
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
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider bg-blue-50">
                รวม
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                เปอร์เซ็นต์
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => {
              const percentage = ((item.total / totals.total) * 100);
              const isTopPerformer = index < 3;
              
              return (
                <tr 
                  key={item.timeSlot} 
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
                      {item.timeSlot}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getTimeIcon(item.timeSlot)} {getTimeDescription(item.timeSlot)}
                    </div>
                  </td>
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
                    <span className="text-lg font-bold text-blue-900">
                      {item.total.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="bg-gray-50 px-6 py-4">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>แสดง {data.length} ช่วงเวลา จากทั้งหมด 41 สาขา</span>
          <span>ข้อมูลจาก Column A (ประทับเวลา)</span>
        </div>
      </div>
    </div>
  );
};

const getTimeIcon = (timeSlot: string) => {
  if (timeSlot === 'นอกเวลา') return '⏰';
  const hour = parseInt(timeSlot.split(':')[0]);
  if (hour >= 10 && hour < 12) return '🌅';
  if (hour >= 12 && hour < 14) return '☀️';
  if (hour >= 14 && hour < 16) return '🌞';
  if (hour >= 16 && hour < 18) return '🌤️';
  if (hour >= 18 && hour < 20) return '🌇';
  if (hour >= 20 && hour < 22) return '🌃';
  return '⏰';
};

const getTimeDescription = (timeSlot: string) => {
  if (timeSlot === 'นอกเวลา') return 'นอกเวลาทำการ';
  const hour = parseInt(timeSlot.split(':')[0]);
  if (hour >= 10 && hour < 12) return 'เช้าสาย';
  if (hour >= 12 && hour < 14) return 'เที่ยงวัน';
  if (hour >= 14 && hour < 16) return 'บ่ายต้น';
  if (hour >= 16 && hour < 18) return 'บ่ายเย็น';
  if (hour >= 18 && hour < 20) return 'ช่วงเย็น';
  if (hour >= 20 && hour < 22) return 'ค่ำคืน';
  return 'นอกเวลา';
};