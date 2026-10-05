import { TEXT_FIELDS } from "../lib/entryRules.js";
import FormField from "./FormField.js";
import PhotoField from "./PhotoField.js";

// Every box in the entry form, in the order a person fills them in: the text
// fields from the rules, then the photo, then the optional video link. It
// only lays them out; EntryForm owns the values and decides what is wrong.
export default function EntryFields({ values, errors, onChange, onPhoto, currentPhoto, photoRequired }) {
  return (
    <>
      {TEXT_FIELDS.map((field) => (
        <FormField
          key={field.name}
          {...field}
          value={values[field.name]}
          error={errors[field.name]}
          onChange={onChange}
        />
      ))}
      <PhotoField
        currentUrl={currentPhoto}
        required={photoRequired}
        error={errors.photo}
        onChange={onPhoto}
      />
      <FormField
        name="youtube_url"
        label="YOUTUBE LINK · វីដេអូ"
        hint="Optional: a video of this game being played"
        value={values.youtube_url}
        error={errors.youtube_url}
        onChange={onChange}
      />
    </>
  );
}
