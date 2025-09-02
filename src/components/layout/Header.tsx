import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

interface HeaderProps {
  lastUpdated?: Date;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ lastUpdated, isLoading, onRefresh }) => {
  const isOnline = useOnlineStatus();
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
            <div className={`bg-white bg-opacity-20 rounded-lg px-4 py-2 flex items-center space-x-2`}>
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-sm">
                {isOnline ? 'ออนไลน์' : 'ออฟไลน์'}
              </span>
            </div>
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 disabled:bg-opacity-10 rounded-lg px-4 py-2 flex items-center space-x-2 transition-all duration-200"
              >
                <svg 
                  className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                  />
                </svg>
                <span className="text-sm">รีเฟรช</span>
              </button>
            )}
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