# Review — 832.events (Haiku, structured system)

> Reviewer: Haiku subagent. System: structured per-surface checklists + happy-path
> handover scripts. Severity scale as produced (0–4; predates high/medium/low).

## Goal (as understood)
A Houston local needs to find events matching their interests and get them into their calendar app without checking multiple websites. Success is finding relevant events quickly and confidently subscribing to a self-updating feed.
Reviewed on: Desktop laptop 1280x900 (primary device); mobile 390x844 (subscribe handoff flows). Findings note device scope where relevant.

## What's working

1. **Clear value proposition entry.** The welcome modal clearly states the three-step promise (Browse → Follow → Subscribe once), establishing that the app aggregates events and feeds them into existing calendar apps, which directly addresses the persona's pain point of scattered event sources.

2. **Fast discovery and scannability.** The Discover view presents calendar cards with event previews, tags, and counts at a glance; the category filter chips and Calendars/Events toggle let users narrow focus quickly. Calendar cards show location tags and upcoming event previews in a consistent visual pattern.

3. **Seamless follow-to-feed workflow.** Following calendars in Discover immediately populates the "Following" tab with a unified event feed, and the "Feeding this" summary shows what's been added (calendars, saved searches, location filters), making the aggregation transparent without jargon.

## Findings (worst first)

### 1. Subscribe pathway is unclear for the core job
**Severity:** 3 (major — blocks clear completion of the core job)
**Principle:** clarity, discoverability, guidance
**Scope:** cross-screen (Following feed, calendar detail page, You tab)
**Observation:** On the Following tab, the persona sees their aggregated feed (30 events) but the "Subscribe once" promise from the welcome modal has no obvious next step. The Following view shows "Feeding this: 2 calendars, 0 places, 0 searches" but no visible button to subscribe the *combined* feed. The only visible affordance is "Manage sources" (a settings button), which doesn't directly answer "how do I get this into my calendar app?" On an individual calendar detail (e.g., Bad Astronaut Brewery), there is an "Add to my calendar app" button at the top, which opens a platform-specific handoff (webcal: on macOS, or Copy link for manual subscription). But that subscribes *one* calendar, not the combined Following feed. The "Subscription link" button copies an ICS URL to paste into a calendar app, but relies on the persona understanding that action without guidance.
**Why it matters:** The brief's core job is subscribing to the *aggregate* feed ("Subscribe once" to a combined, self-updating link). The UI makes it easy to follow individual calendars but doesn't visibly explain how to export or subscribe to the complete Following feed. A non-technical persona will complete the "Follow" step but then pause at "now what?" because there's no call-to-action or instruction for the final step.
**Suggested direction:** Add a persistent, prominent "Subscribe to my feed" or "Get subscription link" action in the Following tab header (beside or replacing "Manage sources"), with a short explanation and a platform-specific CTA (Open in Google/Apple, or Copy subscription link), plus a one-line note on what subscription means.

### 2. Subscribe options on mobile are inaccessible due to hidden search box
**Severity:** 3 (major on mobile)
**Principle:** consistency, feedback, discoverability
**Scope:** mobile 390px viewport (calendar detail, any view with search)
**Observation:** On mobile, navigating to a calendar detail keeps the search box from the prior Discover view on-screen, taking viewport space; the action buttons are narrowly spaced and "Subscription link" truncates to "link". Returning to Discover, the search field is hidden behind a search icon, so the persona must click a toggle before typing.
**Why it matters:** The brief specifies mobile as a use case (persona browses in spare moments). On mobile, the search-box toggling adds a step and the narrow viewport makes buttons hard to tap; the truncated label loses clarity.
**Suggested direction:** Keep the mobile search toggle clearly visible; on detail pages don't let the search box block the subscribe buttons; expand or icon-label the truncated actions.

### 3. Empty/zero-result state offers no recovery path for search
**Severity:** 2 (moderate)
**Principle:** error prevention, information scent, guidance
**Scope:** Discover view (search results)
**Observation:** Searching "xyznonexistentterm123" shows "No calendars match these filters" and "No events match your search on the map", with a "Save" button but no suggestions — no "Did you mean?", no "broaden search", no "Browse all", no reset.
**Why it matters:** If the persona's interest doesn't match existing calendar names/tags, they hit a dead end with no way to recover.
**Suggested direction:** Add a recovery section: related categories, "Browse all calendars", typo "Did you mean?", or popular alternatives.

### 4. "Add to my calendar app" behavior is platform-dependent and not transparent
**Severity:** 2 (moderate)
**Principle:** feedback, consistency, transparency
**Scope:** Calendar detail page
**Observation:** The big blue "Add to my calendar app" button links to webcal: (macOS) or defaults per a hidden "You" tab setting (Automatic / Google / Download .ics). The outcome depends on a preference the persona can't see at click time; on some platforms a click does nothing visible.
**Why it matters:** A click that silently depends on an invisible setting undermines trust for a non-technical persona.
**Suggested direction:** Make the label dynamic ("Add to Google Calendar" / "Download to Calendar"), or show a brief modal explaining what will happen; surface the setting earlier.

### 5. Following feed subscription is multi-step with no inline guidance
**Severity:** 2 (moderate)
**Principle:** guidance, next-action clarity, error prevention
**Scope:** Following tab
**Observation:** To subscribe to the Following feed the persona must go to Following, then guess (Manage sources? You tab?) — there is no visible "Subscribe to my feed" action on the tab itself. The How-It-Works modal mentions the Following feed is subscribable, but no CTA does it.
**Why it matters:** This is the core job; the UI provides no clear, prominent action to accomplish it on the relevant screen.
**Suggested direction:** A sticky/persistent "Subscribe to this feed" action on the Following tab with a one-line explanation and platform options.

### 6. "Subscription link" copy action lacks next-step feedback
**Severity:** 1 (minor)
**Principle:** feedback, guidance, transparency
**Scope:** Calendar detail page
**Observation:** Clicking "Subscription link" copies a URL and flashes "Subscription link copied ✓", but the external next step (paste into Google/Apple/Outlook) is unexplained.
**Why it matters:** A non-technical persona doesn't know what to do with a copied "subscription link".
**Suggested direction:** After copying, show concise per-app paste instructions or link to a help page.

### 7. Visual hierarchy on category filter chips could be clearer
**Severity:** 1 (minor)
**Principle:** hierarchy, visual consistency
**Scope:** Discover view (filter chips)
**Observation:** Active vs. inactive chip state isn't strongly distinguished at a glance.
**Suggested direction:** Stronger active-state styling (darker fill, bold, or check icon) / higher contrast.

### 8. "Calendars" vs. "Events" toggle lacks context
**Severity:** 1 (minor)
**Principle:** clarity, hierarchy
**Scope:** Discover view toggle
**Observation:** The toggle works but doesn't explain the difference between the two views.
**Suggested direction:** Add a brief tooltip or clearer label ("View: Calendars / Events").

**Summary:** Strong fundamentals (clear onboarding, scannable discovery, transparent feed-building). The main friction is the unclear path from "Following" to "Subscribe once to a feed" — the core job is present in the UI but not discoverable or guided. Secondary issues: mobile usability, empty-state recovery, platform-dependent button behavior.

## Meta-feedback (excerpt)
The browse-search lens (Finding, Scanning & information scent, Result quality & empty states, Navigation & orientation) led directly to specific findings; the guided-flow spine highlighted the Following subscribe gap. Avoided cosmetic items because the lenses pushed "does this affect the persona's goal?". Happy-path scripts reached the right states efficiently; probing beyond surfaced the mobile search-toggle friction and the empty-state gap. The brief's core-job framing (aggregate feed, not individual calendars) was load-bearing for finding 1.
