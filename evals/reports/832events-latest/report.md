# Review — 832.events (Haiku, formal staged process)

> Most recent run. Reviewer: Haiku subagent. Process: three-stage
> (`raw.md` → findings → report) with task-completion-first ordering and the
> mandated encoding inventory. This is the report it returned; the Stage 1
> evidence is in `raw.md` beside this file. Severity: high / medium / low.

## Goal (as understood)
A Houston local wants to keep up with events without checking multiple sites, and have those events land in their own calendar app (Google/Apple/Outlook).
Reviewed on: Desktop (1280×900) and mobile (390×844).

**Core finding:** the app excels at **discovery and per-calendar subscription** but **fails to deliver the core job: subscribing to an aggregate feed.** The persona is taught to build a personal feed (by following calendars), can see it work (Following page), but has no clear path to subscribe to it in their calendar app. The missing "Add all to my calendar" action on the Following page is the headline.

## What's working
1. **Clear onboarding** — welcome and how-it-works modals are concrete, jargon-free, and match the persona's needs.
2. **Fast discovery** — filtering, search, and distinct calendar colors make results scannable.
3. **Per-calendar subscribe** — every calendar detail page has a clear "Add to my calendar app" button with platform handoff (Google, Copy link, Subscription link); works on mobile.
4. **Responsive mobile** — 390px preserves all features; CTAs remain tappable.
5. **Consistent iconography** — every icon is labeled; no orphaned icons.
6. **Aggregation visibility** — the Following page shows feed composition ("Feeding this: 2 calendars") and combined events.

## Findings (worst first)

### 1. Missing aggregate-feed subscribe — breaks the core job
- severity: high
- principle: discoverability / promise delivery
- scope: cross-screen (Following page + You page)
- observation: The app promises "Subscribe once: add a single feed… it updates itself." After following 2+ calendars there is **no button to subscribe to the combined feed** — the Following page offers only "Manage sources", the You page only source management. The persona must subscribe to each calendar individually (defeating "subscribe once") or give up.
- why it matters: Non-technical personas who follow the onboarding will expect an "Add all to my calendar" button on the Following page mirroring the per-calendar one. Without it the core job is unachievable via the UI — a broken promise, not polish.
- suggested direction: Add a prominent "Subscribe to my feed" / "Add all to my calendar" action on the Following page with copy-link + Google handoff, and a one-line explanation that it combines all followed calendars into one auto-updating feed.

### 2. Aggregate feed URL not exposed
- severity: high
- principle: clarity / self-service
- scope: You page
- observation: The aggregate feed effectively exists (Following combines events) but its URL is shown nowhere, and no help explains what a feed URL is or how to use it.
- why it matters: The brief states the persona doesn't know what ".ics" means; with no exposed URL and no guidance they have no path to "clearly know the steps to finish."
- suggested direction: Add a "Your Following feed" section on the You page exposing the URL with a copy button and per-app (Google/Apple/Outlook) paste guidance.

### 3. No sort on Discover
- severity: medium
- principle: efficiency
- scope: Discover page
- observation: Results are grouped by neighborhood with no sort; a "brewery" search can't be ordered by most upcoming or nearest.
- suggested direction: Add a sort control (most upcoming events / closest / alphabetical).

### 4. Calendar category colors lack a legend
- severity: medium
- principle: learnability
- scope: Discover page
- observation: Avatar/dot colors carry semantic meaning (per primary category) but are never explained, and uncategorized tags fall back to hashed hues; first-time users may read them as decorative.
- suggested direction: Add a color legend (help icon on Discover, or pre-teach in how-it-works).

### 5. No guided recovery for empty search
- severity: medium
- principle: feedback / guidance
- scope: empty search state
- observation: The empty state says "No calendars match these filters" without suggesting how to recover.
- suggested direction: Add recovery guidance — remove a filter, adjust the search, or browse a popular category.

### 6. Map clusters lack a legend
- severity: low
- principle: clarity
- scope: map
- observation: Map circles lack a legend for color/size meaning. Low impact — the list is the primary interface.
- suggested direction: Add a hover tooltip explaining the cluster numbers.
