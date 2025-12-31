import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ============ OPTIMIZED: Dùng cached cardCount thay vì fetch ALL cards ============
export const list = query({
  args: {},
  handler: async (ctx) => {
    const [packs, sets] = await Promise.all([
      ctx.db.query("packs").collect(),
      ctx.db.query("sets").collect(),
    ]);
    
    const setMap = new Map(sets.map(s => [s._id, s]));
    
    return packs.map(pack => {
      const set = setMap.get(pack.setId);
      return {
        ...pack,
        setName: set?.name || "",
        cardCount: pack.cardCount ?? 0, // Dùng cached count
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

export const bulkRemove = mutation({
  args: { ids: v.array(v.id("packs")) },
  handler: async (ctx, args) => {
    for (const id of args.ids) {
      await ctx.db.delete(id);
    }
    return { deleted: args.ids.length };
  },
});
