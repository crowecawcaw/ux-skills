# Raw pass — GearFinder (catalog-loop) iter1

Reviewed at 1280x900 desktop (primary); mobile spot-check at 390px.
Screenshots in ./shots.

## Step 2 — Task completion (headline judgment)

### Task 1 — Find products matching an interest — PASS
- Landing shows all 24 products (01-landing). Live search: typing "back" narrows to 3
  (substring tolerant; matched "Backpacking Tent" too) (01-search-back). Applying
  Backpacks category narrows to 2; chips "Search: back" + "Backpacks" both shown and
  individually removable; count + facet counts update live (01-filtered).
- success_criterion MET: focused result set; chips + count reflect search+filters.

### Task 2 — Compare options at a glance — PASS
- Footwear filter -> 3 cards with brand/title/stars+rating/price/category in fixed
  positions (02-footwear). Sort "Price: low to high" reorders $56/$119/$175 correctly
  (02-sorted-price-asc). Cards stay aligned, easy column scan.
- success_criterion MET.

### Task 3 — Recover from a no-results state — PASS
- Footwear + WoolWorks = 0 products (03-no-results). Empty state explains cause
  ("filters too narrow"), names the best facet to relax WITH the count it would yield
  ("Relaxing the category filter would show 4 products"), offers "Relax category filter",
  "Clear all filters", and 4 popular-search chips. Relax button recovers to 4 products
  (03-recovered). Search-only zero state ("kayak") gives tailored copy + suggestions, no
  bogus relax button (p2-search-zero). Price=$0 zero state also recovers (p5-price-zero).
- success_criterion MET.

ALL THREE PRIMARY TASKS REACH THEIR SUCCESS CRITERIA. No headline break.

## Step 3 — Encoding inventory (app-level)

Colors:
- Brand blue (#1f6feb): interactive accent — links ("Reset all"), checkbox/radio accent,
  primary buttons, focus ring, search focus, chip text/bg. Consistent = interactive. ✓
- Star gold (#f0a020): rating stars only (cards + rating facet). Consistent. ✓
- Chip light-blue (#eaf2ff / #1f4f9b): active-filter chips AND suggested-search chips.
  Same visual = two different functions (one removes a filter, one launches a search).
  Mild overload but disambiguated by an × on filter chips. Low.
- Card image background colors: per-product decorative (from product.color), NO semantic
  meaning — purely to differentiate placeholder tiles. Not misleading (clearly imagery). n/a
- Category pill (#f0f3f6 grey on card): non-interactive category label. Consistent. ✓
Icons:
- ⌕ search, × clear/remove, 🔍 empty-state art, ★/☆ rating, brand ▣ mark, product emoji
  glyphs (decorative). Stable meanings. ✓
No legend needed; encodings are conventional and learnable.

## Step 4 — Checklist

### Shared spine (all screens)
- Hierarchy: eye lands on grid/cards; result count + sort top-right; filters left rail.
  Goal info (price/rating) prominent on cards. ✓
- Grouping: filters in bordered panel, facets separated by rules, cards in grid. ✓
- Color one meaning: ✓ except chip-style reuse (filter chip vs suggest chip) — low.
- Color carried by text/shape: rating has numeric value beside stars; chips have ×;
  active facet = checkbox state not color alone. ✓
- Feedback after action: count, chips, facet counts, grid all update live on every
  filter/search/sort change. ✓ (desktop). ✗ on mobile — see below.
- Error message on zero results: plain-language, attached in main area, recovery path. ✓
- Error prevention: sane defaults (Any price/Any rating/Relevance); reset/clear available;
  no destructive irreversible actions. ✓
- Consistency/language: labels plain ("Up to $X", "4+ stars", "Sort by"); no jargon. ✓
- Legibility: adequate size/contrast. ✓

### browse-search lens
1. Search available, scoped to title/brand/category, tolerant (case-insensitive, partial
   substring, multi-token AND). ✓ No synonym/typo correction (kayak -> nothing) but copy
   handles it. ✓ (acceptable for fixed 24-item set)
2. Facets relevant (category/brand/price/rating), jargon-free, live counts, applied filters
   shown as removable chips with live count. ✓ Strong.
3. Scent: brand + descriptive title + category pill give clear scent. ✓
4. Tell apart at a glance: yes — title/price/rating differ per card. ✓
5. Key info consistent position: brand/title/stars/price/category fixed per card. ✓
6. Grid + image suits comparison. ✓
7. At-a-glance cues (price, rating, stars) without drill-down; sortable by price/rating;
   default = "Relevance". ✗ "Relevance" actually sorts rating-desc (sortList default), with
   no relevance signal — label overpromises but harmless on a no-query landing. Low.
8. Zero-results is a recovery point (relax suggestion w/ count, clear-all, popular searches).
   ✓ Strong. Minor: heading always "No products match your filters" even when only a search
   term (no facets) is active — wording mismatch. Low.
9. Result scope: total count + noun shown; no pagination (24 fits). ✓
10. Orientation: single page; chips + facet state always show "where you are"; reset/clear
    to broaden. ✓ No breadcrumb needed (flat catalog).

### Mobile (390px) spot-check — p1-mobile-landing, p1-mobile-filtered
- Layout collapses to one column: the ENTIRE filter rail (category+brand+price+rating, ~10
  controls) renders ABOVE the results bar, chips, and grid. ✗
  - Landing: user scrolls past the whole filter panel before seeing any product.
  - After tapping a filter, the updated count/chips/grid are below the long rail and OFF
    screen — no visible feedback at the point of interaction; user must scroll down to
    confirm anything changed. This contradicts the persona's "hates scrolling" and the
    "trusts the count/chips" emotional goal on a phone.
- Desktop is the brief's primary device; this is width-specific (<=760px).
