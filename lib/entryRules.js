// The rules from docs/entries-data-rules.md, checked in the browser before
// anything is sent. The database holds the same limits again as check
// constraints (docs/lab7-sql/3-check-constraints.sql), so a request that never
// touches the form is refused anyway. Change a limit here, change it there.
//
// Field names are the table's own column names, so the form's values go to
// Supabase without a renaming step in between.
export const TEXT_FIELDS = [
  { name: "title", label: "NAME OF THE GAME · ឈ្មោះល្បែង", hint: "Romanised, e.g. Chol Chhoung", max: 100 },
  { name: "khmer_title", label: "NAME IN KHMER · ឈ្មោះជាអក្សរខ្មែរ", hint: "Khmer script, e.g. ចោលឈូង", max: 200, khmer: true },
  { name: "description", label: "WHAT IT IS · អំពីល្បែងនេះ", hint: "What the game is, and why it is worth keeping", min: 20, max: 2000, long: true },
  { name: "how_to_play", label: "HOW IT IS PLAYED · របៀបលេង", hint: "The rules, simply enough for a child", min: 20, max: 3000, long: true },
  { name: "players", label: "PLAYERS · អ្នកលេង", hint: "Who and how many, e.g. Two teams, 3–10 each", max: 100 },
  { name: "materials", label: "YOU NEED · សម្ភារៈ", hint: "Write None if nothing is needed", max: 200 },
  { name: "occasion", label: "PLAYED AT · ពេលលេង", hint: "e.g. Khmer New Year, or any time", max: 200 },
  { name: "place", label: "WHERE · ទីកន្លែង", hint: "Where this version comes from: a village, a province", max: 200 },
  { name: "contributor", label: "TOLD BY · អ្នកប្រាប់", hint: "Only a real person who told you about it. Leave empty until someone has.", max: 100, optional: true },
  { name: "source", label: "SOURCE · ប្រភព", hint: "Where this information comes from, in plain words", max: 300 },
];

const KHMER = /[ក-៿]/;
const LATIN = /[A-Za-z]/;
const BARE_NUMBER = /^\s*[0-9]+\s*$/;

// Characters, not UTF-16 units: the same count Postgres's char_length makes.
const length = (text) => Array.from(text).length;

export function trimAll(values) {
  return Object.fromEntries(
    Object.entries(values).map(([name, value]) => [name, String(value ?? "").trim()])
  );
}

// { fieldName: "what to fix" } for every field that breaks a rule. An empty
// object means the entry can be sent. Expects values that are already trimmed.
export function checkEntry(values) {
  const errors = {};
  for (const field of TEXT_FIELDS) {
    const message = checkText(field, values[field.name] || "");
    if (message) errors[field.name] = message;
  }
  if (values.youtube_url && !youtubeUrl(values.youtube_url)) {
    errors.youtube_url = "Paste a YouTube link (youtube.com/watch?v=… or youtu.be/…), or leave this empty.";
  }
  return errors;
}

function checkText({ name, min = 1, max, optional, khmer }, text) {
  const n = length(text);
  if (n === 0) return optional ? null : "Required.";
  if (n < min) return `Too short: at least ${min} characters, please.`;
  if (n > max) return `Too long: ${n} characters, the limit is ${max}.`;
  if (khmer && (!KHMER.test(text) || LATIN.test(text))) {
    return "Write this in Khmer script, with no Latin letters.";
  }
  if (name === "players" && BARE_NUMBER.test(text)) {
    return "Say who plays, not only a number: e.g. 5 or more children.";
  }
  return null;
}

// Takes the YouTube links people actually paste (youtu.be/…, watch?v=…,
// /shorts/…, m.youtube.com, with or without https://) and returns the one
// shape the database accepts, or null. Only the 11-character video id is
// kept, so nothing else from the pasted text can reach a page.
export function youtubeUrl(text) {
  let url;
  try {
    url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www\.|m\.)/, "");
  let id = null;
  if (host === "youtu.be") id = url.pathname.slice(1);
  else if (host === "youtube.com" && url.pathname === "/watch") id = url.searchParams.get("v");
  else if (host === "youtube.com") id = url.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)/)?.[1];
  return /^[A-Za-z0-9_-]{11}$/.test(id || "") ? `https://www.youtube.com/watch?v=${id}` : null;
}
