"use client";
import { baseNames,BaseKey } from '@/utils/baseMapping';
import React from 'react';
import { Clock, MailCheck, Pin } from 'lucide-react';

interface Log {
  userInfo: {
    email: string;
  };
  base_number: any;
  timestamp: string; // Or use 'number' if timestamp is a UNIX timestamp
}

interface ScanHistoryProps {
  initialLogs: Log[];
}

const ScanHistory: React.FC<ScanHistoryProps> = ({ initialLogs }) => {
  const convertToThailandTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("th-TH", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-xl h-[648px] flex flex-col">
      <div className="p-4 border-b flex items-center justify-between translate-y-1">
        <h1 className="text-xl text-blue-800 ">ประวัติการแสกน</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {initialLogs.map((log, index) => (
          
          <div key={index} className="p-2 bg-gray-100 rounded-lg shadow-sm mb-2 text-xs space-y-1">
            <div><MailCheck className='w-4 h-4 inline-block text-blue-700' /> : {log.userInfo.email}</div>
            <div><Pin className='w-4 h-4 inline-block text-blue-700' /> : {baseNames[log.base_number as BaseKey]}</div>
            <div><Clock className='w-4 h-4 inline-block text-blue-700' /> : {convertToThailandTime(log.timestamp)}</div>
          </div>
        ))}
        {initialLogs.length === 0 && <p>ไม่มีประวัติการแสกน</p>}
      </div>
    </div>
  );
};

export default ScanHistory;
