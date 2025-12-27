/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as cards from "../cards.js";
import type * as files from "../files.js";
import type * as packs from "../packs.js";
import type * as rarities from "../rarities.js";
import type * as seed from "../seed.js";
import type * as seedCards from "../seedCards.js";
import type * as series from "../series.js";
import type * as sets from "../sets.js";
import type * as tradePosts from "../tradePosts.js";
import type * as traders from "../traders.js";
import type * as visitors from "../visitors.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  cards: typeof cards;
  files: typeof files;
  packs: typeof packs;
  rarities: typeof rarities;
  seed: typeof seed;
  seedCards: typeof seedCards;
  series: typeof series;
  sets: typeof sets;
  tradePosts: typeof tradePosts;
  traders: typeof traders;
  visitors: typeof visitors;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
