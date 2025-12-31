import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ============ OPTIMIZED: Dùng cached counts thay vì fetch ALL cards ============
export const list = query({
  args: {},
  handler: async (ctx) => {
    const [sets, series] = await Promise.all([
      ctx.db.query("sets").collect(),
      ctx.db.query("series").collect(),
    ]);
    
    const seriesMap = new Map(series.map(s => [s._id, s]));
    
    return sets.map(set => {
      const seriesItem = seriesMap.get(set.seriesId);
      return {
        ...set,
        seriesName: seriesItem?.name || "",
        packCount: set.packCount ?? 0, // Dùng cached count
        cardCount: set.cardCount ?? 0, // Dùng cached count
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

export const bulkRemove = mutation({
  args: { ids: v.array(v.id("sets")) },
  handler: async (ctx, args) => {
    for (const id of args.ids) {
      await ctx.db.delete(id);
    }
    return { deleted: args.ids.length };
  },
});

// ============ ADMIN: Sync cached counts cho tất cả sets và packs ============
export const syncCachedCounts = mutation({
  args: {},
  handler: async (ctx) => {
    const [sets, packs, cards] = await Promise.all([
      ctx.db.query("sets").collect(),
      ctx.db.query("packs").collect(),
      ctx.db.query("cards").collect(),
    ]);
    
    // Count cards per pack
    const cardCountByPack = new Map<string, number>();
    for (const card of cards) {
      const count = cardCountByPack.get(card.packId) ?? 0;
      cardCountByPack.set(card.packId, count + 1);
    }
    
    // Update packs với cardCount
    for (const pack of packs) {
      const cardCount = cardCountByPack.get(pack._id) ?? 0;
      if (pack.cardCount !== cardCount) {
        await ctx.db.patch(pack._id, { cardCount });
      }
    }
    
    // Count packs và cards per set
    const packCountBySet = new Map<string, number>();
    const cardCountBySet = new Map<string, number>();
    
    for (const pack of packs) {
      const pCount = packCountBySet.get(pack.setId) ?? 0;
      packCountBySet.set(pack.setId, pCount + 1);
      
      const cCount = cardCountBySet.get(pack.setId) ?? 0;
      const packCards = cardCountByPack.get(pack._id) ?? 0;
      cardCountBySet.set(pack.setId, cCount + packCards);
    }
    
    // Update sets với packCount và cardCount
    for (const set of sets) {
      const packCount = packCountBySet.get(set._id) ?? 0;
      const cardCount = cardCountBySet.get(set._id) ?? 0;
      if (set.packCount !== packCount || set.cardCount !== cardCount) {
        await ctx.db.patch(set._id, { packCount, cardCount });
      }
    }
    
    return { 
      setsUpdated: sets.length, 
      packsUpdated: packs.length,
      totalCards: cards.length,
    };
  },
});
