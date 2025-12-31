import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    // Giới hạn 100 posts để tránh quá tải bandwidth
    return await ctx.db.query("posts").order("desc").take(100);
  },
});

export const getById = query({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getPublished = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existing) {
      throw new Error("Slug đã tồn tại");
    }
    return await ctx.db.insert("posts", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("posts"),
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    const existing = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", data.slug))
      .first();
    if (existing && existing._id !== id) {
      throw new Error("Slug đã tồn tại");
    }
    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (post?.imageUrl?.includes("convex.cloud")) {
      const files = await ctx.db
        .query("files")
        .withIndex("by_used_by", (q) => q.eq("usedBy", `posts:${args.id}`))
        .collect();
      for (const file of files) {
        await ctx.db.patch(file._id, { usedBy: undefined });
      }
    }
    await ctx.db.delete(args.id);
  },
});

export const bulkRemove = mutation({
  args: { ids: v.array(v.id("posts")) },
  handler: async (ctx, args) => {
    for (const id of args.ids) {
      const post = await ctx.db.get(id);
      if (post?.imageUrl?.includes("convex.cloud")) {
        const files = await ctx.db
          .query("files")
          .withIndex("by_used_by", (q) => q.eq("usedBy", `posts:${id}`))
          .collect();
        for (const file of files) {
          await ctx.db.patch(file._id, { usedBy: undefined });
        }
      }
      await ctx.db.delete(id);
    }
    return { deleted: args.ids.length };
  },
});
