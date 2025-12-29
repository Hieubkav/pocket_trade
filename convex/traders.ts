import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("traders").collect();
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("traders")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const getById = query({
  args: { id: v.id("traders") },
  handler: async (ctx, args) => {
    const trader = await ctx.db.get(args.id);
    if (!trader) return null;
    const { password: _, ...traderWithoutPassword } = trader;
    return traderWithoutPassword;
  },
});

export const register = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("traders")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existing) {
      throw new Error("Email đã tồn tại");
    }

    const hashedPassword = simpleHash(args.password);
    
    const traderId = await ctx.db.insert("traders", {
      name: args.name,
      email: args.email,
      password: hashedPassword,
      legitPoint: 0,
      status: "active",
    });

    const trader = await ctx.db.get(traderId);
    if (!trader) throw new Error("Lỗi tạo tài khoản");
    
    const { password: _, ...traderWithoutPassword } = trader;
    return traderWithoutPassword;
  },
});

export const login = query({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const trader = await ctx.db
      .query("traders")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (!trader) return null;
    if (trader.status === "banned") {
      throw new Error("Tài khoản đã bị khóa");
    }
    
    const hashedPassword = simpleHash(args.password);
    if (trader.password !== hashedPassword) return null;
    
    const { password: _, ...traderWithoutPassword } = trader;
    return traderWithoutPassword;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("traders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const updateProfile = mutation({
  args: {
    id: v.id("traders"),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    friendCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filteredUpdates);
  },
});

// OTP Functions
export const createOtp = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const trader = await ctx.db
      .query("traders")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (!trader) {
      throw new Error("Email không tồn tại trong hệ thống");
    }

    // Delete old OTPs for this email
    const oldOtps = await ctx.db
      .query("otpCodes")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .collect();
    
    for (const otp of oldOtps) {
      await ctx.db.delete(otp._id);
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    await ctx.db.insert("otpCodes", {
      email: args.email,
      code,
      expiresAt,
      used: false,
    });

    return { code, email: args.email };
  },
});

export const verifyOtp = query({
  args: { email: v.string(), code: v.string() },
  handler: async (ctx, args) => {
    const otp = await ctx.db
      .query("otpCodes")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (!otp) return { valid: false, message: "OTP không tồn tại" };
    if (otp.used) return { valid: false, message: "OTP đã được sử dụng" };
    if (otp.expiresAt < Date.now()) return { valid: false, message: "OTP đã hết hạn" };
    if (otp.code !== args.code) return { valid: false, message: "OTP không đúng" };
    
    return { valid: true };
  },
});

export const resetPassword = mutation({
  args: {
    email: v.string(),
    code: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const otp = await ctx.db
      .query("otpCodes")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (!otp || otp.used || otp.expiresAt < Date.now() || otp.code !== args.code) {
      throw new Error("OTP không hợp lệ");
    }

    const trader = await ctx.db
      .query("traders")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (!trader) throw new Error("Trader không tồn tại");

    // Update password
    const hashedPassword = simpleHash(args.newPassword);
    await ctx.db.patch(trader._id, { password: hashedPassword });

    // Mark OTP as used
    await ctx.db.patch(otp._id, { used: true });

    return { success: true };
  },
});
