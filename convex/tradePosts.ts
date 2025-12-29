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
    const tradePosts = await ctx.db.query("tradePosts").collect();
    const traders = await ctx.db.query("traders").collect();
    const tradePostCards = await ctx.db.query("tradePostCards").collect();
    const tradeRequests = await ctx.db.query("tradeRequests").collect();
    
    return tradePosts.map(post => {
      const trader = traders.find(t => t._id === post.traderId);
      const postCards = tradePostCards.filter(c => c.tradePostId === post._id);
      const haveCards = postCards.filter(c => c.type === "have").length;
      const wantCards = postCards.filter(c => c.type === "want").length;
      const requestsCount = tradeRequests.filter(r => r.tradePostId === post._id).length;
      
      return {
        ...post,
        traderName: trader?.name || "",
        haveCards,
        wantCards,
        requestsCount,
      };
    });
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
      .filter(Boolean);
    const wantCards = tradePostCards
      .filter(c => c.type === "want")
      .map(c => cards.find(card => card._id === c.cardId))
      .filter(Boolean);
    
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
