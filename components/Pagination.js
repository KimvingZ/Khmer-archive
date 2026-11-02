const MONO = "'Courier New', monospace";

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 32,
  },
  button: {
    fontFamily: MONO,
    fontSize: 13,
    minWidth: 38,
    padding: "8px 12px",
    color: "#C7CEDA",
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 8,
    cursor: "pointer",
  },
  current: { color: "#0E1116", backgroundColor: "#2EE6A8", borderColor: "#2EE6A8", fontWeight: 700 },
  spent: { color: "#5A6373", cursor: "not-allowed" },
  status: { fontFamily: MONO, fontSize: 13, color: "#97A1B3", textAlign: "center", margin: "12px 0 0" },
};

// Controls only. It does not know what is being paged or how many fit on a
// page — it is told the numbers and reports back which one was clicked.
export default function Pagination({ page, pageCount, onChange }) {
  if (pageCount < 2) return null; // one page is not a pagination

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <>
      <nav style={styles.nav} aria-label="Pagination">
        <button
          type="button"
          style={{ ...styles.button, ...(page === 1 ? styles.spent : null) }}
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
        >
          ‹ prev
        </button>

        {pages.map((n) => (
          <button
            key={n}
            type="button"
            style={{ ...styles.button, ...(n === page ? styles.current : null) }}
            onClick={() => onChange(n)}
            aria-current={n === page ? "page" : undefined}
          >
            {n}
          </button>
        ))}

        <button
          type="button"
          style={{
            ...styles.button,
            ...(page === pageCount ? styles.spent : null),
          }}
          onClick={() => onChange(page + 1)}
          disabled={page === pageCount}
        >
          next ›
        </button>
      </nav>

      <p style={styles.status}>
        page {page} of {pageCount}
      </p>
    </>
  );
}
