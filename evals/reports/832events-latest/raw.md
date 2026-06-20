# 832.events UX Review — Raw Pass

Reviewed on: Desktop (1280x900) and mobile (390x844) viewports
Date: 2026-06-20

---

## Stage 1.2 — Task Completion Check

### Task 1: Understand what this is and decide to use it

**Happy path states:**
- Welcome modal (01-welcome-modal.png): "Every Houston event, one place" with three value props
- How-it-works modal (01-how-it-works.png): Four usage patterns explained

**Completion assessment:** ✓ PASSES
- Within seconds, persona can articulate: site aggregates Houston events, can browse by category/neighborhood, can follow calendars, and subscribe to a feed
- Value proposition is clear and specific to the persona's pain points (event discovery without checking multiple sites)
- Next action is obvious: "Start browsing" CTA button is prominent and labeled clearly

**Promise verification:**
- Modal claims "Browse: Every Houston event from ~300 venues and organizations, in one place" — verified on 02-discover.png (calendars visible with venue counts)
- Modal claims "Follow what you like: Calendars, neighborhoods, or saved searches build a personal feed" — verified in probe-manage-sources-modal.png ("Calendars", "Location filters", "Saved searches" all present)
- Modal claims "Subscribe once: Add a single feed to Google, Apple, or Outlook — it updates itself" — verified on channel detail page (03-channel-subscribe.png) with "Add to my calendar app" button and "Subscription link" button present
- All promises are delivered where the persona needs them

---

### Task 2: Find events matching an interest

**Happy path states:**
- Discover page (02-discover.png): Calendars listed by neighborhood, tagfilters visible (Art, Beer, Books, Comedy, More)
- After filter (02-filter-beer.png): Results narrowed to Beer category, shows "Beer 4" badge
- After search (02-search-brewery.png): Results filtered to brewery keyword, shows badge "Searching: 'brewery'" with "Save" button

**Completion assessment:** ✓ PASSES
- Persona quickly lands on results matching interests (brewery = 3 calendar options found)
- Results are clearly differentiated (brewery card colors/icons distinct, event counts shown, venue names visible)
- Scanning is efficient (key info—name, event count, neighborhood—in consistent position per card)

**Promise verification:**
- Search is available and intuitive (placeholder "Search events & venues..." visible)
- Filters are predictable and jargon-free (category tags like "Beer" use common language)
- Applied filters are individually removable (Beer filter has X button on 02-filter-beer.png)
- Results show live count (Beer 4, Events 27 in 02-search-brewery.png)
- Empty state handled gracefully (probe-empty-search-results.png: "No calendars match these filters" on left, "No events match your search on the map" on right)

---

### Task 3: Subscribe so events land in my calendar (THE CORE JOB)

**Happy path states:**
- Channel detail (03-channel-subscribe.png): "Bad Astronaut Brewery" calendar opened with subscribe options
- Following feed (03-following-feed.png): Two followed calendars feeding 49 events total
- Mobile channel detail (probe-mobile-channel-detail.png): Same calendar options responsive on 390px
- You page (probe-you-page.png): Manage sources modal with add-to-calendar button, followed calendars, saved searches, location filters

**Completion assessment:** ⚠ PARTIAL — Critical gap identified

**What works:**
- Per-calendar subscribe is clear: "Add to my calendar app" button on channel detail (03-channel-subscribe.png)
- Platform handoff buttons visible: "Google" and "Copy link" options on desktop; "Subscription link" on mobile
- Following state is visible: green "✓ Following" badge appears on followed calendars

**Critical gap — The aggregate feed promise is broken:**
The brief specifies: *"The 'subscribe once' promise is about the COMBINED feed the persona builds by following calendars / neighborhoods / saved searches — one self-updating link — not subscribing to each calendar separately."*

**What we found:**
1. Per-calendar subscription works: channel detail page offers "Add to my calendar app" for individual calendars
2. Aggregate feed subscription is NOT discoverable anywhere on the Following page (03-following-feed.png)
   - The "Manage sources" button opens the "You" page, which is a settings/configuration page (probe-manage-sources-modal.png)
   - No subscribe button exists on the Following page where the persona has built their aggregate feed
   - The "You" page offers add-to-calendar preferences but NO way to subscribe to the aggregate "Following" feed

**Consequence for persona:** A non-technical user who follows 2–3 calendars to build a personalized feed has NO clear path to subscribe to that aggregate. The UI guides them to subscribe to each individual calendar separately, which defeats the core job ("subscribe once"). This is a broken core-job promise.

**Further investigation:**
- Probe of "You" page shows "Add-to-calendar button" setting (Automatic/Google Calendar/Download .ics file) — this controls the button on individual calendars, not an aggregate subscription
- No aggregate feed URL is exposed to the persona
- No recovery path visible (no help text like "Aggregate feeds coming soon" or a guidance link)

---

## Stage 1.3 — Encodings Inventory

### Colors

| Color | Meaning | Consistent? | Learnable? |
|-------|---------|-------------|-----------|
| **Blue (#0052CC or similar)** | Primary action, follow state (✓ Following button), subscription button (Add to my calendar app), category badges active | ✓ Consistent across all screens | ~ Somewhat — button colors follow web conventions but no explicit legend |
| **Green (#1DB854 or similar)** | Following/active state (✓ Following button, checkmark), successful follow action | ✓ Consistent | ~ Relies on green = positive convention |
| **Orange/Brown (various hex)** | Calendar identities / category colors (e.g., Breweries = brown #B8651B, Art = orange-red #E84C3D) | ✓ Consistent within tag categories | ✓ Visual distinctness aids scanning but no legend |
| **Red (#DC3545 or similar)** | Alert/warning (Report a problem button border), error/destructive state | Limited use observed | ~ Only one instance; not consistently applied |
| **Gray (#666 or lighter)** | Secondary text, disabled state, neutral elements | ✓ Consistent | ✓ Learnable by convention |
| **Muted brown/tan** | Empty state / secondary info backgrounds (event list rows) | ✓ Consistent | ✓ Visual hierarchy clear |

### Icons

| Icon | Meaning | Consistent? | Labeled? |
|------|---------|-------------|----------|
| **📅 Calendar** | Calendars, add-to-calendar actions, calendar subscriptions | ✓ Consistent | ✓ Always labeled ("Add to my calendar app", "Calendars", "Subscription link") |
| **❤️ Heart** | Favorites / Following (used in sidebar "Following" nav) | ✓ Consistent | ✓ Labeled in nav and buttons |
| **🔍 Search** | Search action, filter toggle | ✓ Consistent | ✓ Labeled or self-evident |
| **⚙️ Settings** (gear) | Settings ("Manage sources"), configuration | ✓ Consistent | ✓ Labeled |
| **➡️ Arrow/Chevron** | Navigation (back, next, expand) | ✓ Consistent | ✓ Directional; context clear |
| **🌍 Globe** | Website link, "Visit website" action | ✓ Consistent | ✓ Labeled |
| **✓ Checkmark** | Selected / following state | ✓ Consistent | ~ Clear in context but not explained |
| **⚠️ Warning** | "Report a problem", issues | Limited use | ✓ Labeled |
| **+** | Add, expand, follow action | ✓ Consistent | ✓ Context-dependent but learnable |

### Badges/Dots

| Encoding | Meaning | Consistent? |
|----------|---------|-------------|
| **Red dot (•)** on calendar cards | Category tag indicator (e.g., "• Beer", "• Brewery") | ✓ Consistent — shows primary tag |
| **Numbered badge** (e.g., "Beer 4") | Count of calendars in that category | ✓ Consistent |
| **Count bubble** (e.g., "0 EVENTS") | Events in filtered set | ✓ Consistent |
| **Orange/colored circles** on map | Event count by location | ✓ Learnable via context but no legend |

### Summary

**Color consistency:** Good — consistent use of blue (primary), green (active), category colors (distinct). No conflicting uses observed. **Learnable?** Partially — relies on web conventions (blue = action, green = success) without explicit legend. Non-technical persona may not immediately know calendar colors are semantic (i.e., brown ≠ random, it means this is a brewery).

**Icon consistency:** Excellent — every icon is labeled, meanings are unambiguous, directional cues are clear.

**Encoding accessibility:** Color is NOT the only signal for most meanings (icons + text always present). Exception: Calendar category colors (brown ≠ blue) are only differentiated by color on the Discover page card headers — text label is present, so passable.

**Potential issues:**
- Calendar category colors (brown for "Brewery") carry semantic meaning but aren't explicitly taught; persona must infer or learn by repetition
- No legend/key for color meanings on Discover page
- Map circles (event counts) lack a legend explaining the orange/colored bubbles

---

## Stage 1.4 — Per-Screen Checklist

### Screen: Welcome Modal (01-welcome-modal.png)

**Shared Spine:**

- **Visual hierarchy & grouping:** ✓ Eye lands on headline "Every Houston event, one place" first; three value props are grouped by icon + headline + description; "Start browsing" CTA stands out (blue, right-aligned)
- **Consistent color & icons:** ✓ Icons (calendar, heart, calendar-plus) match meanings; no color conflict
- **Feedback & system status:** ✓ Modal is clear state-change (first-run gate); X button provides clear close affordance
- **Error prevention & recall:** n/a — onboarding modal, no inputs yet
- **Consistency & language:** ✓ Language is plain ("Find what's on", "Follow what you like", "Subscribe once"); no jargon; "Subscribe once" phrasing matches brief's core promise

**Guided-flow (Onboarding):**

1. **Next-action clarity:** ✓ Clear this is intro + value prop; "Start browsing" CTA is the only next action, purpose explicit (begin exploration)
2. **Single correct next action visible:** ✓ "Start browsing" button is prominent; "How it works" link is secondary and doesn't block flow
3. **Label names outcome:** ✓ "Start browsing" names what happens next
4. **Progress feedback:** n/a — one-step modal
5. **One thing per page:** ✓ Modal covers onboarding only
6. **Every field necessary:** n/a — no inputs
7. **Input control & keyboard:** n/a — no inputs
8. **Input validation:** n/a — no inputs
9. **Progress visibility:** n/a — no multi-step flow
10. **Back & data retention:** n/a — single page
11. **Review/confirm:** n/a — no commitment yet
12. **Trust:** ✓ Explicit benefit claim ("~300 venues and organizations"); no surprise steps implied

---

### Screen: How It Works Modal (01-how-it-works.png)

**Shared Spine:**

- **Visual hierarchy & grouping:** ✓ Four usage patterns clearly separated by icon + heading + description; related elements (app name, account-free note) at top; "Subscribing in your calendar app" section clearly marks the post-handoff behavior
- **Consistent color & icons:** ✓ Icons (calendar, heart, plus, calendar) match meanings and task names
- **Feedback & system status:** ✓ Modal state is clear; X close affordance present
- **Error prevention & recall:** n/a — educational modal
- **Consistency & language:** ✓ Plain language; "Follow individual calendars", "save a search", "save a map area" are concrete nouns; "Subscribing in your calendar app" sets expectations for handoff

**Guided-flow (Educational):**

1. **Next-action clarity:** ✓ Modal teaches four paths; user can choose next (implicit: return to Discover and pick a path)
2. **Single correct next action:** ✓ Implied (close modal, go to Discover); not forced but clear
3. **Labels name outcomes:** ✓ Section headings are action-outcome pairs ("Subscribe to a topic or neighborhood", "Build a personal feed")
4. **Progress feedback:** n/a — informational
5–12. **n/a** — informational modal, not a guided flow with inputs/commitments

**Critical observation:** Modal mentions "Following feed" as output of build-personal-feed path but does NOT explain how to subscribe to that aggregate feed later. This anticipates the Task 3 gap (no aggregate subscribe discovered).

---

### Screen: Discover Page (02-discover.png, 02-filter-beer.png)

**Shared Spine:**

- **Visual hierarchy & grouping:** ✓ Headline "Discover" is prominent; category filters (All, Art, Beer, etc.) form a scannable row; neighborhood/price dropdowns form a secondary filter row; calendar cards are clear (icon + name + event count + follow button)
- **Consistent color & icons:** ✓ Category tags use distinct colors (orange Art, brown Beer, etc.); each calendar card has a colored icon matching its category
- **Feedback & system status:** ✓ Selected filter (Beer) shows as active (underlined/highlighted); "Beer 4" badge shows count; no loading state observed in happy path
- **Error prevention & recall:** ✓ Neighborhood / Price filters have sensible defaults (shown via icons); dropdowns prevent invalid state
- **Consistency & language:** ✓ Filter labels are jargon-free ("Neighborhood", "Price"); calendar names are venue names; event count labels are clear

**Browse-search (Listing & Discovery):**

1. **Search available and scoped:** ✓ Search box at top (placeholder "Search events & venues...") is visible; searches calendars by venue name/keyword
2. **Filters/facets relevant, predictable, jargon-free:** ✓ Filters are category (Music, Art, Beer, etc.), neighborhood (geographic), price. All predictable; no jargon. Facets show live counts (Beer 4)
3. **Result scent:** ✓ Each calendar card shows: icon (color-coded), name (venue), event count ("30 upcoming"), neighborhood ("Near Northside"), "+ Follow" CTA. Strong scent.
4. **Tell results apart at a glance:** ✓ Color icons + names + event counts are distinct; scanning is fast
5. **Key decision info in consistent position:** ✓ Calendar name (top), event count (middle), neighborhood (bottom) — consistent across all cards
6. **List vs grid suited to content:** ✓ Grid layout with 2–4 columns per row; cards are large enough to distinguish but dense enough to show multiple at once
7. **At-a-glance quality cues, sortable:** ✗ No sort option visible (default is by neighborhood/category). Can't sort by "most upcoming events" or "closest to me" — reduces comparison efficiency
8. **Zero-results state is recovery point:** ✓ Empty state (probe-empty-search-results.png) shows "No calendars match these filters" with filters still visible; user can remove filters and retry
9. **Result scope/progress clear:** ✓ Count shown (Calendars 0 / Events 0 badges at top right); breadcrumb-like "Searching: 'brewery'" indicator; "Save" button to save search
10. **Navigation & orientation:** ✓ Sidebar nav shows current section (Discover highlighted); can navigate to Following / You; search term shown in header

---

### Screen: Filter Active (02-filter-beer.png)

**Shared Spine:**

- **Visual hierarchy & grouping:** ✓ Applied filter "Beer" shown with X button for easy removal; results refresh dynamically; tag count updates (Beer 4)
- **Consistent color & icons:** ✓ Beer tag is orange; matches category color scheme
- **Feedback & system status:** ✓ Filter application is immediate; results update in place (no reload flash observed)
- **Error prevention & recall:** ✓ Filter row shows applied filters as chips with remove (X) buttons
- **Consistency & language:** ✓ Filter names and labels consistent with Discover page

**Browse-search (Filtering):**

1–2. **n/a** — Filter mechanics inherited from Discover
3. **Applied filters visible & individually removable:** ✓ Beer filter shown as "● Beer X" chip; X button removes it immediately
4. **Live result count:** ✓ "Calendars" badge updates ("Calendars 4" visible on filter-beer.png)

---

### Screen: Search State (02-search-brewery.png)

**Shared Spine:**

- **Visual hierarchy & grouping:** ✓ Search box contains "brewery"; search indicator "Searching: 'brewery'" with "Save" CTA; results flow below
- **Consistent color & icons:** ✓ Search indication uses consistent blue styling
- **Feedback & system status:** ✓ Live search results; count badge updates ("Calendars 3", "Events 27"); "Save" button offers to cache the search
- **Error prevention & recall:** ✓ Search term is visible and editable; "Save" offers to create a saved search for future use (convenience, not forced)
- **Consistency & language:** ✓ "Searching: 'brewery'" is plain language; "Save" button is action-oriented

**Browse-search (Search):**

1. **Search available, scoped, tolerant of typos/synonyms:** ✓ Search finds "brewery" in venue names; appears to match partial terms. Typo tolerance not directly tested but placeholder suggests broad search.
2. **Filters and search combine:** ✓ Search can be combined with category filters (e.g., "brewery" + "Beer" tag); results narrow
3. **Live result count:** ✓ "Calendars 3" + "Events 27" shown at top right
4. **Search is discoverable:** ✓ Placeholder text in search box guides users
5. **Result scent:** ✓ Brewery results show calendars matching term; each card still shows venue name, event count, location

---

### Screen: Channel Detail / Calendar Subscribe (03-channel-subscribe.png, probe-mobile-channel-detail.png)

**Shared Spine:**

- **Visual hierarchy & grouping:** ✓ Calendar name and description at top; subscription options grouped below; events list grouped at bottom
- **Consistent color & icons:** ✓ Calendar icon matches colors seen in Discover page; "Following" state is green with checkmark
- **Feedback & system status:** ✓ "Following" state is visible and clear; "✓ Following" green button shows current state
- **Error prevention & recall:** ✓ Subscribe CTA is clear and idempotent ("Add to my calendar app" button); follow/unfollow toggles safely
- **Consistency & language:** ✓ "Add to my calendar app" is action-oriented; "Copy link" and "Subscription link" are clear

**Browse-search (Detail drill-down):**

1. **Information scent from list:** ✓ Clicking calendar card navigates to full detail; no confusion
2. **Back navigation:** ✓ Back arrow (< ) at top left on both desktop and mobile
3. **Related events visible:** ✓ "30 UPCOMING EVENTS" list shown below subscribe options; events include time, location, description

**Subscribe flow (Guided sub-flow within browse-search):**

1. **Next-action clarity:** ✓ Blue "Add to my calendar app" button is primary; secondary options (Copy link, Subscription link) are visible
2. **Single correct next action visible:** ✓ Blue button stands out; secondary options don't interfere
3. **Label names outcome:** ✓ "Add to my calendar app" clearly states what happens (handoff to their calendar)
4. **Progress feedback after action:** ⚠ Not tested in script (button click would trigger handoff/download). Assumption: handoff is clear.
5. **One thing per page:** ✓ Calendar subscribe is the only action flow here; events list is reference, not a flow
6. **Every field necessary:** ✓ No input fields; pre-filled calendar choice
7. **Input control & keyboard:** n/a — no keyboard input
8. **Input validation:** n/a — no input
9. **Progress visibility:** n/a — single-step handoff
10. **Back and data retention:** ✓ Back arrow returns to Discover without losing search/filter state
11. **Review before commit:** ~ Partial — "Add to my calendar app" commits to handoff but user can see what they're subscribing to (calendar name, description, event preview)
12. **Trust at sensitive input:** ✓ Calendar description is visible; events are previewed; no surprise fields asked

**Platform-specific subscribe options (Desktop 03-channel-subscribe.png):**

- "Add to my calendar app" (blue primary button)
- "Following" (green state button)
- "Google" (platform handoff button)
- "Copy link" (manual entry into calendar app)
- "Subscription link" (ICS file URL)

**Observation:** Two paths to subscribe exist:
- Direct handoff ("Google" button → platform-specific flow)
- Link copy ("Copy link" or "Subscription link" → user manually adds to calendar)

**Platform-specific subscribe options (Mobile probe-mobile-channel-detail.png):**

- "Add to my calendar app" (blue primary)
- "Following" (green state)
- "Google" (platform handoff)
- "Copy link" (manual)
- "Subscription link" (ICS file)

All options are present on mobile; layout stacks vertically, still clear.

---

### Screen: Following Feed (03-following-feed.png)

**Shared Spine:**

- **Visual hierarchy & grouping:** ✓ "Following" headline is primary; "Manage sources" button is secondary CTA; events are grouped by day (Today, Tomorrow, Tuesday, etc.); event cards show time, title, location, source calendar
- **Consistent color & icons:** ✓ Icons consistent (calendar for "via [Calendar]" links, locations for addresses); no color conflict
- **Feedback & system status:** ✓ "Feeding this: 2 calendars, 0 places, 0 searches" summary shows current aggregation state; live event list reflects combined feeds
- **Error prevention & recall:** ✓ "Manage sources" button provides path to modify feeds
- **Consistency & language:** ✓ "Feeding this" language is consistent with onboarding modal ("Build a personal feed"); "via [Calendar]" shows source attribution

**Browse-search (Aggregated view):**

1. **Navigation clarity:** ✓ "Following" tab in sidebar shows current view is personalized feed
2. **At-a-glance comprehension:** ~ Partial — event list is clear and grouped, but no explicit subscribe CTA for the aggregate feed visible on this screen
3. **Results grouped logically:** ✓ Events grouped by date (Today, Tomorrow, etc.); scans quickly
4. **Key info in consistent position:** ✓ Event time (left), title (top), location (below), source (via link)
5. **Result comparison:** ✓ Multiple events from multiple calendars shown; can compare dates/times across sources

**Monitoring (Dashboard-like view of personalization state):**

1. **At-a-glance status:** ✓ "Feeding this: 2 calendars, 0 places, 0 searches" header gives instant overview of feed composition
2. **Primary view fits one screen:** ✓ Header and first few days of events visible without scroll (though full page scrolls for more events)
3. **Chart/encoding fast:** n/a — text summary, not a chart
4. **Hierarchy & density:** ✓ Summary is prominent (pill badges with counts); secondary info (Manage sources button) is accessible
5. **Status distinct and findable:** ✓ Feed composition (calendars/places/searches) shown in prominent badge area
6. **Drill-down to action:** ⚠ "Manage sources" button drills into the "You" page (settings), not a subscribe action
7. **Labels clear:** ✓ "Feeding this" clearly explains what these counts mean

**Critical finding:** No "Subscribe to this aggregate feed" button or link visible on the Following page. Only option to interact is "Manage sources" (settings), which does not provide a subscribe CTA for the aggregate.

---

### Screen: You / Settings Page (probe-you-page.png, probe-manage-sources-modal.png)

**Shared Spine:**

- **Visual hierarchy & grouping:** ✓ "You" headline; sections grouped (Add-to-calendar button, Calendars, Location filters, Saved searches); action buttons (Send feedback, Suggest a source, Site health) at bottom
- **Consistent color & icons:** ✓ Icons match their meanings (calendar, location pin, search magnifying glass)
- **Feedback & system status:** ✓ State is clear (0 calendars, 0 location filters, 0 saved searches on fresh "You" page; after following 1 calendar in probe, "1 calendars" shows)
- **Error prevention & recall:** ✓ Sections can be expanded/edited (Add location, Add search buttons); data persists
- **Consistency & language:** ✓ Plain language; "Add-to-calendar button" setting is jargon-free explanation of what it controls

**Monitoring (Settings/Admin view):**

1. **At-a-glance comprehension:** ✓ Each section (Add-to-calendar preference, Calendars, Location filters, Saved searches) is clearly labeled with counts (1, 0, 0)
2. **Primary view fits one screen:** ~ Partial — "You" page is long; must scroll to see all sections, but header info (Add-to-calendar choice) is above fold
3. **Status distinct:** ✓ "Add-to-calendar button" preference (Automatic/Google Calendar/Download .ics file) is three radio buttons; current choice is visually distinct (Automatic is blue/selected)
4. **Actionability:** ✓ "Manage sources" on Following page → "You" page; "Add location" and "Add search" buttons are discoverable

**Critical gap:** The "You" page is the persona's control center for managing their aggregated feed, but there is NO button to "Subscribe to my Following feed" or "Get an aggregate feed URL". The page offers:
- Add-to-calendar button preference (controls per-calendar button behavior, not aggregate)
- Calendars list (manages individual calendars)
- Location filters
- Saved searches
- Utility buttons (Send feedback, Suggest a source, Site health)

**Missing:** A primary action like "📥 Subscribe to my Following feed" or "📅 Add all these to my calendar" that provides a URL or handoff mechanism for the aggregate feed.

---

### Screen: Empty Search State (probe-empty-search-results.png)

**Shared Spine:**

- **Visual hierarchy & grouping:** ✓ Empty state message is prominent; filters remain visible for recovery (on left: "Searching" chip with X; on right: map shows "No events match")
- **Consistent color & icons:** ✓ Consistent styling
- **Error prevention & recall:** ✓ Filters still visible; user can remove "xyznonexistentquery1234567890" and retry
- **Feedback & system status:** ✓ Clear message ("No calendars match these filters")
- **Consistency & language:** ✓ Plain language; no jargon

**Browse-search (Zero-result state):**

1. **Zero-results is recovery point:** ✓ Message is helpful ("No calendars match these filters"); user can remove filters or search term
2. **Broader category, related queries:** ~ Partial — no suggestions to broaden search (e.g., "Try searching for 'events' or removing filters")
3. **Dead end risk:** ~ Low — filters are visible and removable, so not a dead end, but no positive guidance to recovery

---

## Summary of Checklist Findings

**Passes:**
- Welcome/How-It-Works modals: ✓ Clear onboarding, value props delivered
- Discover page: ✓ Effective browsing, filtering, search
- Channel detail: ✓ Clear per-calendar subscribe options
- Following feed: ✓ Clear aggregation view with event listing
- Empty state: ✓ Graceful recovery

**Fails & Gaps:**
- ✗ No sort option on Discover page (limits comparison efficiency)
- ✗ No legend for calendar category colors (brown ≠ visual; meaning is semantic)
- ✗ No aggregate feed subscribe on Following page or You page (CRITICAL: breaks core job promise)
- ✗ "You" page offers no CTA to subscribe to aggregate feed (is a settings page, not an action page)
- ~ Empty search offers no positive guidance to broaden search

