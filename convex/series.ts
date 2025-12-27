import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const seriesList = await ctx.db.query("series").collect();
    const sets = await ctx.db.query("sets").collect();
    
    return seriesList.map(series => {
      const setCount = sets.filter(s => s.seriesId === series._id).length;
      return {
        ...series,
        setCount,
      };
    });
  },
});

export const getById = query({
  args: { id: v.id("series") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("series", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("series"),
    name: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { id: v.id("series") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
