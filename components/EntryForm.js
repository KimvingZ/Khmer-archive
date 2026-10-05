"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client.js";
import { checkEntry, formValues, trimAll } from "../lib/entryRules.js";
import { checkPhoto } from "../lib/photos.js";
import { saveEntry } from "../lib/saveEntry.js";
import EntryFields from "./EntryFields.js";
import SaveButton from "./SaveButton.js";

// The one form behind /contribute and Edit. Every rule is checked here first,
// so a mistake gets a message next to its field before anything is sent.
// Given an `entry` it starts filled in and the photo becomes optional.
// saveEntry does the sending; the database checks the same rules again.
export default function EntryForm({ entry = null }) {
  const router = useRouter();
  const [values, setValues] = useState(() => formValues(entry));
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  function change(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => (current[name] ? { ...current, [name]: null } : current));
  }

  // A new entry needs a photo. An edit only checks one if a new one was picked.
  const photoProblem = (file) => (file || !entry ? checkPhoto(file) : null);

  function choosePhoto(file) {
    setPhoto(file);
    setErrors((current) => ({ ...current, photo: photoProblem(file) }));
  }

  async function submit(event) {
    event.preventDefault();
    const clean = trimAll(values);
    const found = checkEntry(clean);
    const photoError = photoProblem(photo);
    if (photoError) found.photo = photoError;
    setErrors(found);
    setMessage(null);

    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(first)?.focus();
      return setMessage("Some fields need fixing first. Each one says what to change.");
    }

    setSaving(true);
    const result = await saveEntry(createClient(), clean, photo, entry);
    if (result.message) {
      setSaving(false);
      return setMessage(result.message);
    }
    // Stays "Saving…" while the page changes, so it can't be sent twice.
    router.push(`/entries/${result.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={submit} noValidate style={{ marginTop: 40 }}>
      <EntryFields
        values={values}
        errors={errors}
        onChange={change}
        onPhoto={choosePhoto}
        currentPhoto={entry?.photo_url}
        photoRequired={!entry}
      />
      <SaveButton
        saving={saving}
        label={entry ? "Save changes" : "Add this game"}
        message={message}
      />
    </form>
  );
}
