import Highlight from "./Highlight.js";

const styles = {
  facts: { display: "flex", flexWrap: "wrap", gap: "10px 24px", marginBottom: 16 },
  fact: { fontSize: 13, color: "#97A1B3", margin: 0 },
  factLabel: { color: "#5A6373" },
};

function Fact({ label, value, query }) {
  if (!value) return null;
  return (
    <p style={styles.fact}>
      <span style={styles.factLabel}>{label} </span>
      <Highlight text={value} query={query} />
    </p>
  );
}

// The small facts row under a card's rules. Moved out of EntryCard unchanged
// when the card gained a photo, to keep the card itself readable.
export default function EntryFacts({ players, materials, occasion, place, query }) {
  return (
    <div style={styles.facts}>
      <Fact label="Players" value={players} query={query} />
      <Fact label="You need" value={materials} query={query} />
      <Fact label="Played at" value={occasion} query={query} />
      <Fact label="Where" value={place} query={query} />
    </div>
  );
}
