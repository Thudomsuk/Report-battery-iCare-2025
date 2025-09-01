import React from 'react';

interface HeaderProps {
  lastUpdated?: Date;
  isLoading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ lastUpdated, isLoading }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">
            รายงานการจองแบตเตอรี่โปรโมชั่น iCare
          </h1>
          <p className="text-blue-100 text-lg mb-4">
            Battery Booking Promotion Report Dashboard
          </p>
          <div className="flex justify-center items-center space-x-4">
            <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
              <span className="text-sm">สาขาทั้งหมด: </span>
              <span className="font-semibold text-yellow-300">41 สาขา</span>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
              <span className="text-sm">อัพเดททุก: </span>
              <span className="font-semibold text-green-300">2 นาที</span>
            </div>
          </div>
          {lastUpdated && (
            <div className="mt-3 text-sm text-blue-100">
              <span>อัพเดทล่าสุด: {formatDate(lastUpdated)}</span>
              {isLoading && (
                <span className="ml-2 inline-flex items-center">
                  <svg className="animate-spin h-4 w-4 text-yellow-300" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="ml-1">กำลังอัพเดท...</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};