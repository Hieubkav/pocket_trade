import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// List all categories
export const list = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("postCategories")
      .order("desc")
      .collect();
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
  },
  handler: async (ctx, { name }) => {
    // Auto-generate slug
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Check slug unique
    const existing = await ctx.db
      .query("postCategories")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    if (existing) {
      throw new Error("Tên danh mục đã tồn tại (slug trùng)");
    }
    
    return await ctx.db.insert("postCategories", { name, slug });
  },
});

// Update category
export const update = mutation({
  args: {
    id: v.id("postCategories"),
    name: v.string(),
  },
  handler: async (ctx, { id, name }) => {
    // Auto-generate slug
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Check slug unique (except current)
    const existing = await ctx.db
      .query("postCategories")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    if (existing && existing._id !== id) {
      throw new Error("Tên danh mục đã tồn tại (slug trùng)");
    }
    
    await ctx.db.patch(id, { name, slug });
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

// Get posts by category (for public page)
export const getPostsByCategory = query({
  args: { 
    categoryId: v.id("postCategories"),
    paginationOpts: v.optional(v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null()),
    })),
  },
  handler: async (ctx, { categoryId, paginationOpts }) => {
    const limit = paginationOpts?.numItems || 20;
    
    // Get pivot records for this category
    const pivots = await ctx.db
      .query("postCategoryPivot")
      .withIndex("by_category", (q) => q.eq("categoryId", categoryId))
      .collect();
    
    // Get all post IDs
    const postIds = pivots.map(p => p.postId);
    
    // Fetch posts and filter published
    const posts = await Promise.all(
      postIds.map(async (postId) => {
        const post = await ctx.db.get(postId);
        return post;
      })
    );
    
    // Filter published and sort by date desc
    const published = posts
      .filter((p): p is NonNullable<typeof p> => p !== null && p.isPublished)
      .sort((a, b) => b.createdAt - a.createdAt);
    
    return published;
  },
});
