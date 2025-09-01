import React from 'react';
import { TimeSlotData } from '../../types/booking';
import { LoadingSpinner } from '../layout/LoadingSpinner';

interface TimeSlotBookingsProps {
  data: TimeSlotData[];
  isLoading: boolean;
}

export const TimeSlotBookings: React.FC<TimeSlotBookingsProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return <LoadingSpinner size="md" message="กำลังประมวลผลข้อมูลช่วงเวลา..." />;
  }

  const grandTotal = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">📅 การจองแบ่งตามช่วงเวลา</h2>
          <div className="text-sm text-gray-600">
            รวมทั้งหมด: <span className="font-bold text-blue-600">{grandTotal}</span> รายการ
          </div>
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          สรุปการจองตามช่วงเวลาวันที่ 30, 31, 1, 2 (ช่วงเวลา 10:00-21:59)
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ช่วงเวลา
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  วันที่ 30
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  วันที่ 31
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  วันที่ 1
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  วันที่ 2
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">
                  รวม
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-green-50">
                  %
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => {
                const percentage = grandTotal > 0 ? ((item.total / grandTotal) * 100).toFixed(1) : '0.0';
                return (
                  <tr key={item.timeSlot} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.timeSlot}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {item.day30}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {item.day31}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {item.day1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {item.day2}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.total}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        {percentage}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            ไม่มีข้อมูลการจองในช่วงเวลาที่กำหนด
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">วันที่ 30</div>
          <div className="text-2xl font-bold text-blue-600">
            {data.reduce((sum, item) => sum + item.day30, 0)}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">วันที่ 31</div>
          <div className="text-2xl font-bold text-purple-600">
            {data.reduce((sum, item) => sum + item.day31, 0)}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">วันที่ 1</div>
          <div className="text-2xl font-bold text-green-600">
            {data.reduce((sum, item) => sum + item.day1, 0)}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">วันที่ 2</div>
          <div className="text-2xl font-bold text-orange-600">
            {data.reduce((sum, item) => sum + item.day2, 0)}
          </div>
        </div>
      </div>

      {/* Peak Time Analysis */}
      {data.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 วิเคราะห์ช่วงเวลายอดนิยม</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">ช่วงเวลายอดนิยม:</h4>
              <div className="text-lg font-bold text-blue-600">
                {data[0]?.timeSlot} ({data[0]?.total} รายการ)
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">ช่วงเวลาที่นิยมน้อยที่สุด:</h4>
              <div className="text-lg font-bold text-gray-600">
                {data[data.length - 1]?.timeSlot} ({data[data.length - 1]?.total} รายการ)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};