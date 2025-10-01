/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as analytics from "../analytics.js";
import type * as careerPaths from "../careerPaths.js";
import type * as interviews from "../interviews.js";
import type * as progress from "../progress.js";
import type * as scraping from "../scraping.js";
import type * as users from "../users.js";
import type * as videoInterviews from "../videoInterviews.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  analytics: typeof analytics;
  careerPaths: typeof careerPaths;
  interviews: typeof interviews;
  progress: typeof progress;
  scraping: typeof scraping;
  users: typeof users;
  videoInterviews: typeof videoInterviews;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
