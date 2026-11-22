# Khmer Traditional Games · ល្បែងប្រជាប្រិយខ្មែរ

**Live site:** https://khmer-archive.vercel.app/

**Repository:** https://github.com/KimvingZ/Khmer-archive

Built by Kimving NGO for ICT 340 (Vibe Coding), American University of Phnom Penh, Fall 2026.

## 1. What this is

Khmer Traditional Games is a bilingual (Khmer and English) archive of eight games that Khmer people play at Khmer New Year, on pagoda festival grounds and in the street: Chol Chhoung, Bos Angkunh, Leak Kanseng, Teanh Prot, Bay Khom, Klah Klok, Chab Kon Kleng and Sey. I learned these games from my mother, grandmother and grandfather, and I still play them every year with family and friends. Each entry gives the game's name in Khmer script, what it is, how it is played, who plays it, what is needed, when and where it is played, a photo, a video link, and the published sources that describe it. Anyone can browse and search the archive without an account. A contributor can sign up and add a game, which becomes public only after the reviewer publishes it.

## 2. Who it is for

The archive is for Khmer speakers in Cambodia who want to know how these games are played: children and students, parents, and teachers who organise games for Khmer New Year. Most of them will open it on a phone, often on mobile data, and many will read Khmer more comfortably than English. What I did for them:

- **Khmer on every screen.** Every game has its name in Khmer script. The archive's name and description, the page descriptions, links, buttons, form labels and hints, status words, messages and empty states are written in Khmer and English. Search accepts Khmer script, and the match highlight is widened to whole Khmer syllables so that a partial match never breaks the script (`components/Highlight.js`). One limitation remains: the descriptions and rules of the eight games are still in English only.
- **Phones first.** The layout is a single column no wider than 720 px. It was tested at a 390 px screen width with no horizontal scrolling, and no text is smaller than 12 px.
- **Slow connections.** Pages are rendered on the server. The list of games arrives with the home page, and search filters it in the browser without further requests. Photos below the first screen load only when they are needed, and uploaded photos are limited to 5 MB and re-encoded in the browser before upload.
- **Plain messages.** Every error and empty state is a complete sentence in Khmer and English. Raw database errors are never shown to the user; they go only to the browser console or the server log.
- **Credit.** Each game shows who taught it ("Told by") and the published sources that describe it ("Source"). The home page names the curator and the archive's sources.

## 3. How it works

**Stack.** Next.js 15 (App Router) and React 19 in plain JavaScript with inline styles, deployed on Vercel, which publishes every push to `main`. Supabase provides the accounts (email and password, with email confirmation and password reset through a Gmail sender), the Postgres database and the photo storage. The only packages besides Next.js and React are `@supabase/supabase-js` and `@supabase/ssr`.

**Rendering.** Pages are Server Components that query Supabase on the server with the visitor's session cookie. `middleware.js` only refreshes that session. Client components handle the forms, search, pagination, and the review, delete and log-out buttons.

**Tables.**

- `entries`: `id`, `created_at`, `owner` (the account that added it), `title`, `khmer_title`, `description`, `how_to_play`, `players`, `materials`, `occasion`, `place`, `contributor` (optional), `source`, `photo_url`, `youtube_url`, `status` and `review_note`.
- `reviewers`: one column, `user_id`. It holds a single row: my reviewer account.
- Storage bucket `photos`: public, JPEG, PNG or WebP only, at most 5 MB. Each file is stored as `<user id>/<random uuid>.<extension>`.

**Entry statuses.** `pending` is the default; every new entry and every edit by its owner is pending. `published` entries are visible to everyone. `returned` entries were sent back by the reviewer with a note of 1 to 500 characters.

**Row-level security on `entries` (six policies).**

| Policy | Action | Rule |
| --- | --- | --- |
| anyone can read published entries | select | `status = 'published'` |
| owners read their own entries | select | logged in, and `auth.uid() = owner` |
| reviewers read every entry | select | logged in, and the account is in `reviewers` |
| owners add their own entries, pending only | insert | `auth.uid() = owner` and `status = 'pending'` |
| owners edit their own entries, back to pending | update | own rows only, and the saved row must be `pending` |
| owners delete their own entries | delete | `auth.uid() = owner` |

**Other rules in the database.**

- `reviewers` has row-level security with a single policy, "reviewers see their own row" (select where `auth.uid() = user_id`). It has no insert, update or delete policy, so no one can add a reviewer from the website or the console.
- Storage has three policies on the `photos` bucket: a logged-in contributor may upload into, see and delete files in their own folder only.
- `review_entry(entry_id, decision, note)` is the only way to publish or return an entry (section 4).
- Eighteen check constraints repeat the form's rules (`lib/entryRules.js`): a length limit on every text field; `khmer_title` must contain Khmer script and no Latin letters; `players` cannot be a bare number (0–9 or ០–៩); `photo_url` must point to the owner's own folder in this project's bucket; `youtube_url` must have one exact shape; `created_at` cannot be in the future; `status` must be one of the three statuses; and a review note exists only on a returned entry.

**Where published-only is enforced.** In the database, by the select policies above: a visitor can read only published rows. In the code, `components/ArchiveEntries.js` also filters on `status = 'published'`, so that the owner and the reviewer, who may read more, see the same public archive on the home page as everyone else.

The tables, policies, function and bucket were created in the Supabase SQL Editor. The SQL files are kept outside this public repository because they contain account details; the descriptions above match what was run.

## 4. Security decisions

**The gate: `review_entry`.** `review_entry(entry_id uuid, decision text, note text default null)` returns `true` or `false`. It runs as `security definer` with an empty `search_path`, and it changes an entry only when all of these hold: the caller is in `reviewers`; the decision is `published` or `returned`; a return carries a note of 1 to 500 characters; and the entry is still `pending`. It then sets the status and the note in one statement and returns `true` only if a row changed. Logged-out visitors cannot call it at all (execute is revoked from `anon`), and a logged-in stranger receives `false`. The queue's buttons (`components/ReviewButtons.js`) count a decision as successful only when the answer is exactly `true`.

**Why the gate lives in the database.** The publishable key is in every visitor's browser, so anyone can skip my pages and send requests to Supabase directly from the console. Only the database sees every request. Until 10 November, reviewers had an update policy on `entries`; it allowed my reviewer account to change any column of any entry. I replaced it with `review_entry`, so a reviewer can now only publish or return a pending entry.

**What a hidden button does and does not protect.** The "Review queue" link and the queue itself appear only for reviewers (`lib/review.js`). That decides what a page shows; it does not stop anyone. A stranger who sends the same request from the console is refused by the policies and by `review_entry`.

**Tested on the live site** (10 November 2026, with a second, non-reviewer account in the browser console):

| Attack | Result |
| --- | --- |
| Insert an entry with status `published` | refused: 403, row-level security (42501) |
| Update my own entry to `published` | refused: 403, row-level security (42501) |
| Call `review_entry` on my own pending entry | `false` |
| Insert myself into `reviewers` | refused: 403, row-level security (42501) |
| Logged out, ask for entries that are not published | empty list `[]` (repeated on 13 November 2026) |
| Update or delete another account's entry | no rows changed, entry unchanged after reload |

**Decisions the briefs left to me.**

- **What a returned entry says.** The game's page and its edit page show "Returned" with the reviewer's note and an instruction to fix the game and save it to send it for review again. My games shows the status of every game. A return without a note is refused, so a contributor always learns why.
- **Taking down published entries.** Reviewers cannot. The reviewer's only power is `review_entry`, which acts on pending entries; only an entry's owner can delete it. Keeping the reviewer's powers to one narrow function was deliberate. Removing spam would need a reviewer delete policy for entries and photos, which I have not built.
- **Edits by the reviewer.** My reviewer account owns no games and has no right to edit anyone else's, so a reviewer edit can never change or unpublish a published game. Every edit by an owner returns the game to pending.
- **What search shows a contributor about their own pending entries.** Nothing. The home page and search list only published games for everyone, including the owner and the reviewer. A contributor finds pending and returned games on My games and on each game's own page, which shows its status.
- **Account privacy.** The login page gives one message for a wrong email or a wrong password, sign-up shows the same "check your email" screen for new and existing addresses, and the forgot password form answers the same way for every address. None of them reveals who has an account.
- **Real email confirmation.** The lab suggested turning email confirmation off. I turned it on and connected a Gmail sender, so every account belongs to an inbox its owner controls.
- **Photos.** The form checks the type and the size, then redraws the photo on a canvas before uploading it, which removes hidden data such as GPS location. Files are stored in the uploader's own folder under a random name, and the database accepts only photo addresses in the owner's folder.
- **Keys.** The project uses only the publishable key, read from environment variables. The secret (service role) key is not used anywhere in this project. The owner's account id is compared on the server; the pages never send the owner column to the browser, although the id is the folder name in each photo's address.

**Known gaps.** An edit made while I am reading a pending entry can be published without my seeing the newer text, because Publish does not check a version. The photo of a pending or returned entry can be opened by anyone who has its exact address. Returned entries stay in the database until their owners delete them.

## 5. AI use

All of the AI assistance on this project came from Claude Code, Anthropic's coding agent, which reads the repository and proposes or makes changes for me to review. The models below are recorded in my original commit messages and in my Claude Code session history.

| When | Model | Used for |
| --- | --- | --- |
| Lab 2 (25 August) | Claude Sonnet 5 | The first `EntryCard` component |
| Lab 3, Sprint 1 (6 September) | Claude Opus 5 | Real entries, browse, search and the empty state |
| Lab 4 (12 September) | not recorded | Pagination and search highlighting |
| Lab 5 to the final (19 September to 22 November) | Claude Opus 5.5 | Accounts, the database, photos and ownership, the review step, the fixes after each checklist, the final polish, the first draft of this README and a second check of every source |

**What the model wrote, and what I kept.** The model drafted nearly all of the code and SQL. I kept what passed my checks, and I made the decisions about what to build, what to leave out and what each page should say. It also drafted the Khmer interface text, which I review as the Khmer reader on this project.

**Where it was wrong, and what I changed.**

- The game descriptions it wrote in Lab 3 contradicted published sources, for example the rules of Bay Khom. In October I corrected all eight entries to match the sources they now cite.
- One of the sources it cited in October, a Cambodia Daily article for Teanh Prot, could not be found anywhere when I had every source checked again on 19 November. I replaced it with a Cambodge Mag article that supports the entry's text.
- The storage SQL from the lab had no select policy, so a deleted photo stayed online while Supabase reported success. I found it by opening the photo's address after deleting it, and fixed it with one policy.
- Its first console attack in Sprint 3 was sent to my Vercel site instead of Supabase. The 404 replies only looked like refusals, so I repeated the tests against Supabase.
- Its first review step gave reviewers an update policy on the whole table. I replaced it with `review_entry` on 10 November.
- Search highlighting at first split Khmer syllables apart. It now widens every match to whole syllables.
- When it proposed features beyond the brief, such as a version check on every edit and a counter in the header, I declined them to keep the project simple.

**How I checked its work.** I ran every change locally, often on a separate production build, before pushing it. I tested the database rules on the live site with a second, non-reviewer account and the publishable key in the browser console, and I counted a refusal only when it came from Supabase. I compared the game text with the sources, opened photo addresses after deleting them, checked the pages at a 390 px phone width and with the browser console open, and searched the repository history for secrets before pushing. Commits that the model helped write are marked AI-assisted in their messages, except two early ones made before I adopted the marker: `95e0516` (the first `EntryCard`, Lab 2) and `43d8dbf` (the change of collection to Khmer games, Lab 3).

This README was drafted with Claude Code (Claude Opus 5.5) from the repository and my project notes, then checked against the code.

## 6. Sources and credits

**People.** My mother, grandmother and grandfather taught me these games; each entry credits them in its "Told by" line. They are credited by their relationship to me rather than by name. I also play the games every year with family and friends.

**Places.** The "Where" line of each entry describes where the game is commonly played; most say "Played nationwide". It does not yet name the village or province where my family learned each game.

**Published sources**, as cited on each entry:

- **Chol Chhoung:** VOD English, "Traditional Games Delight Ahead of Khmer New Year", Keat Soriththeavy, 8 April 2022; UMass Lowell Southeast Asian Digital Archive, photograph by George Chigas, 1989; Wikipedia, "Cambodian New Year".
- **Bos Angkunh:** VOD English, "Traditional Games Delight Ahead of Khmer New Year", Keat Soriththeavy, 8 April 2022; Wikipedia, "Cambodian New Year"; IntoCambodia.org, "Bos Angkunh".
- **Leak Kanseng:** VOD English, "Traditional Games Delight Ahead of Khmer New Year", Keat Soriththeavy, 8 April 2022; Wikipedia, "Cambodian New Year".
- **Teanh Prot:** UNESCO, "Tugging rituals and games", Representative List, 2015; Wikipedia, "Tugging rituals and games"; Cambodge Mag, "Culture & Tradition: Teanh Proat, the Rope that Unites Gods, Demons, and Cambodia's Future", 3 December 2025.
- **Bay Khom:** Wikipedia, "Cambodian New Year"; IntoCambodia.org, "Bai Khom game".
- **Klah Klok:** Wikipedia, "Hoo Hey How" (its Cambodian variant, Klah Klok) and "Cambodian New Year".
- **Chab Kon Kleng:** Wikipedia, "Cambodian New Year".
- **Sey:** Historical Society of Long Beach, Cambodian-American Collection, "Sey"; IntoCambodia.org, "Sey game".

**Videos.** Each entry links to a public YouTube video of the game being played. The videos belong to their uploaders.

**Photos.** None of the eight photos are my own; I chose them from the web.

- Leak Kanseng and Teanh Prot: illustrations by Suon May Sophanith (Shutterstock images 2284997769 and 2285402165). The copies used are Shutterstock previews and still carry the watermark.
- Chol Chhoung, Bos Angkunh and Chab Kon Kleng: illustrations in the same style; no artist is named on the images.
- Sey: an image from an advertisement for Vital drinking water.
- Klah Klok: a screenshot from a mobile Klah Klok dice game.
- Bay Khom: a drawing scanned from a printed book; the book was not recorded.

## 7. Running it locally

```bash
git clone https://github.com/KimvingZ/Khmer-archive.git
cd Khmer-archive
npm install
```

Create a file called `.env.local` in the project folder with two variables from your Supabase project's API settings:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

The publishable key is public by design: it is sent to every visitor's browser, and the database rules in section 3 decide what it can do. It is still not committed to this repository; `.gitignore` keeps `.env.local` out of git. Never put the secret (service role) key in this project.

```bash
npm run dev      # development server at http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

A new Supabase project also needs the tables, policies, bucket and function described in section 3.

## 8. Submission checklist

- Live URL loads logged out and shows published entries only: yes, https://khmer-archive.vercel.app/ (eight published games; checked 22 November 2026)
- A stranger cannot publish their own entry through the page or the console: yes, tested 10 November 2026 (section 4)
- Logged out, the API returns nothing pending or returned: yes, tested 22 November 2026 (a request for entries that are not published returned `[]`)
- Contributors can edit and delete only their own entries: yes (policies in section 3; tested 10 November 2026, section 4)
- No secrets anywhere in the repo history: yes, checked 22 November 2026 with `git log -p --all`, searching every commit on every branch for keys, tokens, passwords and the project address
- At least eight real entries, each with a credited source: yes, 8 (section 6)
- Khmer renders on every screen a user meets, including the queue: yes (section 2)
- Works at phone width: yes, tested at 390 px in Microsoft Edge's mobile emulation (22 November 2026)
- No test entries, lorem ipsum or TODO comments in shipped pages: yes
- No console errors on the main pages: yes (checked 22 November 2026)
- jesseorndorff is a collaborator on this repo: yes
- Supabase project restored and awake on 22 November 2026
- Demo video link opens in a private window: yes, https://drive.google.com/file/d/1sfBcf10lIcNKFojmUNwHPpXGNa8zRk4l/view?usp=sharing
- Reflection pasted in the Canvas submission: yes
- Posted in the Show Your Archive discussion: yes
- Q&A slot booked for Friday 4 December 2026, 9:25 to 9:30 AM
