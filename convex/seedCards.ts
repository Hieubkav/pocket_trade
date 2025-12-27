import { mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { api } from "./_generated/api";

// Import JSON data files for card list
import A1_data from "./data/A1_data.json";
import A1a_data from "./data/A1a_data.json";
import A2_data from "./data/A2_data.json";
import A2a_data from "./data/A2a_data.json";
import A2b_data from "./data/A2b_data.json";
import A3_data from "./data/A3_data.json";
import A3a_data from "./data/A3a_data.json";
import A3b_data from "./data/A3b_data.json";
import A4_data from "./data/A4_data.json";
import A4a_data from "./data/A4a_data.json";
import A4B_data from "./data/A4B_data.json";
import B1_data from "./data/B1_data.json";
import B1A_data from "./data/B1A_data.json";
import PA_data from "./data/P-A_data.json";
import PB_data from "./data/P-B_data.json";

// Set code to folder name mapping
const SET_FOLDERS: Record<string, string> = {
  "A1": "Genetic Apex",
  "A1a": "Mythical Island",
  "A2": "Space-Time Smackdown",
  "A2a": "Triumphant Light",
  "A2b": "Shining Revelry",
  "A3": "Celestial Guardians",
  "A3a": "Extradimensional Crisis",
  "A3b": "Eevee Grove",
  "A4": "Wisdom of Sea and Sky",
  "A4a": "Secluded Springs",
  "A4B": "Deluxe Pack ex",
  "B1": "Mega Rising",
  "B1A": "Crimson Blaze",
  "P-A": "Promos-A",
  "P-B": "Promos-B",
};

// Map booster names (from JSON) to pack names in DB
const BOOSTER_TO_PACK: Record<string, string> = {
  // A1 - Genetic Apex
  "charizard": "Charizard",
  "mewtwo": "Mewtwo",
  "pikachu": "Pikachu",
  // A1a - Mythical Island
  "mew": "Mew",
  // A2 - Space-Time Smackdown
  "dialga": "Dialga",
  "palkia": "Palkia",
  // A2a - Triumphant Light
  "arceus": "Arceus",
  // A2b - Shining Revelry
  "shining": "Shiny Rayquaza",
  // A3 - Celestial Guardians
  "solgaleo": "Solgaleo",
  "lunala": "Lunala",
  // A3a - Extradimensional Crisis
  "extradimensional": "Ultra Beast",
  // A3b - Eevee Grove
  "eevee": "Eevee",
  // A4 - Wisdom of Sea and Sky
  "ho-oh": "Ho-Oh",
  "lugia": "Lugia",
  // A4a - Secluded Springs
  "suicune themed booster pack": "Latios & Latias",
  // A4B - Deluxe Pack ex
  "deluxe": "Deluxe ex",
  // B1 - Mega Rising
  "mega altaria": "Mega Altaria",
  "mega blaziken": "Mega Blaziken",
  "mega gyarados": "Mega Gyarados",
  // B1A - Crimson Blaze (tên booster trùng với A1 nhưng khác set)
  // Xử lý riêng trong code
};

// Rarity mapping from API to display name
const RARITY_MAP: Record<string, string> = {
  "One Diamond": "◆",
  "Two Diamond": "◆◆",
  "Three Diamond": "◆◆◆",
  "Four Diamond": "◆◆◆◆",
  "One Star": "★",
  "Two Star": "★★",
  "Three Star": "★★★",
  "Crown Rare": "♛",
  "Promo": "Promo",
};

interface CardData {
  id: string;
  name: string;
  localId: string;
  image: string;
  boosters?: string[];
}

interface SetData {
  id: string;
  name: string;
  cards: CardData[];
  boosters?: { id: string; name: string }[];
}

interface CardDetail {
  category: string; // "Pokemon" | "Trainer"
  rarity?: string;
  types?: string[];
  stage?: string;
  trainerType?: string;
}

// All sets data
const ALL_SETS: SetData[] = [
  A1_data as SetData,
  A1a_data as SetData,
  A2_data as SetData,
  A2a_data as SetData,
  A2b_data as SetData,
  A3_data as SetData,
  A3a_data as SetData,
  A3b_data as SetData,
  A4_data as SetData,
  A4a_data as SetData,
  A4B_data as SetData,
  B1_data as SetData,
  B1A_data as SetData,
  PA_data as SetData,
  PB_data as SetData,
];

// Generate local image URL
function getLocalImageUrl(setCode: string, localId: string, cardName: string): string {
  const folder = SET_FOLDERS[setCode];
  if (!folder) return "";
  
  let safeName = cardName.replace(/:/g, "_");
  if (setCode !== "A1") {
    safeName = safeName.replace(/'/g, "_");
  }
  
  if (setCode === "A4B") {
    return `/images/cards/${folder}/A4B-${localId}_${safeName}.webp`;
  }
  if (setCode === "B1A") {
    const b1aName = safeName.replace(/ /g, "_");
    return `/images/cards/${folder}/B1A-${localId}_${b1aName}.webp`;
  }
  if (setCode === "P-B") {
    return `/images/cards/${folder}/PROMO-B-${localId}_${safeName}.webp`;
  }
  
  return `/images/cards/${folder}/${localId}_${safeName}.webp`;
}

// Fetch card details from TCGdex API
async function fetchCardDetail(cardId: string): Promise<CardDetail | null> {
  try {
    const response = await fetch(`https://api.tcgdex.net/v2/en/cards/${cardId}`);
    if (!response.ok) return null;
    const data = await response.json();
    return {
      category: data.category || "Pokemon",
      rarity: data.rarity,
      types: data.types,
      stage: data.stage,
      trainerType: data.trainerType,
    };
  } catch {
    return null;
  }
}

// Mutation to clear all cards
export const clearCards = mutation({
  args: {},
  handler: async (ctx) => {
    const cards = await ctx.db.query("cards").collect();
    for (const card of cards) {
      await ctx.db.delete(card._id);
    }
    return { deleted: cards.length };
  },
});

// Mutation to insert a batch of cards
export const insertCardsBatch = mutation({
  args: {
    cards: v.array(v.object({
      name: v.string(),
      cardNumber: v.string(),
      imageUrl: v.string(),
      packId: v.id("packs"),
      rarityId: v.id("rarities"),
      supertype: v.string(),
      subtype: v.string(),
      type: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    for (const card of args.cards) {
      await ctx.db.insert("cards", card);
    }
    return { inserted: args.cards.length };
  },
});

// Mutation to get or create rarities - returns array to avoid non-ASCII field name issues
export const getOrCreateRarities = mutation({
  args: {},
  handler: async (ctx) => {
    const existingRarities = await ctx.db.query("rarities").collect();
    const existingNames = new Set(existingRarities.map(r => r.name));
    
    // Create missing rarities (imageUrl để trống, dùng seed rarities để có ảnh đúng)
    const allRarities = ["◆", "◆◆", "◆◆◆", "◆◆◆◆", "★", "★★", "★★★", "♛", "Promo"];
    for (const name of allRarities) {
      if (!existingNames.has(name)) {
        await ctx.db.insert("rarities", {
          name,
          imageUrl: "",
        });
      }
    }
    
    // Return all rarities as array
    const allRaritiesInDb = await ctx.db.query("rarities").collect();
    return allRaritiesInDb.map(r => ({ name: r.name, id: r._id }));
  },
});

// Mutation to get packs
export const getPacks = mutation({
  args: {},
  handler: async (ctx) => {
    const packs = await ctx.db.query("packs").collect();
    return packs;
  },
});

// Action to seed cards with detailed info from API
export const seedAllCards = action({
  args: {},
  handler: async (ctx): Promise<{ success: boolean; totalCards: number; error?: string }> => {
    // Clear existing cards
    await ctx.runMutation(api.seedCards.clearCards);
    
    // Get or create rarities - returns array of {name, id}
    const raritiesArray = await ctx.runMutation(api.seedCards.getOrCreateRarities);
    const rarityMap = new Map(raritiesArray.map(r => [r.name, r.id]));
    
    // Get packs
    const packs = await ctx.runMutation(api.seedCards.getPacks);
    const packMap = new Map(packs.map(p => [p.name.toLowerCase(), p._id]));
    
    const fallbackPackId = packs.length > 0 ? packs[0]._id : null;
    if (!fallbackPackId) {
      return { success: false, totalCards: 0, error: "No packs found. Run seed sets first." };
    }
    
    const defaultRarityId = rarityMap.get("◆") || raritiesArray[0]?.id;
    let totalCards = 0;
    
    for (const setData of ALL_SETS) {
      const setCode = setData.id;
      
      // Special case: B1A (Crimson Blaze) - all cards go to "Crimson Blaze" pack
      // because booster name "Charizard" conflicts with A1
      const specialSetPacks: Record<string, string> = {
        "B1A": "Crimson Blaze",
        "P-A": "Charizard", // Promos-A fallback to first pack
        "P-B": "Crimson Blaze", // Promos-B fallback
      };
      
      // Build booster to pack mapping for this set
      const setBoosterMap = new Map<string, Id<"packs">>();
      if (specialSetPacks[setCode]) {
        // Use special pack for entire set
        const specialPackId = packMap.get(specialSetPacks[setCode].toLowerCase());
        if (specialPackId) {
          setBoosterMap.set("__default__", specialPackId);
        }
      } else if (setData.boosters) {
        for (const booster of setData.boosters) {
          const packName = BOOSTER_TO_PACK[booster.name.toLowerCase()] || booster.name;
          const packId = packMap.get(packName.toLowerCase());
          if (packId) {
            setBoosterMap.set(booster.name.toLowerCase(), packId);
          }
        }
      }
      
      // Process cards in batches
      const BATCH_SIZE = 20;
      for (let i = 0; i < setData.cards.length; i += BATCH_SIZE) {
        const batch = setData.cards.slice(i, i + BATCH_SIZE);
        
        // Fetch details for this batch (parallel)
        const detailPromises = batch.map(card => fetchCardDetail(card.id));
        const details = await Promise.all(detailPromises);
        
        const cardsToInsert = batch.map((card, idx) => {
          const detail = details[idx];
          
          // Determine pack
          let packId = fallbackPackId;
          // Check for special set default pack first
          const defaultPackId = setBoosterMap.get("__default__");
          if (defaultPackId) {
            packId = defaultPackId;
          } else if (card.boosters && card.boosters.length > 0) {
            const boosterName = card.boosters[0].toLowerCase();
            const mappedPackId = setBoosterMap.get(boosterName);
            if (mappedPackId) packId = mappedPackId;
          }
          
          // Determine rarity
          let rarityId = defaultRarityId;
          if (detail?.rarity) {
            const mappedRarity = RARITY_MAP[detail.rarity] || detail.rarity;
            const foundRarityId = rarityMap.get(mappedRarity);
            if (foundRarityId) {
              rarityId = foundRarityId;
            }
          }
          
          // Determine supertype, subtype, and type
          let supertype = "pokemon";
          let subtype = "Basic";
          let type = "Colorless";
          
          if (detail) {
            if (detail.category === "Trainer") {
              supertype = "trainer";
              subtype = detail.trainerType || "Item";
              type = ""; // Trainer không có hệ
            } else {
              supertype = "pokemon";
              subtype = detail.stage || "Basic";
              type = detail.types?.[0] || "Colorless";
            }
          }
          
          const imageUrl = getLocalImageUrl(setCode, card.localId, card.name);
          
          return {
            name: card.name,
            cardNumber: card.localId,
            imageUrl,
            packId: packId as Id<"packs">,
            rarityId: rarityId as Id<"rarities">,
            supertype,
            subtype,
            type,
          };
        });
        
        await ctx.runMutation(api.seedCards.insertCardsBatch, { cards: cardsToInsert });
        totalCards += cardsToInsert.length;
        
        // Small delay between batches to avoid rate limiting
        if (i + BATCH_SIZE < setData.cards.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }
    
    return { success: true, totalCards };
  },
});

// Simple seed without API (fallback)
export const seedAllCardsSimple = mutation({
  args: {},
  handler: async (ctx) => {
    const existingCards = await ctx.db.query("cards").collect();
    for (const card of existingCards) {
      await ctx.db.delete(card._id);
    }

    const rarities = await ctx.db.query("rarities").collect();
    let defaultRarityId: Id<"rarities">;
    if (rarities.length === 0) {
      defaultRarityId = await ctx.db.insert("rarities", {
        name: "◆",
        imageUrl: "/images/rarities/common.png",
      });
    } else {
      defaultRarityId = rarities[0]._id;
    }

    const packs = await ctx.db.query("packs").collect();
    const packMap = new Map(packs.map(p => [p.name.toLowerCase(), p._id]));
    const fallbackPackId = packs.length > 0 ? packs[0]._id : null;

    if (!fallbackPackId) {
      return { success: false, error: "No packs found", totalCards: 0 };
    }

    let totalCards = 0;

    for (const setData of ALL_SETS) {
      const setCode = setData.id;

      const setBoosterMap = new Map<string, Id<"packs">>();
      if (setData.boosters) {
        for (const booster of setData.boosters) {
          const packName = BOOSTER_TO_PACK[booster.name.toLowerCase()] || booster.name;
          const packId = packMap.get(packName.toLowerCase());
          if (packId) {
            setBoosterMap.set(booster.name.toLowerCase(), packId);
          }
        }
      }

      for (const card of setData.cards) {
        let packId = fallbackPackId;
        if (card.boosters && card.boosters.length > 0) {
          const boosterName = card.boosters[0].toLowerCase();
          const mappedPackId = setBoosterMap.get(boosterName);
          if (mappedPackId) packId = mappedPackId;
        }

        const imageUrl = getLocalImageUrl(setCode, card.localId, card.name);

        await ctx.db.insert("cards", {
          name: card.name,
          cardNumber: card.localId,
          imageUrl,
          packId,
          rarityId: defaultRarityId,
          supertype: "pokemon",
          subtype: card.name.includes(" ex") ? "ex" : "Basic",
          type: "Colorless",
        });

        totalCards++;
      }
    }

    return { success: true, totalCards };
  },
});
