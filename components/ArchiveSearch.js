"use client";

import { useState } from "react";
import PagedEntryList from "./PagedEntryList.js";
import NoResults from "./NoResults.js";

// Filters the array it was handed. No server, no fetch, no packages.
const FIELDS = [
  "title",
  "khmerTitle",
  "description",
  "howToPlay",
  "players",
  "materials",
  "occasion",
  "place",
  "contributor",
];

// toLowerCase is a no-op on Khmer script, so a Khmer query matches the same
// way a romanised one does.
function matches(entry, query) {
  return FIELDS.some((field) =>
    String(entry[field] || "")
      .toLowerCase()
      .includes(query)
  );
}

const styles = {
  wrap: { marginTop: 32 },
  label: {
    display: "block",
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    letterSpacing: 1,
    color: "#97A1B3",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    fontSize: 16,
    color: "#E8EDF2",
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
    outline: "none",
  },
  count: {
    fontFamily: "'Courier New', monospace",
    fontSize: 13,
    color: "#97A1B3",
    margin: "12px 0 0",
  },
};

export default function ArchiveSearch({ entries }) {
  const [query, setQuery] = useState("");

  const needle = query.trim().toLowerCase();
  const visible = needle ? entries.filter((e) => matches(e, needle)) : entries;

  return (
    <div style={styles.wrap}>
      <label htmlFor="archive-search" style={styles.label}>
        SEARCH THE ARCHIVE · ស្វែងរក
      </label>
      <input
        id="archive-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="chhoung, New Year, ក្រមា…"
        style={styles.input}
      />

      <p style={styles.count} aria-live="polite">
        {needle
          ? `${visible.length} of ${entries.length} games match "${query.trim()}"`
          : `showing all ${entries.length} games`}
      </p>

      {visible.length > 0 ? (
        // key={needle} remounts the list when the query changes, so a new search
        // always starts you on page 1 instead of a stale page 2.
        <PagedEntryList key={needle} entries={visible} query={needle} />
      ) : (
        <NoResults query={query.trim()} />
      )}
    </div>
  );
}
