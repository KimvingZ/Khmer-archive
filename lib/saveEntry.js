import { redraw, uploadPhoto, removePhoto } from "./photos.js";
import { youtubeUrl } from "./entryRules.js";

// The columns a contributor fills in. The row sent to the table is built
// from this list and nothing else, so a field the form doesn't know about
// can't ride along, and owner, id and created_at never come from the form.
const COLUMNS = [
  "title",
  "khmer_title",
  "description",
  "how_to_play",
  "players",
  "materials",
  "occasion",
  "place",
  "contributor",
  "source",
];

// One sentence per way a save can fail, each one something the person can
// act on. The real error goes to console.error; error.message never reaches
// the screen.
const MESSAGES = {
  login: "You're not logged in any more. Log in again, then save.",
  photo: "That file couldn't be read as a photo. Try another JPG, PNG or WebP.",
  upload: "The photo didn't upload. Check your connection and try again.",
  rules: "The archive refused one of the fields. Check them and try again.",
  save: "The game wasn't saved. Check your connection and try again.",
};

// Adds a new entry. Returns { id } once the database has confirmed the row,
// or { message } with the one sentence to show.
export async function saveEntry(supabase, values, photo) {
  let photoUrl = null;
  try {
    // owner comes from the session Supabase has just re-checked, never from
    // the form. A network failure is not the same news as being logged out.
    const { data: auth, error: authError } = await within(15000, supabase.auth.getUser());
    const user = auth?.user;
    if (!user) throw failure(authError?.name === "AuthRetryableFetchError" ? "save" : "login", authError);

    const clean = await redraw(photo).catch((cause) => {
      throw failure("photo", cause);
    });
    photoUrl = await within(45000, uploadPhoto(supabase, user.id, clean)).catch((cause) => {
      throw failure("upload", cause);
    });

    const row = { owner: user.id, photo_url: photoUrl, youtube_url: youtubeUrl(values.youtube_url) };
    for (const column of COLUMNS) row[column] = values[column] || null;

    const { data, error } = await supabase
      .from("entries")
      .insert(row)
      .select("id")
      .abortSignal(AbortSignal.timeout(15000));
    // 23514 is a check constraint saying no: the form's rules and the
    // database's rules disagree, which is worth its own sentence.
    if (error) throw failure(error.code === "23514" ? "rules" : "save", error);
    if (!data?.length) throw failure("save", new Error("no row came back"));
    return { id: data[0].id };
  } catch (error) {
    console.error("saving the entry failed:", error.step || "unexpected", error.cause || error);
    // The row didn't land, so the photo uploaded for it has no entry.
    if (photoUrl) removePhoto(supabase, photoUrl);
    return { message: MESSAGES[error.step] || MESSAGES.save };
  }
}

function failure(step, cause) {
  return Object.assign(new Error(`saving failed at: ${step}`), { step, cause });
}

// supabase-js can't cancel an upload, so a connection that drops halfway
// would leave the button on "Saving…" for good (the book's p. 155 bug).
// This stops waiting after `ms` and lets the person try again.
function within(ms, promise) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`no answer after ${ms / 1000} s`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}
