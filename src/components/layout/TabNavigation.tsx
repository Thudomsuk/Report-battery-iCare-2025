import React from 'react';

export type TabType = 'totalByCategory' | 'byMonth' | 'dailyBranch' | 'currentVsTarget' | 'interestedCustomers' | 'timeSlotBookings';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { key: TabType; label: string; description: string }[] = [
  {
    key: 'dailyBranch',
    label: 'Daily Branch Summary',
    description: 'ยอดจองจริงรายวัน (30, 31, 1, 2) แต่ละสาขา'
  },
  {
    key: 'currentVsTarget',
    label: 'Current vs Target',
    description: 'ยอดจองจริง (Column P=1) เทียบเป้าหมาย แสดงเปอร์เซ็นต์และยอดขาด'
  },
  {
    key: 'totalByCategory',
    label: 'Total By Category',
    description: 'รุ่น iPhone ที่จองจริง (Column P=1) รวมทุกวันของแต่ละสาขา'
  },
  {
    key: 'byMonth',
    label: 'Summary By Month',
    description: 'ยอดจองแยกตามเดือน (กันยายน/ตุลาคม)'
  },
  {
    key: 'interestedCustomers',
    label: 'Interested Customers',
    description: 'ลูกค้าลงทะเบียนแต่ไม่เลือกวันนัด (สนใจแต่ไม่ทำต่อ)'
  },
  {
    key: 'timeSlotBookings',
    label: 'Time Slot Bookings',
    description: 'การจองแบ่งตามช่วงเวลา (10:00-21:59) วันที่ 30, 31, 1, 2'
  }
];

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="w-full">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`
                whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200
                ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <div className="text-center">
                <div className="font-semibold">{tab.label}</div>
                <div className="text-xs mt-1 opacity-75">{tab.description}</div>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};