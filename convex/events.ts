import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("events").collect();
  },
});

export const getById = query({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    startDate: v.number(),
    endDate: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Nếu isActive = true, tắt tất cả event khác
    if (args.isActive) {
      const activeEvents = await ctx.db
        .query("events")
        .withIndex("by_active", (q) => q.eq("isActive", true))
        .collect();
      for (const event of activeEvents) {
        await ctx.db.patch(event._id, { isActive: false });
      }
    }
    return await ctx.db.insert("events", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("events"),
    name: v.string(),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    startDate: v.number(),
    endDate: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    // Nếu isActive = true, tắt tất cả event khác
    if (data.isActive) {
      const activeEvents = await ctx.db
        .query("events")
        .withIndex("by_active", (q) => q.eq("isActive", true))
        .collect();
      for (const event of activeEvents) {
        if (event._id !== id) {
          await ctx.db.patch(event._id, { isActive: false });
        }
      }
    }
    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.id);
    if (event?.imageUrl?.includes('convex.cloud')) {
      // Release file when deleting event
      const files = await ctx.db
        .query("files")
        .withIndex("by_used_by", (q) => q.eq("usedBy", `events:${args.id}`))
        .collect();
      for (const file of files) {
        await ctx.db.patch(file._id, { usedBy: undefined });
      }
    }
    await ctx.db.delete(args.id);
  },
});

export const bulkRemove = mutation({
  args: { ids: v.array(v.id("events")) },
  handler: async (ctx, args) => {
    for (const id of args.ids) {
      const event = await ctx.db.get(id);
      if (event?.imageUrl?.includes('convex.cloud')) {
        const files = await ctx.db
          .query("files")
          .withIndex("by_used_by", (q) => q.eq("usedBy", `events:${id}`))
          .collect();
        for (const file of files) {
          await ctx.db.patch(file._id, { usedBy: undefined });
        }
      }
      await ctx.db.delete(id);
    }
    return { deleted: args.ids.length };
  },
});
