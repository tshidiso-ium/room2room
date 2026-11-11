// A listing becomes "Hot" once it has been opened at least this many times.
export const HOT_LISTING_VIEW_THRESHOLD = 10;

export function isHotListing(visitCount) {
  return Number(visitCount) >= HOT_LISTING_VIEW_THRESHOLD;
}
