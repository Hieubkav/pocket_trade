import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const sets = await ctx.db.query("sets").collect();
    const series = await ctx.db.query("series").collect();
    const packs = await ctx.db.query("packs").collect();
    const cards = await ctx.db.query("cards").collect();
    
    return sets.map(set => {
      const seriesItem = series.find(s => s._id === set.seriesId);
      const setPacks = packs.filter(p => p.setId === set._id);
      const setPackIds = setPacks.map(p => p._id);
      const cardCount = cards.filter(c => setPackIds.includes(c.packId)).length;
      
      return {
        ...set,
        seriesName: seriesItem?.name || "",
        packCount: setPacks.length,
        cardCount,
      };
    });
  },
});

export const getById = query({
  args: { id: v.id("sets") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    imageUrl: v.string(),
    setCode: v.string(),
    seriesId: v.id("series"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sets", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("sets"),
    name: v.string(),
    imageUrl: v.string(),
    setCode: v.string(),
    seriesId: v.id("series"),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { id: v.id("sets") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
