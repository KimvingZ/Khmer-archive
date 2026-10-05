// The columns a card shows, for the home page and for a game's own page.
//
// The table's columns are snake_case, the Postgres habit. The components have
// used camelCase since week 3. "khmerTitle:khmer_title" renames a column on
// its way out of Supabase, so nothing downstream has to change.
// owner and created_at are left out on purpose: the page shows neither, and
// whatever is selected here is sent to every visitor's browser.
export const CARD_COLUMNS =
  "id, title, khmerTitle:khmer_title, description, howToPlay:how_to_play, " +
  "players, materials, occasion, place, contributor, source, " +
  "photoUrl:photo_url, youtubeUrl:youtube_url";
