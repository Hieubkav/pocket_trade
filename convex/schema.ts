import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // 1. Rarity (Độ hiếm)
  rarities: defineTable({
    name: v.string(), // ◆, ◆◆, ◆◆◆, ◆◆◆◆, ★, ★★, ★★★, ♢, Shiny Rare, Shiny Super Rare
    imageUrl: v.string(),
  }),

  // 2. Series
  series: defineTable({
    name: v.string(), // A Series, B Series...
    imageUrl: v.optional(v.string()),
  }),

  // 3. Card
  cards: defineTable({
    name: v.string(),
    rarityId: v.id("rarities"),
    supertype: v.string(), // pokemon, trainer
    subtype: v.string(), // Basic, Stage 1, Stage 2, ex, Item, Supporter, Tool
    type: v.string(), // Grass, Fire, Water, Lightning, Psychic, Fighting, Darkness, Metal, Dragon, Colorless
    packId: v.id("packs"),
    cardNumber: v.string(), // "001/100"
    imageUrl: v.string(),
  })
    .index("by_pack", ["packId"])
    .index("by_rarity", ["rarityId"])
    .index("by_type", ["type"]),

  // 4. Pack
  packs: defineTable({
    name: v.string(),
    imageUrl: v.string(),
    setId: v.id("sets"),
  }).index("by_set", ["setId"]),

  // 5. Set
  sets: defineTable({
    name: v.string(),
    imageUrl: v.string(),
    setCode: v.string(),
    seriesId: v.id("series"),
  }).index("by_series", ["seriesId"]),

  // 6. Admin
  admins: defineTable({
    username: v.string(),
    email: v.string(),
    password: v.string(),
  }).index("by_email", ["email"]),

  // 7. Trader
  traders: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.string(),
    avatarUrl: v.optional(v.string()),
    legitPoint: v.number(), // default 0
    friendCode: v.optional(v.string()),
  }).index("by_email", ["email"]),

  // 8. Trade-post
  tradePosts: defineTable({
    traderId: v.id("traders"),
    status: v.string(), // active, expired, cancelled, matched
    expiresAt: v.number(), // timestamp
    isHidden: v.boolean(), // default false
  })
    .index("by_trader", ["traderId"])
    .index("by_status", ["status"])
    .index("by_expires", ["expiresAt"]),

  // 9. Trade-request
  tradeRequests: defineTable({
    tradePostId: v.id("tradePosts"),
    requesterId: v.id("traders"),
    message: v.optional(v.string()),
    status: v.string(), // pending, accepted, declined
  })
    .index("by_trade_post", ["tradePostId"])
    .index("by_requester", ["requesterId"]),

  // 10. Trade-post-Card (Pivot)
  tradePostCards: defineTable({
    tradePostId: v.id("tradePosts"),
    cardId: v.id("cards"),
    type: v.string(), // "have" | "want"
  })
    .index("by_trade_post", ["tradePostId"])
    .index("by_card", ["cardId"]),

  // 11. Chat
  chats: defineTable({
    tradePostId: v.id("tradePosts"),
    traderHostId: v.id("traders"),
    traderGuestId: v.id("traders"),
  })
    .index("by_trade_post", ["tradePostId"])
    .index("by_host", ["traderHostId"])
    .index("by_guest", ["traderGuestId"]),

  // 12. Message
  messages: defineTable({
    chatId: v.id("chats"),
    senderId: v.id("traders"),
    content: v.string(),
    contentType: v.string(), // "text" | "image"
    isRead: v.boolean(), // default false
  }).index("by_chat", ["chatId"]),

  // 13. Trader-Card (Lịch sử trade)
  traderCards: defineTable({
    traderId: v.id("traders"),
    cardId: v.id("cards"),
    type: v.string(), // "received" | "given"
    quantity: v.number(),
    tradePostId: v.id("tradePosts"),
  })
    .index("by_trader", ["traderId"])
    .index("by_card", ["cardId"]),

  // 14. Setting (chỉ 1 record)
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

  // 15. Event
  events: defineTable({
    name: v.string(),
    content: v.string(), // HTML
    imageUrl: v.optional(v.string()),
    startDate: v.number(), // timestamp
    endDate: v.number(), // timestamp
    isActive: v.boolean(), // default false
  }).index("by_active", ["isActive"]),

  // 16. Visitor
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
