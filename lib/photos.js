// Everything about entry photos that isn't React: the rules for a file, the
// redraw that cleans it, and the trip to and from the "photos" bucket.

// The bucket refuses anything else (docs/lab7-sql/0-photos-bucket-and-columns.sql).
// The form checks first so a person gets a sentence instead of a 413.
export const PHOTO_TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

// Where every photo this archive stores lives. A photo_url that starts
// anywhere else did not come from the form and is never shown.
export const PHOTO_URL_PREFIX = `${String(process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "")}/storage/v1/object/public/photos/`;

export function checkPhoto(file) {
  if (!file) return "Choose a photo of the game.";
  if (!PHOTO_TYPES[file.type]) return "Use a JPG, PNG or WebP photo.";
  if (file.size > MAX_PHOTO_BYTES) return "This photo is over 5 MB. Choose a smaller one.";
  return null;
}

// OWASP's advice for uploaded images is to rewrite them rather than trust
// them. Drawing the photo onto a canvas and saving a fresh file keeps only
// the pixels: the GPS location a phone hides inside a photo is gone, and so
// is anything else tucked into the file. A file that only claims to be an
// image fails to load right here and never leaves the browser.
export async function redraw(file) {
  const image = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  canvas.getContext("2d").drawImage(image, 0, 0);
  const blob = await toBlob(canvas, file.type);
  // A browser that can't write WebP hands back a much bigger PNG instead.
  // For a photo, JPEG is the safe fallback.
  if (blob.type !== file.type || blob.size > MAX_PHOTO_BYTES) return toBlob(canvas, "image/jpeg");
  return blob;
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const src = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(src);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(src);
      reject(new Error("the file is not a readable image"));
    };
    image.src = src;
  });
}

function toBlob(canvas, type) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("could not encode the photo"))), type, 0.9);
  });
}

// Stored at <user id>/<random uuid>.<extension>. The folder is what the
// storage policy checks; the name the file arrived with is never used.
// Returns the public URL, or throws with Supabase's error as the cause.
export async function uploadPhoto(supabase, userId, blob) {
  const path = `${userId}/${crypto.randomUUID()}.${PHOTO_TYPES[blob.type]}`;
  const { error } = await supabase.storage.from("photos").upload(path, blob, {
    contentType: blob.type,
    cacheControl: "31536000", // a name is never reused, so browsers can keep it
    upsert: false,
  });
  if (error) throw new Error("photo upload failed", { cause: error });
  return supabase.storage.from("photos").getPublicUrl(path).data.publicUrl;
}

// Best effort, and never awaited by the person: a photo left behind is
// untidy, not dangerous. remove() reports success even when it deletes
// nothing, so an empty answer is logged as the failure it is.
export async function removePhoto(supabase, url) {
  if (!url || !url.startsWith(PHOTO_URL_PREFIX)) return;
  const path = url.slice(PHOTO_URL_PREFIX.length);
  try {
    const { data, error } = await supabase.storage.from("photos").remove([path]);
    if (error || !data?.length) console.error("photo not removed:", path, error || "nothing deleted");
  } catch (error) {
    console.error("photo not removed:", path, error);
  }
}
