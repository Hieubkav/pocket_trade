import { query } from "./_generated/server";
import { v } from "convex/values";

const getTimeRangeStart = (range: string): number => {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  
  switch (range) {
    case "today":
      return now - day;
    case "week":
      return now - 7 * day;
    case "month":
      return now - 30 * day;
    case "3months":
      return now - 90 * day;
    case "year":
      return now - 365 * day;
    case "all":
    default:
      return 0;
  }
};

export const getStats = query({
  args: { timeRange: v.string() },
  handler: async (ctx, args) => {
    const startTime = getTimeRangeStart(args.timeRange);
    const previousStartTime = getTimeRangeStart(args.timeRange) - (Date.now() - getTimeRangeStart(args.timeRange));
    
    const allVisitors = await ctx.db.query("visitors").collect();
    
    const currentVisitors = allVisitors.filter(v => v.visitedAt >= startTime);
    const previousVisitors = allVisitors.filter(v => v.visitedAt >= previousStartTime && v.visitedAt < startTime);
    
    const uniqueCurrentIPs = new Set(currentVisitors.map(v => v.ipAddress)).size;
    const uniquePreviousIPs = new Set(previousVisitors.map(v => v.ipAddress)).size;
    
    const visitorsChange = uniquePreviousIPs > 0 
      ? Math.round(((uniqueCurrentIPs - uniquePreviousIPs) / uniquePreviousIPs) * 100) 
      : 0;
    const pageViewsChange = previousVisitors.length > 0 
      ? Math.round(((currentVisitors.length - previousVisitors.length) / previousVisitors.length) * 100) 
      : 0;

    return {
      visitors: uniqueCurrentIPs,
      pageViews: currentVisitors.length,
      visitorsChange,
      pageViewsChange,
    };
  },
});

export const getChartData = query({
  args: { timeRange: v.string() },
  handler: async (ctx, args) => {
    const startTime = getTimeRangeStart(args.timeRange);
    const visitors = await ctx.db.query("visitors").collect();
    const filtered = visitors.filter(v => v.visitedAt >= startTime);
    
    const grouped: Record<string, number> = {};
    
    filtered.forEach(visitor => {
      const date = new Date(visitor.visitedAt);
      let key: string;
      
      switch (args.timeRange) {
        case "today":
          key = `${date.getHours().toString().padStart(2, "0")}:00`;
          break;
        case "week":
          const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
          key = days[date.getDay()];
          break;
        case "month":
          key = date.getDate().toString().padStart(2, "0");
          break;
        case "3months":
        case "year":
          key = `T${date.getMonth() + 1}`;
          break;
        default:
          key = date.getFullYear().toString();
      }
      
      grouped[key] = (grouped[key] || 0) + 1;
    });

    return Object.entries(grouped).map(([name, visitors]) => ({ name, visitors }));
  },
});

export const getTopPages = query({
  args: { timeRange: v.string() },
  handler: async (ctx, args) => {
    const startTime = getTimeRangeStart(args.timeRange);
    const visitors = await ctx.db.query("visitors").collect();
    const filtered = visitors.filter(v => v.visitedAt >= startTime);
    
    const grouped: Record<string, number> = {};
    filtered.forEach(v => {
      const path = new URL(v.pageUrl, "http://localhost").pathname;
      grouped[path] = (grouped[path] || 0) + 1;
    });

    return Object.entries(grouped)
      .map(([path, visitors]) => ({ path, visitors }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 5);
  },
});

export const getTopReferrers = query({
  args: { timeRange: v.string() },
  handler: async (ctx, args) => {
    const startTime = getTimeRangeStart(args.timeRange);
    const visitors = await ctx.db.query("visitors").collect();
    const filtered = visitors.filter(v => v.visitedAt >= startTime);
    
    const grouped: Record<string, number> = {};
    filtered.forEach(v => {
      const source = v.referrer 
        ? new URL(v.referrer).hostname 
        : "Trực tiếp";
      grouped[source] = (grouped[source] || 0) + 1;
    });

    return Object.entries(grouped)
      .map(([source, visitors]) => ({ source, visitors }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 5);
  },
});

export const getCountryStats = query({
  args: { timeRange: v.string() },
  handler: async (ctx, args) => {
    const startTime = getTimeRangeStart(args.timeRange);
    const visitors = await ctx.db.query("visitors").collect();
    const filtered = visitors.filter(v => v.visitedAt >= startTime);
    
    const grouped: Record<string, number> = {};
    filtered.forEach(v => {
      const country = v.country || "Không xác định";
      grouped[country] = (grouped[country] || 0) + 1;
    });

    const total = filtered.length;
    const countryFlags: Record<string, string> = {
      "Việt Nam": "🇻🇳",
      "Indonesia": "🇮🇩",
      "Nhật Bản": "🇯🇵",
      "Hồng Kông": "🇭🇰",
      "Mỹ": "🇺🇸",
      "Không xác định": "🌐",
    };

    return Object.entries(grouped)
      .map(([country, count]) => ({
        country,
        flag: countryFlags[country] || "🌐",
        percent: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 5);
  },
});

export const getDeviceStats = query({
  args: { timeRange: v.string() },
  handler: async (ctx, args) => {
    const startTime = getTimeRangeStart(args.timeRange);
    const visitors = await ctx.db.query("visitors").collect();
    const filtered = visitors.filter(v => v.visitedAt >= startTime);
    
    const grouped: Record<string, number> = {};
    filtered.forEach(v => {
      const device = v.device || "Không xác định";
      grouped[device] = (grouped[device] || 0) + 1;
    });

    const total = filtered.length;
    const deviceLabels: Record<string, string> = {
      mobile: "Di động",
      desktop: "Máy tính",
      tablet: "Máy tính bảng",
    };

    return Object.entries(grouped)
      .map(([device, count]) => ({
        name: deviceLabels[device] || device,
        percent: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.percent - a.percent);
  },
});

export const getOsStats = query({
  args: { timeRange: v.string() },
  handler: async (ctx, args) => {
    const startTime = getTimeRangeStart(args.timeRange);
    const visitors = await ctx.db.query("visitors").collect();
    const filtered = visitors.filter(v => v.visitedAt >= startTime);
    
    const grouped: Record<string, number> = {};
    filtered.forEach(v => {
      const os = v.os || "Không xác định";
      grouped[os] = (grouped[os] || 0) + 1;
    });

    const total = filtered.length;

    return Object.entries(grouped)
      .map(([name, count]) => ({
        name,
        percent: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 5);
  },
});
