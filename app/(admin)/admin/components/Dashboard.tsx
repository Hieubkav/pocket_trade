'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type TimeRange = 'today' | 'week' | 'month' | '3months' | 'year' | 'all';

const timeRangeLabels: Record<TimeRange, string> = {
  today: 'Hôm nay',
  week: '7 ngày',
  month: '30 ngày',
  '3months': '3 tháng',
  year: '1 năm',
  all: 'Tất cả',
};

const generateChartData = (range: TimeRange) => {
  const dataMap: Record<TimeRange, { name: string; visitors: number }[]> = {
    today: [
      { name: '00:00', visitors: 12 },
      { name: '04:00', visitors: 5 },
      { name: '08:00', visitors: 45 },
      { name: '12:00', visitors: 78 },
      { name: '16:00', visitors: 52 },
      { name: '20:00', visitors: 34 },
      { name: '23:00', visitors: 18 },
    ],
    week: [
      { name: 'T2', visitors: 145 },
      { name: 'T3', visitors: 132 },
      { name: 'T4', visitors: 98 },
      { name: 'T5', visitors: 167 },
      { name: 'T6', visitors: 142 },
      { name: 'T7', visitors: 89 },
      { name: 'CN', visitors: 56 },
    ],
    month: [
      { name: '01', visitors: 234 },
      { name: '05', visitors: 312 },
      { name: '10', visitors: 278 },
      { name: '15', visitors: 445 },
      { name: '20', visitors: 389 },
      { name: '25', visitors: 298 },
      { name: '30', visitors: 356 },
    ],
    '3months': [
      { name: 'T10', visitors: 1234 },
      { name: 'T11', visitors: 1567 },
      { name: 'T12', visitors: 1823 },
    ],
    year: [
      { name: 'T1', visitors: 2345 },
      { name: 'T2', visitors: 2567 },
      { name: 'T3', visitors: 2890 },
      { name: 'T4', visitors: 3234 },
      { name: 'T5', visitors: 3567 },
      { name: 'T6', visitors: 3890 },
      { name: 'T7', visitors: 4123 },
      { name: 'T8', visitors: 4456 },
      { name: 'T9', visitors: 4789 },
      { name: 'T10', visitors: 5012 },
      { name: 'T11', visitors: 5345 },
      { name: 'T12', visitors: 5678 },
    ],
    all: [
      { name: '2023', visitors: 45678 },
      { name: '2024', visitors: 72340 },
    ],
  };
  return dataMap[range];
};

const statsData: Record<TimeRange, { visitors: number; pageViews: number; visitorsChange: number; pageViewsChange: number }> = {
  today: { visitors: 244, pageViews: 1563, visitorsChange: 59, pageViewsChange: 24 },
  week: { visitors: 829, pageViews: 4567, visitorsChange: 12, pageViewsChange: 18 },
  month: { visitors: 2312, pageViews: 12890, visitorsChange: 8, pageViewsChange: 15 },
  '3months': { visitors: 4624, pageViews: 28450, visitorsChange: 15, pageViewsChange: 22 },
  year: { visitors: 47890, pageViews: 245670, visitorsChange: 32, pageViewsChange: 45 },
  all: { visitors: 118018, pageViews: 512890, visitorsChange: 0, pageViewsChange: 0 },
};

const topPages = [
  { path: '/', visitors: 188 },
  { path: '/trade', visitors: 116 },
  { path: '/cards', visitors: 72 },
  { path: '/profile', visitors: 61 },
  { path: '/chat', visitors: 44 },
];

const topReferrers = [
  { source: 'm.facebook.com', visitors: 47 },
  { source: 'l.facebook.com', visitors: 35 },
  { source: 'google.com', visitors: 32 },
  { source: 'tiktok.com', visitors: 12 },
  { source: 'Trực tiếp', visitors: 118 },
];

const topCountries = [
  { country: 'Việt Nam', flag: '🇻🇳', percent: 85 },
  { country: 'Indonesia', flag: '🇮🇩', percent: 5 },
  { country: 'Nhật Bản', flag: '🇯🇵', percent: 3 },
  { country: 'Hồng Kông', flag: '🇭🇰', percent: 2 },
  { country: 'Mỹ', flag: '🇺🇸', percent: 2 },
];

const devices = [
  { name: 'Di động', percent: 78 },
  { name: 'Máy tính', percent: 22 },
];

const operatingSystems = [
  { name: 'iOS', percent: 61 },
  { name: 'Android', percent: 27 },
  { name: 'Windows', percent: 17 },
  { name: 'Mac', percent: 4 },
];

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const stats = statsData[timeRange];
  const chartData = generateChartData(timeRange);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Thống kê truy cập</h1>
        <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          {(Object.keys(timeRangeLabels) as TimeRange[]).map((key) => (
            <button
              key={key}
              onClick={() => setTimeRange(key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                timeRange === key
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {timeRangeLabels[key]}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Người truy cập</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.visitors.toLocaleString('vi-VN')}
            </span>
            {stats.visitorsChange !== 0 && (
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${stats.visitorsChange > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                {stats.visitorsChange > 0 ? '+' : ''}{stats.visitorsChange}%
              </span>
            )}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Lượt xem trang</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.pageViews.toLocaleString('vi-VN')}
            </span>
            {stats.pageViewsChange !== 0 && (
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${stats.pageViewsChange > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                {stats.pageViewsChange > 0 ? '+' : ''}{stats.pageViewsChange}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorVisitors)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pages */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Trang được xem</h3>
          <div className="space-y-2">
            {topPages.map((page) => (
              <div key={page.path} className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${(page.visitors / topPages[0].visitors) * 60}%` }}
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400 truncate">{page.path}</span>
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-white ml-2">{page.visitors}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Referrers */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Nguồn truy cập</h3>
          <div className="space-y-2">
            {topReferrers.map((ref) => (
              <div key={ref.source} className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className="h-2 bg-emerald-500 rounded-full"
                    style={{ width: `${(ref.visitors / topReferrers[0].visitors) * 60}%` }}
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400 truncate">{ref.source}</span>
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-white ml-2">{ref.visitors}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Countries */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Quốc gia</h3>
          <div className="space-y-2">
            {topCountries.map((c) => (
              <div key={c.country} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{c.flag}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{c.country}</span>
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{c.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Devices & OS */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Thiết bị</h3>
              <div className="space-y-2">
                {devices.map((d) => (
                  <div key={d.name} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{d.name}</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{d.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Hệ điều hành</h3>
              <div className="space-y-2">
                {operatingSystems.map((os) => (
                  <div key={os.name} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{os.name}</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{os.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
