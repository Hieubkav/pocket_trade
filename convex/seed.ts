import { mutation } from "./_generated/server";

// Pokemon TCG Pocket Sets Data (accurate as of December 2025)
const SERIES_DATA = [
  { name: "A Series" },
  { name: "B Series" },
  { name: "Promo" },
];

const SETS_DATA = [
  // A Series - Main Sets
  {
    name: "Genetic Apex",
    setCode: "A1",
    seriesName: "A Series",
    imageUrl: "https://assets.pokemon-zone.com/game-assets/UI/Textures/System/Exp/LOGO_expansion_A1_en_US.webp",
    packs: ["Charizard", "Mewtwo", "Pikachu"],
  },
  {
    name: "Mythical Island",
    setCode: "A1a",
    seriesName: "A Series",
    imageUrl: "https://assets.pokemon-zone.com/game-assets/UI/Textures/System/Exp/LOGO_expansion_A1a_en_US.webp",
    packs: ["Mew"],
  },
  {
    name: "Space-Time Smackdown",
    setCode: "A2",
    seriesName: "A Series",
    imageUrl: "https://assets.pokemon-zone.com/game-assets/UI/Textures/System/Exp/LOGO_expansion_A2_en_US.webp",
    packs: ["Dialga", "Palkia"],
  },
  {
    name: "Triumphant Light",
    setCode: "A2a",
    seriesName: "A Series",
    imageUrl: "https://assets.pokemon-zone.com/game-assets/UI/Textures/System/Exp/LOGO_expansion_A2a_en_US.webp",
    packs: ["Arceus"],
  },
  {
    name: "Shining Revelry",
    setCode: "A2b",
    seriesName: "A Series",
    imageUrl: "https://assets.pokemon-zone.com/game-assets/UI/Textures/System/Exp/LOGO_expansion_A2b_en_US.webp",
    packs: ["Shiny Rayquaza"],
  },
  {
    name: "Celestial Guardians",
    setCode: "A3",
    seriesName: "A Series",
    imageUrl: "https://assets.pokemon-zone.com/game-assets/UI/Textures/System/Exp/LOGO_expansion_A3_en_US.webp",
    packs: ["Solgaleo", "Lunala"],
  },
  {
    name: "Extradimensional Crisis",
    setCode: "A3a",
    seriesName: "A Series",
    imageUrl: "https://assets.pokemon-zone.com/game-assets/UI/Textures/System/Exp/LOGO_expansion_A3a_en_US.webp",
    packs: ["Ultra Beast"],
  },
  {
    name: "Eevee Grove",
    setCode: "A3b",
    seriesName: "A Series",
    imageUrl: "https://assets.pokemon-zone.com/game-assets/UI/Textures/System/Exp/LOGO_expansion_A3b_en_US.webp",
    packs: ["Eevee"],
  },
  {
    name: "Wisdom of Sea and Sky",
    setCode: "A4",
    seriesName: "A Series",
    imageUrl: "https://assets.pokemon-zone.com/game-assets/UI/Textures/System/Exp/LOGO_expansion_A4_en_US.webp",
    packs: ["Ho-Oh", "Lugia"],
  },
  {
    name: "Secluded Springs",
    setCode: "A4a",
    seriesName: "A Series",
    imageUrl: "https://assets.pokemon-zone.com/game-assets/UI/Textures/System/Exp/LOGO_expansion_A4a_en_US.webp",
    packs: ["Latios & Latias"],
  },
  {
    name: "Deluxe Pack ex",
    setCode: "A4b",
    seriesName: "A Series",
    imageUrl: "https://assets.pokemon-zone.com/game-assets/UI/Textures/System/Exp/LOGO_expansion_A4b_en_US.webp",
    packs: ["Deluxe ex"],
  },
  // B Series
  {
    name: "Mega Rising",
    setCode: "B1",
    seriesName: "B Series",
    imageUrl: "https://assets.pokemon-zone.com/game-assets/UI/Textures/System/Exp/LOGO_expansion_B1_en_US.webp",
    packs: ["Mega Altaria", "Mega Blaziken", "Mega Gyarados"],
  },
  {
    name: "Crimson Blaze",
    setCode: "B1a",
    seriesName: "B Series",
    imageUrl: "https://assets.pokemon-zone.com/game-assets/UI/Textures/System/Exp/LOGO_expansion_B1a_en_US.webp",
    packs: ["Crimson Blaze"],
  },
  // Promo Sets
  {
    name: "Promo-A",
    setCode: "PROMO-A",
    seriesName: "Promo",
    imageUrl: "",
    packs: [],
  },
  {
    name: "Promo-B",
    setCode: "PROMO-B",
    seriesName: "Promo",
    imageUrl: "",
    packs: [],
  },
];

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing data
    const existingSeries = await ctx.db.query("series").collect();
    const existingSets = await ctx.db.query("sets").collect();
    const existingPacks = await ctx.db.query("packs").collect();
    
    for (const pack of existingPacks) {
      await ctx.db.delete(pack._id);
    }
    for (const set of existingSets) {
      await ctx.db.delete(set._id);
    }
    for (const series of existingSeries) {
      await ctx.db.delete(series._id);
    }

    // Insert Series
    const seriesMap: Record<string, typeof existingSeries[0]["_id"]> = {};
    for (const series of SERIES_DATA) {
      const id = await ctx.db.insert("series", { name: series.name });
      seriesMap[series.name] = id;
    }

    // Insert Sets and Packs
    for (const setData of SETS_DATA) {
      const seriesId = seriesMap[setData.seriesName];
      if (!seriesId) continue;

      const setId = await ctx.db.insert("sets", {
        name: setData.name,
        setCode: setData.setCode,
        imageUrl: setData.imageUrl,
        seriesId,
      });

      for (const packName of setData.packs) {
        await ctx.db.insert("packs", {
          name: packName,
          setId,
        });
      }
    }

    return {
      success: true,
      seriesCount: SERIES_DATA.length,
      setsCount: SETS_DATA.length,
      packsCount: SETS_DATA.reduce((acc, s) => acc + s.packs.length, 0),
    };
  },
});

export const seedSeries = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("series").collect();
    if (existing.length > 0) {
      return { success: false, message: "Series already exist. Clear first." };
    }

    for (const series of SERIES_DATA) {
      await ctx.db.insert("series", { name: series.name });
    }
    return { success: true, count: SERIES_DATA.length };
  },
});
