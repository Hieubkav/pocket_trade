import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listByPost = query({
  args: { tradePostId: v.id("tradePosts") },
  handler: async (ctx, args) => {
    const requests = await ctx.db
      .query("tradeRequests")
      .withIndex("by_trade_post", q => q.eq("tradePostId", args.tradePostId))
      .collect();
    
    const traders = await ctx.db.query("traders").collect();
    const cards = await ctx.db.query("cards").collect();
    
    return requests.map(req => {
      const requester = traders.find(t => t._id === req.requesterId);
      const offeredCard = cards.find(c => c._id === req.offeredCardId);
      const requestedCard = cards.find(c => c._id === req.requestedCardId);
      
      return {
        ...req,
        requesterName: requester?.name || "",
        requesterAvatar: requester?.avatarUrl || "",
        requesterIsOnline: requester?.isOnline || false,
        offeredCard: offeredCard ? { _id: offeredCard._id, name: offeredCard.name, imageUrl: offeredCard.imageUrl } : null,
        requestedCard: requestedCard ? { _id: requestedCard._id, name: requestedCard.name, imageUrl: requestedCard.imageUrl } : null,
      };
    });
  },
});

export const listByRequester = query({
  args: { requesterId: v.id("traders") },
  handler: async (ctx, args) => {
    const requests = await ctx.db
      .query("tradeRequests")
      .withIndex("by_requester", q => q.eq("requesterId", args.requesterId))
      .collect();
    
    const tradePosts = await ctx.db.query("tradePosts").collect();
    const traders = await ctx.db.query("traders").collect();
    const cards = await ctx.db.query("cards").collect();
    
    return requests.map(req => {
      const post = tradePosts.find(p => p._id === req.tradePostId);
      const postOwner = post ? traders.find(t => t._id === post.traderId) : null;
      const offeredCard = cards.find(c => c._id === req.offeredCardId);
      const requestedCard = cards.find(c => c._id === req.requestedCardId);
      
      return {
        ...req,
        postOwnerName: postOwner?.name || "",
        postStatus: post?.status || "",
        offeredCard: offeredCard ? { _id: offeredCard._id, name: offeredCard.name, imageUrl: offeredCard.imageUrl } : null,
        requestedCard: requestedCard ? { _id: requestedCard._id, name: requestedCard.name, imageUrl: requestedCard.imageUrl } : null,
      };
    });
  },
});

export const create = mutation({
  args: {
    tradePostId: v.id("tradePosts"),
    requesterId: v.id("traders"),
    offeredCardId: v.id("cards"),
    requestedCardId: v.id("cards"),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if post exists and is active
    const post = await ctx.db.get(args.tradePostId);
    if (!post || post.status !== "active") {
      throw new Error("Bài đăng không tồn tại hoặc đã hết hạn");
    }
    
    // Check requester is not the post owner
    if (post.traderId === args.requesterId) {
      throw new Error("Bạn không thể gửi request cho bài đăng của chính mình");
    }
    
    // Check if already sent a request to this post
    const existingRequest = await ctx.db
      .query("tradeRequests")
      .withIndex("by_trade_post", q => q.eq("tradePostId", args.tradePostId))
      .filter(q => q.eq(q.field("requesterId"), args.requesterId))
      .filter(q => q.eq(q.field("status"), "pending"))
      .first();
    
    if (existingRequest) {
      throw new Error("Bạn đã gửi request cho bài đăng này rồi");
    }
    
    // Check daily limit
    const settings = await ctx.db.query("settings").first();
    const maxRequestsPerDay = settings?.limitRequestPerTraderPerDay ?? 20;
    
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
    
    const todayRequests = await ctx.db
      .query("tradeRequests")
      .withIndex("by_requester", q => q.eq("requesterId", args.requesterId))
      .collect();
    
    const todayCount = todayRequests.filter(r => r._creationTime >= startOfDay && r._creationTime <= endOfDay).length;
    
    if (todayCount >= maxRequestsPerDay) {
      throw new Error(`Bạn đã đạt giới hạn ${maxRequestsPerDay} request/ngày`);
    }
    
    // Create the request
    return await ctx.db.insert("tradeRequests", {
      tradePostId: args.tradePostId,
      requesterId: args.requesterId,
      offeredCardId: args.offeredCardId,
      requestedCardId: args.requestedCardId,
      message: args.message,
      status: "pending",
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("tradeRequests"),
    status: v.string(),
    traderId: v.id("traders"),
  },
  handler: async (ctx, args) => {
    const request = await ctx.db.get(args.id);
    if (!request) throw new Error("Request không tồn tại");
    
    const post = await ctx.db.get(request.tradePostId);
    if (!post || post.traderId !== args.traderId) {
      throw new Error("Bạn không có quyền thực hiện hành động này");
    }
    
    await ctx.db.patch(args.id, { status: args.status });
    
    // If accepted, mark post as matched and decline other requests
    if (args.status === "accepted") {
      await ctx.db.patch(post._id, { status: "matched" });
      
      const otherRequests = await ctx.db
        .query("tradeRequests")
        .withIndex("by_trade_post", q => q.eq("tradePostId", post._id))
        .filter(q => q.neq(q.field("_id"), args.id))
        .collect();
      
      for (const req of otherRequests) {
        if (req.status === "pending") {
          await ctx.db.patch(req._id, { status: "declined" });
        }
      }
    }
  },
});

export const cancel = mutation({
  args: {
    id: v.id("tradeRequests"),
    requesterId: v.id("traders"),
  },
  handler: async (ctx, args) => {
    const request = await ctx.db.get(args.id);
    if (!request) throw new Error("Request không tồn tại");
    
    if (request.requesterId !== args.requesterId) {
      throw new Error("Bạn không có quyền hủy request này");
    }
    
    if (request.status !== "pending") {
      throw new Error("Chỉ có thể hủy request đang chờ duyệt");
    }
    
    await ctx.db.delete(args.id);
  },
});
