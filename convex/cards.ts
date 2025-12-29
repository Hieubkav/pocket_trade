import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const cards = await ctx.db.query("cards").collect();
    const rarities = await ctx.db.query("rarities").collect();
    const packs = await ctx.db.query("packs").collect();
    const sets = await ctx.db.query("sets").collect();
    
    return cards.map(card => {
      const rarity = rarities.find(r => r._id === card.rarityId);
      const pack = packs.find(p => p._id === card.packId);
      const set = pack ? sets.find(s => s._id === pack.setId) : undefined;
      return {
        ...card,
        rarityName: rarity?.name || "",
        rarityImageUrl: rarity?.imageUrl || "",
        packName: pack?.name || "",
        setName: set?.name || "",
        setCode: set?.setCode || "",
      };
    });
  },
});

export const listPaginated = query({
  args: { 
    limit: v.number(),
    cursor: v.optional(v.string()),
    search: v.optional(v.string()),
    category: v.optional(v.string()),
    collection: v.optional(v.string()),
    cardType: v.optional(v.string()),
    sortBy: v.optional(v.string()),
    sortDir: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const allCardsRaw = await ctx.db.query("cards").collect();
    const rarities = await ctx.db.query("rarities").collect();
    const packs = await ctx.db.query("packs").collect();
    const sets = await ctx.db.query("sets").collect();
    
    // Enrich cards with related data
    const enrichedCards = allCardsRaw.map(card => {
      const rarity = rarities.find(r => r._id === card.rarityId);
      const pack = packs.find(p => p._id === card.packId);
      const set = pack ? sets.find(s => s._id === pack.setId) : undefined;
      return {
        ...card,
        rarityName: rarity?.name || "",
        rarityImageUrl: rarity?.imageUrl || "",
        packName: pack?.name || "",
        setName: set?.name || "",
        setCode: set?.setCode || "",
      };
    });
    
    // Filter
    const filtered = enrichedCards.filter(card => {
      const searchLower = (args.search || "").toLowerCase();
      const matchesSearch = !args.search || 
        card.name.toLowerCase().includes(searchLower) ||
        card.type.toLowerCase().includes(searchLower);
      
      const matchesCategory = !args.category || args.category === "All" || 
        (args.category === "Pokemon" ? card.supertype === "pokemon" : card.supertype !== "pokemon");
      
      const cardCollection = card.setName || card.packName;
      const matchesCollection = !args.collection || args.collection === "All" || 
        cardCollection === args.collection;
      
      const matchesType = !args.cardType || args.cardType === "All" || 
        card.type === args.cardType;
      
      return matchesSearch && matchesCategory && matchesCollection && matchesType;
    });
    
    // Sort
    const sortBy = args.sortBy || "ID";
    const sortDir = args.sortDir || "ASC";
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "NAME":
          comparison = a.name.localeCompare(b.name);
          break;
        case "TYPE":
          comparison = a.type.localeCompare(b.type);
          break;
        case "ID":
        default:
          // Sort theo setCode (giảm - set mới lên trước), rồi số thẻ (tăng)
          comparison = b.setCode.localeCompare(a.setCode); // DESC cho setCode
          if (comparison === 0) {
            const numA = parseInt(a.cardNumber) || 0;
            const numB = parseInt(b.cardNumber) || 0;
            comparison = numA - numB; // ASC cho cardNumber
          }
          break;
      }
      return sortDir === "ASC" ? comparison : -comparison;
    });
    
    // Paginate
    let startIndex = 0;
    if (args.cursor) {
      const cursorIndex = filtered.findIndex(c => c._id === args.cursor);
      if (cursorIndex !== -1) {
        startIndex = cursorIndex + 1;
      }
    }
    
    const cards = filtered.slice(startIndex, startIndex + args.limit);
    const hasMore = startIndex + args.limit < filtered.length;
    const nextCursor = cards.length > 0 ? cards[cards.length - 1]._id : undefined;
    
    // Get unique collections for filter dropdown
    const collections = [...new Set(enrichedCards.map(c => c.setName || c.packName).filter(Boolean))].sort();
    
    return { items: cards, hasMore, nextCursor, total: filtered.length, collections };
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

export const bulkRemove = mutation({
  args: { ids: v.array(v.id("cards")) },
  handler: async (ctx, args) => {
    for (const id of args.ids) {
      await ctx.db.delete(id);
    }
    return { deleted: args.ids.length };
  },
});
