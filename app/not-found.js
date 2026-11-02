import Link from "next/link";
import collection from "../collection.config.js";
import PageShell from "../components/PageShell.js";

export const metadata = { title: `Not found — ${collection.name}` };

const styles = {
  back: { display: "inline-block", marginTop: 24, fontSize: 15, color: "#2EE6A8" },
};

// Shown for any address that isn't a page, and for a game that has been
// deleted, which is why it says so and offers the way back.
export default function NotFound() {
  return (
    <PageShell
      kicker="404"
      title="Not found"
      description="រកមិនឃើញទំព័រនេះទេ។ ល្បែងនេះអាចត្រូវបានលុប ឬអាសយដ្ឋានមិនត្រឹមត្រូវ · This page isn't here. The game may have been deleted, or the address may be wrong."
    >
      <Link href="/" style={styles.back}>
        ← All games
      </Link>
    </PageShell>
  );
}
