import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const packs = await ctx.db.query("packs").collect();
    const sets = await ctx.db.query("sets").collect();
    const cards = await ctx.db.query("cards").collect();
    
    return packs.map(pack => {
      const set = sets.find(s => s._id === pack.setId);
      const cardCount = cards.filter(c => c.packId === pack._id).length;
      
      return {
        ...pack,
        setName: set?.name || "",
        cardCount,
      };
    });
  },
});

export const getById = query({
  args: { id: v.id("packs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    setId: v.id("sets"),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("packs", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("packs"),
    name: v.string(),
    setId: v.id("sets"),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { id: v.id("packs") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
