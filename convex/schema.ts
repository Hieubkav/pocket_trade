import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // 1. Card
  cards: defineTable({
    name: v.string(),
    rarity: v.string(), // ◆, ◆◆, ◆◆◆, ◆◆◆◆, ★, ★★, ★★★, ♢, Shiny Rare, Shiny Super Rare
    supertype: v.string(), // pokemon, trainer
    subtype: v.string(), // Basic, Stage 1, Stage 2, ex, Item, Supporter, Tool
    type: v.string(), // Grass, Fire, Water, Lightning, Psychic, Fighting, Darkness, Metal, Dragon, Colorless
    packId: v.id("packs"),
    cardNumber: v.string(), // "001/100"
    imageUrl: v.string(),
  })
    .index("by_pack", ["packId"])
    .index("by_rarity", ["rarity"])
    .index("by_type", ["type"]),

  // 2. Pack
  packs: defineTable({
    name: v.string(),
    imageUrl: v.string(),
    setId: v.id("sets"),
  }).index("by_set", ["setId"]),

  // 3. Set
  sets: defineTable({
    name: v.string(),
    imageUrl: v.string(),
    setCode: v.string(),
    series: v.string(), // A series, B series...
  }).index("by_series", ["series"]),

  // 4. Admin
  admins: defineTable({
    username: v.string(),
    email: v.string(),
    password: v.string(),
  }).index("by_email", ["email"]),

  // 5. Trader
  traders: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.string(),
    avatarUrl: v.optional(v.string()),
    legitPoint: v.number(), // default 0
    friendCode: v.optional(v.string()),
  }).index("by_email", ["email"]),

  // 6. Trade-post
  tradePosts: defineTable({
    traderId: v.id("traders"),
    status: v.string(), // active, expired, cancelled, matched
    expiresAt: v.number(), // timestamp
    isHidden: v.boolean(), // default false
  })
    .index("by_trader", ["traderId"])
    .index("by_status", ["status"])
    .index("by_expires", ["expiresAt"]),

  // 7. Trade-request
  tradeRequests: defineTable({
    tradePostId: v.id("tradePosts"),
    requesterId: v.id("traders"),
    message: v.optional(v.string()),
    status: v.string(), // pending, accepted, declined
  })
    .index("by_trade_post", ["tradePostId"])
    .index("by_requester", ["requesterId"]),

  // 8. Trade-post-Card (Pivot)
  tradePostCards: defineTable({
    tradePostId: v.id("tradePosts"),
    cardId: v.id("cards"),
    type: v.string(), // "have" | "want"
  })
    .index("by_trade_post", ["tradePostId"])
    .index("by_card", ["cardId"]),

  // 9. Chat
  chats: defineTable({
    tradePostId: v.id("tradePosts"),
    traderHostId: v.id("traders"),
    traderGuestId: v.id("traders"),
  })
    .index("by_trade_post", ["tradePostId"])
    .index("by_host", ["traderHostId"])
    .index("by_guest", ["traderGuestId"]),

  // 10. Message
  messages: defineTable({
    chatId: v.id("chats"),
    senderId: v.id("traders"),
    content: v.string(),
    contentType: v.string(), // "text" | "image"
    isRead: v.boolean(), // default false
  }).index("by_chat", ["chatId"]),

  // 11. Trader-Card (Lịch sử trade)
  traderCards: defineTable({
    traderId: v.id("traders"),
    cardId: v.id("cards"),
    type: v.string(), // "received" | "given"
    quantity: v.number(),
    tradePostId: v.id("tradePosts"),
  })
    .index("by_trader", ["traderId"])
    .index("by_card", ["cardId"]),

  // 12. Setting (chỉ 1 record)
  settings: defineTable({
    siteName: v.string(),
    logo: v.optional(v.string()),
    favicon: v.optional(v.string()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    limitTradePostPerTrader: v.number(), // default 5
    limitCardPerPost: v.number(), // default 10
    tradePostDurationHours: v.number(), // default 48
  }),

  // 13. Event
  events: defineTable({
    name: v.string(),
    content: v.string(), // HTML
    imageUrl: v.optional(v.string()),
    startDate: v.number(), // timestamp
    endDate: v.number(), // timestamp
    isActive: v.boolean(), // default false
  }).index("by_active", ["isActive"]),

  // 14. Visitor
  visitors: defineTable({
    ipAddress: v.string(),
    userAgent: v.string(),
    pageUrl: v.string(),
    referrer: v.optional(v.string()),
    country: v.optional(v.string()), // Lookup từ IP khi tạo record
    device: v.optional(v.string()), // mobile, desktop, tablet (parse từ userAgent)
    os: v.optional(v.string()), // iOS, Android, Windows, Mac (parse từ userAgent)
    visitedAt: v.number(), // timestamp
  }).index("by_visited_at", ["visitedAt"]),
});
