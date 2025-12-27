import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const cards = await ctx.db.query("cards").collect();
    const rarities = await ctx.db.query("rarities").collect();
    const packs = await ctx.db.query("packs").collect();
    
    return cards.map(card => {
      const rarity = rarities.find(r => r._id === card.rarityId);
      const pack = packs.find(p => p._id === card.packId);
      return {
        ...card,
        rarityName: rarity?.name || "",
        packName: pack?.name || "",
      };
    });
  },
});

export const getById = query({
  args: { id: v.id("cards") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    rarityId: v.id("rarities"),
    supertype: v.string(),
    subtype: v.string(),
    type: v.string(),
    packId: v.id("packs"),
    cardNumber: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("cards", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("cards"),
    name: v.string(),
    rarityId: v.id("rarities"),
    supertype: v.string(),
    subtype: v.string(),
    type: v.string(),
    packId: v.id("packs"),
    cardNumber: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { id: v.id("cards") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
