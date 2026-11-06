// The review step's words. The keys are the statuses the database allows
// (docs/sprint3-sql/1-review-step.sql): pending, published and returned.
export const STATUS_LABELS = {
  pending: "រង់ចាំការពិនិត្យ · Waiting for review",
  published: "បានផ្សាយ · Published",
  returned: "បានបញ្ជូនត្រឡប់ · Returned",
};

// Is this person one of the archive's reviewers? The reviewers table only
// ever shows a person their own row, so this asks "is my row there?". It
// decides what a page shows. It is not the lock: the database checks the
// same table again on every publish and return.
export async function isReviewer(supabase, userId) {
  const { data, error } = await supabase
    .from("reviewers")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) console.error("reviewer check failed:", error.message);
  return Boolean(data);
}
