## Goal (as understood)

A bargain-hunter on a ~1280px laptop uses search and faceted filters to narrow 24 outdoor/tech products to a focused shortlist, compare price and rating at a glance, and recover gracefully when a filter combination returns nothing — without restarting from scratch.

Reviewed on: Desktop 1280×900 (primary); mobile 390×844 (spot-check). Mobile findings are noted as mobile-only.

---

## What's working

1. **Search + filter chip loop is accurate and fast.** Typing a partial term ("back") narrows results live, chips appear immediately reflecting what was applied, facet counts update to show only reachable intersections, and individual chip removal with × restores the prior state. The persona's trust criterion — chips and count reflect exactly what they asked for — is met.

2. **Cards support quick price/rating comparison.** Brand, title, star rating (glyph + numeric), and price occupy the same vertical slots on every card. Sorting by price reorders correctly and immediately. The persona can scan one column for price and another for stars without opening any product.

3. **No-results recovery is specific and actionable.** The empty state names the single facet to relax, quantifies what will return ("would show 4 products"), places a labeled primary button ("Relax category filter"), and offers "Clear all filters" and popular-search chips as secondary exits. The persona can escape the dead end in one tap without starting over.

---

## Findings (worst first)

### F1 — "Relevance" sort misdirects bargain-hunters to rating-desc

- **severity:** medium
- **principle:** clarity / consistency
- **scope:** results bar (sort control, default state)
- **observation:** The default sort is labeled "Relevance" but the implementation (`default: // relevance: rating desc` in app.js line 92) sorts by rating descending — the same order as the explicit "Rating: high to low" menu option. The two options are functionally identical, yet only one reveals what it does.
- **why it matters:** A bargain-hunter who lands and never changes the sort believes the system is surfacing "most relevant" (best-value or popularity-ranked) items. They are actually seeing highest-rated items — and may never try "Price: low to high" because they assume the default is already smart. The default state actively works against the persona's stated goal of finding best-value picks.
- **suggested direction:** Rename the default option to "Rating: high to low" and remove the duplicate. If a true relevance sort (by text-match quality when a query is active) is desired, implement it separately and limit it to when a query is active. On landing with no query, default to "Price: low to high" or "Featured" — a label that doesn't promise algorithmic ranking it can't deliver.

---

### F2 — Mobile filter rail blocks products with no collapse toggle

- **severity:** medium (mobile only; n/a on desktop)
- **principle:** hierarchy / navigation
- **scope:** mobile layout (390px), full page
- **observation:** The single-column breakpoint (max-width: 760px) stacks the entire filter panel — 7 category rows, 6 brand rows, price slider, 4 rating rows — above the product grid. No collapse trigger or "Filters" button is provided. On a 390px phone, the persona must scroll roughly 600px of filter controls before reaching any products.
- **why it matters:** Consumer shopping apps (the persona's reference frame — "Amazon-style") hide filters behind a modal/drawer on mobile and lead with the product grid. Burying all products below the filter rail on mobile inverts the expected experience and forces extra scroll before the persona can see what they are filtering.
- **suggested direction:** Add a "Filters" toggle button at the top of the results column on narrow viewports. Reveal the filter panel as a bottom sheet or modal on tap. The filter panel can remain sticky-open on desktop where space exists.

---

### F3 — "Clear all filters" button mislabeled in the search-only empty state

- **severity:** low
- **principle:** consistency / language
- **scope:** empty state (search query, no facets active)
- **observation:** When a search term produces zero results and no facet filters are active, the empty-state action button reads "Clear all filters." The persona has not applied any filters; only a search term is active. The button does clear the search (the JS resets `state.query` alongside `clearAllFilters()`), but its label contradicts the user's own mental model of their state.
- **why it matters:** The persona expects labels to say what will actually happen. "Clear all filters" when no filters are set causes a brief but real moment of confusion ("I didn't set filters") that slightly erodes trust in the UI's accuracy — the same trust the brief identifies as a success criterion.
- **suggested direction:** Detect the context: when only a search term is active and no facets are set, label the button "Clear search." When facets are also active, "Clear all filters" is correct. A single conditional on `state.query && !state.categories.size && !state.brands.size && state.maxPrice >= PRICE_MAX && state.minRating === 0` suffices.

---

### F4 — "Relax category filter" silently clears all checked categories at once

- **severity:** low
- **principle:** feedback / clarity
- **scope:** empty state (no-results recovery)
- **observation:** `relaxFacet('category')` calls `state.categories.clear()`, removing every checked category simultaneously. The empty-state message says "Relaxing the category filter would show N products," which reads as a single, targeted action. If the persona has checked two categories, both disappear when they click the button — wider than expected.
- **why it matters:** The mismatch between what the message implies (relax one constraint) and what the action does (clear all category constraints) is a promise made and not precisely delivered. In this dataset with 24 items and live facet counts, a double-category zero state is unlikely in practice, so the real-world impact is low.
- **suggested direction:** Either change the message to "Removing all category filters would show N products" (accurate to the actual action), or implement single-facet relaxation by identifying and removing only the most recently added or most constraining category.
