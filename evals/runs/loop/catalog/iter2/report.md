## Goal (as understood)
A bargain hunter on a desktop laptop (~1280px) uses search and faceted filters to narrow a 24-item outdoor/tech gear catalog to a comparable shortlist, then picks the best-value product by price and rating — recovering gracefully if an over-tight filter combo yields nothing.
Reviewed on: 1280×900 desktop (primary) + 390px mobile spot-check.

## What's working
1. **Task completion across all three primary tasks.** Search narrows live, chips and result count stay in sync with active filters, sort by price reorders correctly, and the no-results empty state provides actionable recovery (relax suggestion + clear all + popular search chips). Every success criterion was met.
2. **Cards support quick comparison.** Brand, title, star rating with numeric value, and price appear in a fixed position on every card; re-sorting by price or rating immediately reorders the grid, letting the bargain hunter compare across options without drilling in.
3. **No-results state is a recovery point, not a dead end.** The empty state identifies the specific filter to relax (with a predicted result count), surfaces a primary CTA to relax it, a secondary CTA to clear everything, and popular search chips as a lateral escape — matching the brief's recovery criterion.

## Findings (worst first)

---

### F1 — Mobile: no active-filter count on the Filters button
- **severity:** medium
- **principle:** feedback / discoverability
- **scope:** mobile view (390px)
- **observation:** On mobile the filter rail collapses into a bottom drawer triggered by a "≡ Filters" button. When filters are active (e.g., a category + brand checked), the button shows no badge, count, or indicator of that state. The persona returns to the product grid after applying filters and sees the result count change, but there is no persistent signal on the "Filters" button that anything is active. On desktop this is not an issue because the filter rail is always visible with checked states showing.
- **why it matters:** The bargain hunter expects to know at a glance whether any filters are on and how many — a standard pattern on Amazon-style mobile shopping UIs. Without the indicator, the persona may forget which filters are set, re-open the drawer to check, or accidentally leave filters active without realizing it. This friction is specific to mobile but directly impairs the core job of staying in control of the narrowing process.
- **suggested direction:** Add a numeric badge to the mobile Filters button (e.g., "Filters (3)") whenever any facet or search filter is active. Clear the badge when everything is reset.

---

### F2 — "Reset all" and "Clear all filters" do different things but look equivalent
- **severity:** medium
- **principle:** consistency / clarity
- **scope:** cross-screen (filter rail header + no-results empty state)
- **observation:** The filter rail header always shows a "Reset all" link-button. The no-results empty state shows a "Clear all filters" secondary button. Both look like "wipe everything" controls and share similar phrasing, but they behave differently: "Reset all" clears filters, search, AND resets sort back to Featured (app.js lines 351–359); "Clear all filters" in the empty state clears filters and search but leaves sort unchanged. The persona who has sorted by Price: low to high, hits a dead end, then clicks "Clear all filters" in the empty state will silently retain the price-sort.
- **why it matters:** The bargain hunter uses "clear everything and start over" as their mental model for both controls. Unexpected sort retention after "Clear all filters" breaks the trust the brief calls out — the persona wants to feel in control. The label difference ("Reset" vs "Clear all filters") does not communicate the behavioral difference.
- **suggested direction:** Either make both controls identical in behavior (both reset sort), or make the label explicit about scope — e.g., keep "Reset all" for the always-visible control and rename the empty-state button to "Clear filters" to signal it is scoped to filters only, not sort.

---

### F3 — "Or try a popular search" chips include the persona's current search term
- **severity:** low
- **principle:** clarity / feedback
- **scope:** no-results empty state
- **observation:** The popular search chips (backpack, tent, jacket, boots) are drawn from a static list of terms that return results in the full catalog — they are not filtered to exclude the current search query. When a user searches "jacket" and adds a Camping filter (resulting in 0 matches), the empty state suggests clicking "jacket" as an escape, even though "jacket" is already in the search box. Clicking it does work (clears filters and re-runs the same search) but the mechanism is invisible.
- **why it matters:** The bargain hunter who typed "jacket" and sees "jacket" suggested as a new idea may skip it, miss the recovery path, and abandon instead. It is low severity because the "Relax category filter" and "Clear all filters" CTAs are stronger and more prominent recovery signals.
- **suggested direction:** Filter the suggested search chips to exclude the current search query term, so the chips always offer distinct alternatives. If the filtered list is empty after exclusion, omit the "Or try a popular search" section entirely.
