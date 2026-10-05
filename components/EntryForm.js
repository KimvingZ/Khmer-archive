"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client.js";
import { TEXT_FIELDS, checkEntry, trimAll } from "../lib/entryRules.js";
import { checkPhoto } from "../lib/photos.js";
import { saveEntry } from "../lib/saveEntry.js";
import FormField from "./FormField.js";
import PhotoField from "./PhotoField.js";
import SaveButton from "./SaveButton.js";

const EMPTY = Object.fromEntries(
  [...TEXT_FIELDS.map((field) => field.name), "youtube_url"].map((name) => [name, ""])
);

// The contribution form. Every rule is checked here first, so a mistake gets
// a message next to its field before anything is sent. saveEntry does the
// sending, and the database checks the same rules again on its side.
export default function EntryForm() {
  const router = useRouter();
  const [values, setValues] = useState(EMPTY);
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  function change(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => (current[name] ? { ...current, [name]: null } : current));
  }

  function choosePhoto(file) {
    setPhoto(file);
    setErrors((current) => ({ ...current, photo: checkPhoto(file) }));
  }

  async function submit(event) {
    event.preventDefault();
    const clean = trimAll(values);
    const found = checkEntry(clean);
    const photoError = checkPhoto(photo);
    if (photoError) found.photo = photoError;
    setErrors(found);
    setMessage(null);

    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(first)?.focus();
      return setMessage("Some fields need fixing first. Each one says what to change.");
    }

    setSaving(true);
    const result = await saveEntry(createClient(), clean, photo);
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
      {TEXT_FIELDS.map((field) => (
        <FormField
          key={field.name}
          {...field}
          value={values[field.name]}
          error={errors[field.name]}
          onChange={change}
        />
      ))}
      <PhotoField error={errors.photo} onChange={choosePhoto} />
      <FormField
        name="youtube_url"
        label="YOUTUBE LINK · វីដេអូ"
        hint="Optional: a video of this game being played"
        value={values.youtube_url}
        error={errors.youtube_url}
        onChange={change}
      />
      <SaveButton saving={saving} label="Add this game" message={message} />
    </form>
  );
}
