import "server-only";
// Deliberately unconfigured. The Google profile link is the always available fallback.
// Before implementation verify current official Google API, attribution and caching policies.
export interface GoogleReviewsAdapter {
  getReviews(): Promise<
    { author: string; text: string; rating: number; sourceUrl: string }[]
  >;
}
export function getGoogleReviewsAdapter(): GoogleReviewsAdapter | null {
  return null;
}
