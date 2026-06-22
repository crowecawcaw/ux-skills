# UX Review — GearFinder (catalog)

## Goal (as understood)
A bargain-hunting shopper searches and faceted-filters a ~24-item gear catalog down to a
comparable shortlist, weighs price against rating, and recovers gracefully when an
over-tight filter combo returns nothing — feeling in control and trusting that the result
count and chips reflect exactly what they asked for.
Reviewed on: desktop laptop ~1280px (primary); mobile spot-checked at 390px. The one
medium finding is mobile-specific.

## What's working
1. All three primary tasks complete. Live search is substring-tolerant and multi-token;
   facets (category/brand/price/rating) show live result counts and render every applied
   filter as an individually removable chip — count, chips, and facet counts all update
   together, so the persona's "trust the count/chips" goal holds on desktop.
2. Cards support at-a-glance comparison: brand, title, star rating + numeric value, price,
   and category sit in fixed positions, and sort (price asc/desc, rating) reorders cleanly
   so the best-value pick surfaces in one scan.
3. The no-results state is a genuine recovery point, not a dead end: it explains the cause,
   names the single best facet to relax along with the exact count that would return
   ("Relaxing the category filter would show 4 products"), and offers relax / clear-all /
   popular-search options that all work.

## Findings (worst first)

### 1. Mobile: the filter rail pushes results and feedback below the fold
- severity: medium (medium on mobile <=760px; n/a on the primary desktop view)
- principle: feedback / hierarchy
- scope: cross-screen (any state on narrow viewports)
- observation: At <=760px the layout collapses to one column and the entire filter panel
  (~10 controls across category, brand, price, rating) stacks ABOVE the results bar, chips,
  and grid. On landing the user must scroll past the whole panel before seeing a single
  product; after tapping a filter, the updated result count, chips, and grid are off-screen,
  so there is no feedback at the point of interaction (p1-mobile-landing, p1-mobile-filtered).
- why it matters: This persona explicitly hates scrolling and needs to trust that the count
  and chips reflect their action. On a phone they get neither — a filter tap appears to do
  nothing until they scroll down to find the result, which undercuts the "in control"
  emotional goal. The task still completes, and desktop is the named primary device, so it
  is friction rather than a block.
- suggested direction: On narrow viewports, surface the result count + active chips near the
  top (above or pinned over the filters), and/or collapse the filter rail into a toggle/drawer
  so the grid is reachable without scrolling past every facet. Scrolling to the grid (or a
  brief count flash) after a filter change would also restore feedback at the point of action.

### 2. "Relevance" sort label doesn't match its behavior
- severity: low
- principle: consistency / clarity
- scope: results bar (sort control)
- observation: The default and first sort option is "Relevance", but with no search query it
  simply orders by rating descending — there is no relevance signal driving it
  (p3-all-relevance vs p3-all-price-asc).
- why it matters: The ordering is sensible as a default, so nothing breaks; but a shopper who
  reads "Relevance" on a no-query landing may expect curated relevance rather than
  highest-rated-first. Minor expectation mismatch only.
- suggested direction: Either rename the default to what it does (e.g. "Featured" or "Top
  rated") on the no-query view, or keep "Relevance" but let an active search actually weight
  ordering by match quality.

### 3. Empty-state heading says "filters" even for a search-only zero result
- severity: low
- principle: consistency / language
- scope: no-results state
- observation: When only a search term is active (no facets), the empty state still reads
  "No products match your filters"; the body copy is correctly tailored to the search
  ("We couldn't find anything for 'kayak'...") (p2-search-zero).
- why it matters: The accurate body copy carries comprehension, so recovery is unaffected;
  the heading is just slightly off when no filters are applied.
- suggested direction: Vary the heading by cause — e.g. "No products match 'kayak'" for a
  search-only zero state vs "...match your filters" when facets are active.

### 4. Same chip styling for active-filter chips and suggested-search chips
- severity: low
- principle: consistency
- scope: cross-screen (results chips vs empty-state suggestions)
- observation: The light-blue pill used for removable active-filter chips is also used for
  the "Or try a popular search" suggestion chips, which instead launch a new search
  (03-no-results, p2-search-zero).
- why it matters: The two are disambiguated by the × on filter chips and by the section
  label, so confusion is unlikely; it is a minor visual-vocabulary overlap.
- suggested direction: Give suggested-search chips a distinct affordance (e.g. a search/arrow
  glyph or outline style) so "remove a filter" and "run this search" read as different
  actions at a glance.
