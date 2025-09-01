import React from 'react';
import { BranchData } from '../../types/branch';
import { ExportButtons } from '../common/ExportButtons';
import { exportToCSV, exportToPNG } from '../../utils/exportUtils';

interface CurrentVsTargetData {
  branchId: number;
  branchName: string;
  current: number;
  target: number;
  progress: number;
  remaining: number;
}

interface CurrentVsTargetProps {
  branchDataList: BranchData[];
}

const processCurrentVsTargetData = (branchDataList: BranchData[]): CurrentVsTargetData[] => {
  const targetData: CurrentVsTargetData[] = [];

  branchDataList.forEach(({ branch, data }) => {
    if (!data || data.length === 0) {
      console.log(`⚠️ Branch ${branch.id} (${branch.name}): No data available`);
      return;
    }

    // นับจำนวนการจองปัจจุบัน (เฉพาะ Column P = '1')
    let current = 0;
    data.forEach((row: any) => {
      const countValue = row.COUNT || row.count || row.P || '';
      if (String(countValue).trim() === '1') {
        current += 1;
      }
    });

    // เป้าหมายแต่ละสาขา
    const target = getTargetForBranch(branch.id);
    const progress = target > 0 ? Math.round((current / target) * 100) : 0;
    const remaining = target - current > 0 ? target - current : 0;

    console.log(`📊 Branch ${branch.id} (${branch.name}): current=${current}, target=${target}, progress=${progress}%`);

    targetData.push({
      branchId: branch.id,
      branchName: branch.name,
      current,
      target,
      progress,
      remaining
    });
  });

  return targetData.sort((a, b) => b.progress - a.progress);
};

const getTargetForBranch = (branchId: number): number => {
  // เป้าหมายตามตารางที่ให้มา
  const targetMap: Record<number, number> = {
    227: 985,
602: 236,
603: 350,
606: 588,
614: 831,
615: 1327,
616: 304,
617: 410,
628: 500,
630: 454,
638: 978,
641: 94,
658: 928,
678: 997,
688: 291,
711: 306,
718: 615,
721: 272,
731: 280,
739: 490,
769: 1207,
897: 508,
1118: 727,
1561: 519,
1625: 306,
1704: 649,
1786: 160,
1989: 424,
2303: 1262,
2304: 194,
2305: 383,
2306: 379,
2307: 350,
2352: 179,
2353: 126,
2547: 691,
2548: 159,
2559: 80,
2573: 462,
2774: 200,
2811: 300
  };
  
  return targetMap[branchId] || 100; // เป้าหมายเริ่มต้น 100
};


export const CurrentVsTarget: React.FC<CurrentVsTargetProps> = ({ branchDataList }) => {
  const data = processCurrentVsTargetData(branchDataList);
  const totalCurrent = data.reduce((sum, item) => sum + item.current, 0);
  const totalTarget = data.reduce((sum, item) => sum + item.target, 0);
  const totalProgress = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;
  const totalRemaining = totalTarget - totalCurrent > 0 ? totalTarget - totalCurrent : 0;

  // Debug logging
  console.log('🎯 Current vs Target Summary:');
  console.log(`Total Current Bookings: ${totalCurrent.toLocaleString()}`);
  console.log(`Total Target: ${totalTarget.toLocaleString()}`);
  console.log(`Total Progress: ${totalProgress}%`);
  console.log(`Total Remaining: ${totalRemaining.toLocaleString()}`);
  console.log('Top 5 branches:', data.slice(0, 5).map(b => `${b.branchName}: ${b.current}/${b.target} (${b.progress}%)`));

  const handleExportCSV = () => {
    const csvData = data.map((item, index) => ({
      'อันดับ': index + 1,
      'สาขา': item.branchName,
      'รหัสสาขา': `ID${item.branchId}`,
      'ปัจจุบัน': item.current,
      'เป้าหมาย': item.target,
      'ความสำเร็จ (%)': item.progress,
      'ยังขาดอีก': item.remaining
    }));
    
    const filename = `ยอดจองปัจจุบันเทียบเป้าหมาย_${new Date().toLocaleDateString('th-TH')}`;
    exportToCSV(csvData, filename);
  };

  const handleExportPNG = () => {
    const filename = `ยอดจองปัจจุบันเทียบเป้าหมาย_${new Date().toLocaleDateString('th-TH')}`;
    exportToPNG('current-vs-target-table', filename);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            ยอดจองปัจจุบันเทียบเป้าหมาย
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            ยอดที่ทำได้ปัจจุบัน เทียบกับเป้าหมาย เป็นกี่ % ยังขาดอีกจำนวนเท่าไหร่
          </p>
        </div>
        <ExportButtons 
          onExportCSV={handleExportCSV}
          onExportPNG={handleExportPNG}
        />
      </div>

      {/* สรุปภาพรวม */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{totalCurrent.toLocaleString()}</div>
          <div className="text-sm text-blue-700">ยอดจองปัจจุบัน</div>
          <div className="text-xs text-blue-500">Column P = 1</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{totalTarget.toLocaleString()}</div>
          <div className="text-sm text-green-700">เป้าหมายรวม</div>
          <div className="text-xs text-green-500">ทั้ง 41 สาขา</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">{totalProgress}%</div>
          <div className="text-sm text-purple-700">ความสำเร็จ</div>
          <div className="text-xs text-purple-500">เปอร์เซ็นต์รวม</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-600">{totalRemaining.toLocaleString()}</div>
          <div className="text-sm text-red-700">ยังขาดอีก</div>
          <div className="text-xs text-red-500">จำนวนที่ต้องทำเพิ่ม</div>
        </div>
      </div>

      {/* ตารางข้อมูล */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div id="current-vs-target-table" className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สาขา
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ปัจจุบัน
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  เป้าหมาย
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ความสำเร็จ (%)
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ยังขาดอีก
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, index) => (
                <tr key={row.branchId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{row.branchName}</div>
                    <div className="text-xs text-gray-500">ID: {row.branchId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      {row.current.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900">{row.target.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className={`text-lg font-semibold ${
                      row.progress >= 100 ? 'text-green-600' :
                      row.progress >= 80 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {row.progress}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className={`text-lg font-medium ${
                      row.remaining === 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {row.remaining.toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};