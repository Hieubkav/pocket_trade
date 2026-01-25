import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// List all categories
export const list = query({
  handler: async (ctx) => {
    const categories = await ctx.db
      .query("postCategories")
      .collect();
    return categories.sort((a, b) => (a.order || 999) - (b.order || 999));
  },
});

// Get by ID
export const getById = query({
  args: { id: v.id("postCategories") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

// Get by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("postCategories")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

// Create category
export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Check slug unique
    const existing = await ctx.db
      .query("postCategories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existing) {
      throw new Error("Slug đã tồn tại");
    }
    
    return await ctx.db.insert("postCategories", args);
  },
});

// Update category
export const update = mutation({
  args: {
    id: v.id("postCategories"),
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...data }) => {
    // Check slug unique (except current)
    const existing = await ctx.db
      .query("postCategories")
      .withIndex("by_slug", (q) => q.eq("slug", data.slug))
      .first();
    if (existing && existing._id !== id) {
      throw new Error("Slug đã tồn tại");
    }
    
    await ctx.db.patch(id, data);
  },
});

// Remove category
export const remove = mutation({
  args: { id: v.id("postCategories") },
  handler: async (ctx, { id }) => {
    // Remove all pivot records
    const pivots = await ctx.db
      .query("postCategoryPivot")
      .withIndex("by_category", (q) => q.eq("categoryId", id))
      .collect();
    for (const pivot of pivots) {
      await ctx.db.delete(pivot._id);
    }
    
    await ctx.db.delete(id);
  },
});

// Bulk remove
export const bulkRemove = mutation({
  args: { ids: v.array(v.id("postCategories")) },
  handler: async (ctx, { ids }) => {
    for (const id of ids) {
      // Remove all pivot records
      const pivots = await ctx.db
        .query("postCategoryPivot")
        .withIndex("by_category", (q) => q.eq("categoryId", id))
        .collect();
      for (const pivot of pivots) {
        await ctx.db.delete(pivot._id);
      }
      
      await ctx.db.delete(id);
    }
  },
});

// Get categories for a post
export const getPostCategories = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const pivots = await ctx.db
      .query("postCategoryPivot")
      .withIndex("by_post", (q) => q.eq("postId", postId))
      .collect();
    
    const categories = await Promise.all(
      pivots.map(async (pivot) => {
        const category = await ctx.db.get(pivot.categoryId);
        return category;
      })
    );
    
    return categories.filter((c) => c !== null);
  },
});

// Sync post categories (replace all)
export const syncPostCategories = mutation({
  args: {
    postId: v.id("posts"),
    categoryIds: v.array(v.id("postCategories")),
  },
  handler: async (ctx, { postId, categoryIds }) => {
    // Remove existing
    const existing = await ctx.db
      .query("postCategoryPivot")
      .withIndex("by_post", (q) => q.eq("postId", postId))
      .collect();
    for (const pivot of existing) {
      await ctx.db.delete(pivot._id);
    }
    
    // Add new
    for (const categoryId of categoryIds) {
      await ctx.db.insert("postCategoryPivot", { postId, categoryId });
    }
  },
});
