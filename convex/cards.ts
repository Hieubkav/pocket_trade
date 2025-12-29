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

// Rarity order for sorting
const RARITY_ORDER: Record<string, number> = {
  '◆': 1, '◆◆': 2, '◆◆◆': 3, '◆◆◆◆': 4,
  '☆': 5, '☆☆': 6, '☆☆☆': 7,
  '♢': 8, 'Shiny Rare': 9, 'Shiny Super Rare': 10, 'Crown Rare': 11,
};

export const listPaginated = query({
  args: { 
    limit: v.number(),
    page: v.optional(v.number()),
    cursor: v.optional(v.string()),
    search: v.optional(v.string()),
    category: v.optional(v.string()),
    collection: v.optional(v.string()),
    cardType: v.optional(v.string()),
    rarity: v.optional(v.string()),
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
        rarityOrder: RARITY_ORDER[rarity?.name || ""] || 0,
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
      
      const matchesRarity = !args.rarity || args.rarity === "All" ||
        card.rarityName === args.rarity;
      
      return matchesSearch && matchesCategory && matchesCollection && matchesType && matchesRarity;
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
        case "RARITY":
          comparison = a.rarityOrder - b.rarityOrder;
          break;
        case "ID":
        default:
          // Sort theo setCode (giảm - set mới lên trước), rồi số thẻ (tăng)
          comparison = b.setCode.localeCompare(a.setCode);
          if (comparison === 0) {
            const numA = parseInt(a.cardNumber) || 0;
            const numB = parseInt(b.cardNumber) || 0;
            comparison = numA - numB;
          }
          break;
      }
      return sortDir === "ASC" ? comparison : -comparison;
    });
    
    // Paginate - support both cursor and page-based
    let startIndex = 0;
    if (args.cursor) {
      const cursorIndex = filtered.findIndex(c => c._id === args.cursor);
      if (cursorIndex !== -1) startIndex = cursorIndex + 1;
    } else if (args.page) {
      startIndex = (args.page - 1) * args.limit;
    }
    
    const cards = filtered.slice(startIndex, startIndex + args.limit);
    const totalPages = Math.ceil(filtered.length / args.limit);
    const currentPage = args.page || Math.floor(startIndex / args.limit) + 1;
    const hasMore = startIndex + args.limit < filtered.length;
    const nextCursor = cards.length > 0 ? cards[cards.length - 1]._id : undefined;
    
    // Get unique values for filter dropdowns
    const collections = [...new Set(enrichedCards.map(c => c.setName || c.packName).filter(Boolean))].sort();
    const rarityNames = [...new Set(enrichedCards.map(c => c.rarityName).filter(Boolean))];
    rarityNames.sort((a, b) => (RARITY_ORDER[a] || 0) - (RARITY_ORDER[b] || 0));
    
    return { items: cards, total: filtered.length, totalPages, currentPage, hasMore, nextCursor, collections, rarities: rarityNames };
  },
});

export const getById = query({
  args: { id: v.id("cards") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByIdEnriched = query({
  args: { id: v.id("cards") },
  handler: async (ctx, args) => {
    const card = await ctx.db.get(args.id);
    if (!card) return null;
    
    const rarity = card.rarityId ? await ctx.db.get(card.rarityId) : null;
    const pack = card.packId ? await ctx.db.get(card.packId) : null;
    const set = pack?.setId ? await ctx.db.get(pack.setId) : null;
    
    return {
      ...card,
      rarityName: rarity?.name || "",
      rarityImageUrl: rarity?.imageUrl || "",
      packName: pack?.name || "",
      setName: set?.name || "",
      setCode: set?.setCode || "",
    };
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
