import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Đếm số bài đăng trong ngày của trader
export const countTodayPosts = query({
  args: { traderId: v.id("traders") },
  handler: async (ctx, args) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 1, 0, 0).getTime();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 0, 0).getTime();
    
    const posts = await ctx.db
      .query("tradePosts")
      .withIndex("by_trader", q => q.eq("traderId", args.traderId))
      .collect();
    
    const todayPosts = posts.filter(p => p._creationTime >= startOfDay && p._creationTime <= endOfDay);
    return todayPosts.length;
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const tradePosts = await ctx.db.query("tradePosts").order("desc").collect();
    const traders = await ctx.db.query("traders").collect();
    const tradePostCards = await ctx.db.query("tradePostCards").collect();
    const tradeRequests = await ctx.db.query("tradeRequests").collect();
    const cards = await ctx.db.query("cards").collect();
    
    return tradePosts.map(post => {
      const trader = traders.find(t => t._id === post.traderId);
      const postCards = tradePostCards.filter(c => c.tradePostId === post._id);
      
      const haveCardIds = postCards.filter(c => c.type === "have").map(c => c.cardId);
      const wantCardIds = postCards.filter(c => c.type === "want").map(c => c.cardId);
      
      const haveCardsData = haveCardIds
        .map(id => cards.find(c => c._id === id))
        .filter(Boolean)
        .map(c => ({ _id: c!._id, name: c!.name, imageUrl: c!.imageUrl }));
      
      const wantCardsData = wantCardIds
        .map(id => cards.find(c => c._id === id))
        .filter(Boolean)
        .map(c => ({ _id: c!._id, name: c!.name, imageUrl: c!.imageUrl }));
      
      const requestsCount = tradeRequests.filter(r => r.tradePostId === post._id).length;
      
      return {
        ...post,
        traderName: trader?.name || "",
        traderAvatar: trader?.avatarUrl || "",
        traderIsOnline: trader?.isOnline || false,
        haveCardsCount: haveCardIds.length,
        wantCardsCount: wantCardIds.length,
        haveCards: haveCardsData,
        wantCards: wantCardsData,
        requestsCount,
      };
    });
  },
});

export const listPaginated = query({
  args: {
    limit: v.number(),
    page: v.optional(v.number()),
    status: v.optional(v.string()),
    traderId: v.optional(v.id("traders")),
    onlineOnly: v.optional(v.boolean()),
    rarity: v.optional(v.string()),
    setName: v.optional(v.string()),
    cardName: v.optional(v.string()),
    sortBy: v.optional(v.string()),
    sortDir: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const tradePosts = await ctx.db.query("tradePosts").collect();
    const traders = await ctx.db.query("traders").collect();
    const tradePostCards = await ctx.db.query("tradePostCards").collect();
    const cards = await ctx.db.query("cards").collect();
    const rarities = await ctx.db.query("rarities").collect();
    const packs = await ctx.db.query("packs").collect();
    const sets = await ctx.db.query("sets").collect();
    const tradeRequests = await ctx.db.query("tradeRequests").collect();

    // Enrich cards with rarity and set info
    const enrichedCards = cards.map(card => {
      const rarity = rarities.find(r => r._id === card.rarityId);
      const pack = packs.find(p => p._id === card.packId);
      const set = pack ? sets.find(s => s._id === pack.setId) : undefined;
      return { ...card, rarityName: rarity?.name || "", setName: set?.name || "" };
    });

    // Build enriched posts
    const enrichedPosts = tradePosts.map(post => {
      const trader = traders.find(t => t._id === post.traderId);
      const postCards = tradePostCards.filter(c => c.tradePostId === post._id);
      
      const haveCardIds = postCards.filter(c => c.type === "have").map(c => c.cardId);
      const wantCardIds = postCards.filter(c => c.type === "want").map(c => c.cardId);
      
      const haveCardsData = haveCardIds
        .map(id => enrichedCards.find(c => c._id === id))
        .filter(Boolean);
      
      const wantCardsData = wantCardIds
        .map(id => enrichedCards.find(c => c._id === id))
        .filter(Boolean);
      
      // Count pending requests for this post
      const pendingRequests = tradeRequests.filter(
        r => r.tradePostId === post._id && r.status === "pending"
      ).length;

      return {
        ...post,
        traderName: trader?.name || "",
        traderAvatar: trader?.avatarUrl || "",
        traderIsOnline: trader?.isOnline || false,
        traderTradePoint: trader?.tradePoint ?? 0,
        requestsCount: pendingRequests,
        haveCardsCount: haveCardIds.length,
        wantCardsCount: wantCardIds.length,
        haveCards: haveCardsData.map(c => ({ _id: c!._id, name: c!.name, imageUrl: c!.imageUrl, rarityName: c!.rarityName, setName: c!.setName })),
        wantCards: wantCardsData.map(c => ({ _id: c!._id, name: c!.name, imageUrl: c!.imageUrl, rarityName: c!.rarityName, setName: c!.setName })),
        // For filtering
        _allRarities: [...new Set([...haveCardsData, ...wantCardsData].map(c => c?.rarityName).filter(Boolean))],
        _allSets: [...new Set([...haveCardsData, ...wantCardsData].map(c => c?.setName).filter(Boolean))],
      };
    });

    // Filter
    let filtered = enrichedPosts.filter(post => {
      if (args.status && post.status !== args.status) return false;
      if (args.status === 'active' && post.isHidden) return false;
      if (args.traderId && post.traderId !== args.traderId) return false;
      if (args.onlineOnly && !post.traderIsOnline) return false;
      if (args.rarity && !post._allRarities.includes(args.rarity)) return false;
      if (args.setName && !post._allSets.includes(args.setName)) return false;
      if (args.cardName) {
        const searchTerm = args.cardName.toLowerCase();
        const hasMatch = [...post.haveCards, ...post.wantCards].some(c => 
          c.name.toLowerCase().includes(searchTerm)
        );
        if (!hasMatch) return false;
      }
      return true;
    });

    // Sort
    const sortBy = args.sortBy || "EXPIRES";
    const sortDir = args.sortDir || "ASC";
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "CREATED":
          comparison = a._creationTime - b._creationTime;
          break;
        case "EXPIRES":
        default:
          comparison = a.expiresAt - b.expiresAt;
          break;
      }
      return sortDir === "ASC" ? comparison : -comparison;
    });

    // Pagination
    const currentPage = args.page || 1;
    const startIndex = (currentPage - 1) * args.limit;
    const items = filtered.slice(startIndex, startIndex + args.limit);
    const totalPages = Math.ceil(filtered.length / args.limit);

    // Get unique values for filters
    const allRarities = [...new Set(enrichedPosts.flatMap(p => p._allRarities))].sort();
    const allSets = [...new Set(enrichedPosts.flatMap(p => p._allSets))].sort();

    // Clean up internal fields
    const cleanItems = items.map(({ _allRarities, _allSets, ...rest }) => rest);

    return { 
      items: cleanItems, 
      total: filtered.length, 
      totalPages, 
      currentPage,
      rarities: allRarities,
      sets: allSets,
    };
  },
});

export const getById = query({
  args: { id: v.id("tradePosts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (!post) return null;
    
    const trader = await ctx.db.get(post.traderId);
    const tradePostCards = await ctx.db.query("tradePostCards")
      .withIndex("by_trade_post", q => q.eq("tradePostId", args.id))
      .collect();
    const cards = await ctx.db.query("cards").collect();
    const tradeRequests = await ctx.db.query("tradeRequests")
      .withIndex("by_trade_post", q => q.eq("tradePostId", args.id))
      .collect();
    
    const haveCards = tradePostCards
      .filter(c => c.type === "have")
      .map(c => cards.find(card => card._id === c.cardId))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);
    const wantCards = tradePostCards
      .filter(c => c.type === "want")
      .map(c => cards.find(card => card._id === c.cardId))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);
    
    return {
      ...post,
      trader,
      haveCards,
      wantCards,
      requestsCount: tradeRequests.length,
    };
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("tradePosts"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const toggleHidden = mutation({
  args: { id: v.id("tradePosts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (post) {
      await ctx.db.patch(args.id, { isHidden: !post.isHidden });
    }
  },
});

export const remove = mutation({
  args: { id: v.id("tradePosts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const bulkRemove = mutation({
  args: { ids: v.array(v.id("tradePosts")) },
  handler: async (ctx, args) => {
    for (const id of args.ids) {
      await ctx.db.delete(id);
    }
    return { deleted: args.ids.length };
  },
});

export const create = mutation({
  args: {
    traderId: v.id("traders"),
    haveCardIds: v.array(v.id("cards")),
    wantCardIds: v.array(v.id("cards")),
    durationHours: v.optional(v.number()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get settings for default duration
    const settings = await ctx.db.query("settings").first();
    const durationHours = args.durationHours ?? settings?.tradePostDurationHours ?? 48;
    
    // Get all cards to validate rarity
    const allCardIds = [...args.haveCardIds, ...args.wantCardIds];
    const cards = await Promise.all(allCardIds.map(id => ctx.db.get(id)));
    const rarities = await ctx.db.query("rarities").collect();
    
    // Get rarity names for all cards
    const cardRarities = cards.map(card => {
      if (!card) return null;
      const rarity = rarities.find(r => r._id === card.rarityId);
      return rarity?.name;
    });
    
    // Check for Crown rarity - not allowed to trade
    const hasCrown = cardRarities.some(r => r?.toLowerCase().includes("crown"));
    if (hasCrown) {
      throw new Error("Không thể giao dịch thẻ có độ hiếm Crown");
    }
    
    // Check all cards have the same rarity
    const uniqueRarities = [...new Set(cardRarities.filter(Boolean))];
    if (uniqueRarities.length > 1) {
      throw new Error("Tất cả thẻ trong giao dịch phải cùng độ hiếm");
    }
    
    const tradeRarity = uniqueRarities[0] || "";
    
    // Check daily limit
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 1, 0, 0).getTime();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 0, 0).getTime();
    
    const todayPosts = await ctx.db
      .query("tradePosts")
      .withIndex("by_trader", q => q.eq("traderId", args.traderId))
      .collect();
    
    const todayCount = todayPosts.filter(p => p._creationTime >= startOfDay && p._creationTime <= endOfDay).length;
    const maxPosts = settings?.limitTradePostPerTrader ?? 5;
    
    if (todayCount >= maxPosts) {
      throw new Error(`Bạn đã đạt giới hạn ${maxPosts} bài đăng/ngày`);
    }
    
    // Validate note length
    const note = args.note?.slice(0, 50);
    
    // Create trade post
    const expiresAt = Date.now() + durationHours * 60 * 60 * 1000;
    const postId = await ctx.db.insert("tradePosts", {
      traderId: args.traderId,
      status: "active",
      expiresAt,
      isHidden: false,
      note,
      rarity: tradeRarity,
    });
    
    // Create tradePostCards for have cards
    for (const cardId of args.haveCardIds) {
      await ctx.db.insert("tradePostCards", {
        tradePostId: postId,
        cardId,
        type: "have",
      });
    }
    
    // Create tradePostCards for want cards
    for (const cardId of args.wantCardIds) {
      await ctx.db.insert("tradePostCards", {
        tradePostId: postId,
        cardId,
        type: "want",
      });
    }
    
    return postId;
  },
});
