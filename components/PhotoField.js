"use client";

import { useEffect, useState } from "react";
import { PHOTO_TYPES } from "../lib/photos.js";

const styles = {
  field: { marginBottom: 24 },
  label: {
    display: "block",
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    letterSpacing: 1,
    color: "#5A6373",
    margin: "0 0 6px",
  },
  hint: { fontSize: 13, color: "#5A6373", margin: "0 0 8px" },
  preview: { display: "block", maxWidth: "100%", maxHeight: 260, borderRadius: 8, marginBottom: 10 },
  input: { fontSize: 14, color: "#C7CEDA" },
  error: { fontSize: 14, color: "#C9A227", margin: "6px 0 0" },
};

// The photo picker. It shows the chosen photo before anything is uploaded,
// from a blob: URL that never leaves this browser, and hands the file to the
// form, which decides whether it passes.
export default function PhotoField({ error, onChange }) {
  const [preview, setPreview] = useState(null);

  // A preview URL keeps the file in memory until it is let go.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function choose(event) {
    const file = event.target.files?.[0] || null;
    setPreview(file && PHOTO_TYPES[file.type] ? URL.createObjectURL(file) : null);
    onChange(file);
  }

  return (
    <div style={styles.field}>
      <label htmlFor="photo" style={styles.label}>
        PHOTO · រូបថត
      </label>
      <p id="photo-hint" style={styles.hint}>
        A photo of the game: JPG, PNG or WebP, up to 5 MB.
      </p>
      {preview ? <img src={preview} alt="The photo you chose" style={styles.preview} /> : null}
      <input
        id="photo"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={choose}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "photo-error" : "photo-hint"}
        style={styles.input}
      />
      {error ? (
        <p id="photo-error" style={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
