import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("rarities").collect();
  },
});

export const getById = query({
  args: { id: v.id("rarities") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("rarities", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("rarities"),
    name: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { id: v.id("rarities") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
