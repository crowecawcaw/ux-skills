# Stage 1 — Raw Pass

## App: GearFinder (catalog-loop)
## Viewport: 1280×900 (desktop primary); 390×844 (mobile spot-check)
## Screenshots: evals/runs/looprun/catalog/iter1/shots/

---

## Part A — Task Completion (goal-review)

### Task 1: Find products matching an interest
**Success criterion:** Within a few interactions the persona has a focused result set whose chips and count clearly reflect the applied search + filters.

Walk-through: Landed on catalog → 24 products shown (01-landing.png). Typed "back" into search → live-filtered to 3 results, "Search: 'back'" chip appeared, result count updated to "3 products" (01-search-back.png). Clicked "Backpacks" category → filtered to 2 results, "Backpacks" chip added alongside search chip, result count updated to "2 products" (01-filtered.png).

**Result: PASS.** The persona can reach a focused, chip-reflected result set in 2–3 interactions. Chips and count accurately mirror what's applied.

Probed: Removing the Backpacks chip via × returned to 3 results. Removing the search chip via × returned to all 24. Both chip-remove flows work correctly. Facet counts in the sidebar updated live to reflect only intersecting items, showing 0 for categories with no matches under "back" query.

### Task 2: Compare options at a glance
**Success criterion:** The persona can compare products on price and rating at a glance and re-sort to surface the best-value option.

Walk-through: Filtered to Footwear (3 products, 02-footwear.png). Scanned cards: each shows brand (small caps, muted), title, star rating + numeric, price in bold, and a category badge. Price and rating occupy the same vertical slots across all three cards. Changed sort to "Price: low to high" → cards reordered to $56 → $119 → $175 correctly (02-sorted-price-asc.png).

**Result: PASS with a notable labeling issue.** Comparison works mechanically. However: "Relevance" (the default sort) is implemented as rating-desc (confirmed in app.js line 92: `default: // relevance: rating desc`). This duplicates the explicit "Rating: high to low" option. A bargain-hunter who stays on "Relevance" thinking it's a smart/popularity rank is actually just seeing rating-desc — which diverges from their price-centric goal. They may never discover that "Price: low to high" is the more useful default for their task.

### Task 3: Recover from a no-results state
**Success criterion:** The persona understands why nothing matched and recovers to a non-empty result set without abandoning the task.

Walk-through: Applied Footwear + WoolWorks (WoolWorks makes no Footwear → 0 results, 03-no-results.png). Empty state showed: heading "No products match your filters", body "Your current filters are too narrow. Relaxing the category filter would show 4 products." Two action buttons: "Relax category filter" (primary/blue) and "Clear all filters". Also "Or try a popular search:" with chips: backpack, tent, jacket, boots. Clicked "Relax category filter" → cleared Footwear, kept WoolWorks, showed 4 WoolWorks products (03-recovered.png). Chips updated to show only "WoolWorks" chip.

**Result: PASS.** Recovery is specific and immediate. Relax button is labeled with the specific facet (not generic "Relax filters"), and quantifies what relaxing will yield ("4 products"). Popular searches are available as a secondary exit.

One issue: The "Relax category filter" button maps to `relaxFacet('category')` which does `state.categories.clear()`. If the user had two categories checked simultaneously, this would silently clear BOTH, not just the most constraining one. In this dataset this edge case is unlikely (counts guide users to avoid double-category zero states), but the behavior is undiscoverable.

### Probe: Empty-search (text-match zero results)
Applied search "xyzzy123" with no facets. Empty state shows "We couldn't find anything for 'xyzzy123'. Try a different search term." Only "Clear all filters" button present (no Relax since no facets active, correctly hidden). Popular search chips shown.

**Issue: Button mislabeled.** With only a search active and no facet filters, the button says "Clear all filters" but the user hasn't applied any filters. The label should say "Clear search" in this context. The button does work (it also clears the search term via `clearAllFilters()` + `state.query = ''`), but the label is contextually wrong and could confuse a persona who knows they haven't applied any filters.

---

## Part B — Encoding Inventory

| Encoding | Meaning | Consistent? | Learnable? |
|---|---|---|---|
| Blue (#1f6feb) | Interactive/active: checkbox accent, slider thumb, chips, primary button, search focus ring, "Reset all" link | Yes | Yes — conventional |
| Orange/amber (#f0a020) | Star ratings only | Yes | Yes — universal star convention |
| Gray badge (#f0f3f6, small pill) | Category tag on card bottom-right | Yes | Yes — context makes it clear |
| Blue chip (#eaf2ff bg, #1f4f9b ink) | Active filter in chip bar | Yes | Yes — conventional chip pattern |
| Blue outline chip (suggest-chip) | Suggested search in empty state | Yes | Yes |
| Muted gray (#5a6b7b) | Secondary text: brand names, counts, sort label | Yes | Yes |

No inconsistent encodings found. Blue is used exclusively for interactive/active contexts (no decorative use). Orange exclusively for ratings. No color carries meaning only (icons + text reinforce).

---

## Part C — Checklist (browse-search surface)

### Landing screen (01-landing.png)

**Shared spine:**
- ✓ Visual hierarchy: Eye lands on search bar (header, centered, pill shape) then grid of products. Filter rail is subordinate and to the left.
- ✓ Related elements grouped: Filter rail as a card panel, product cards distinct. Facet sections separated by dividers.
- ✓ Color consistent: Blue for active/interactive only.
- ✓ Color not sole carrier: Checkboxes checked state uses fill + checkmark glyph; rating uses stars + numeric.
- ✓ Feedback on action: Results and counts update live within ~200ms of interaction.
- ✓ Error prevention: Facet counts show 0 for options that would conflict with current search/filters, preventing dead-end clicks.
- ✓ Consistency: "Reset all" uses same link-style as secondary controls elsewhere.
- ✓ Language: "24 products", "Search products, brands…", "Sort by" — plain consumer language.
- ✓ Legibility: 15px base, sufficient contrast on ink (#1c2733) on white, muted gray (#5a6b7b) used only for secondary info.

**Browse-search checklist:**
1. ✓ Search available, scoped, tolerant: Pill search in sticky header, token-matching (partial terms work: "back" matches "Backpack").
2. ✓ Filters relevant, prioritized, live count, removable chips: Category + Brand (checkbox), Max Price (slider), Min Rating (radio). Counts live. Chips with × for each.
3. ✓ Result scent: Each card shows image, brand, title, stars + numeric rating, price, category badge.
4. ✓ Tell apart at a glance: Product images are distinctive; titles are unique.
5. ✓ Key info in consistent position: brand (top of body), title, rating row, price+badge (bottom of card) — same across all cards.
6. ✓ Grid/image suited to content: Image grid is standard for gear browsing; appropriate for visual discovery.
7. ✓ Quality cues + sort: Stars + numeric on every card. Sort has 4 options. ISSUE: "Relevance" default is rating-desc (see task 2 note).
8. ✓ Zero-results state: (covered in task 3)
9. ✓ Result scope/count: "24 products" shown prominently above chips.
10. ✓ Orientation: Single page, logo links home, no deep hierarchy.

### Search/filter active state (01-search-back.png, 01-filtered.png)

- ✓ Active chip mirrors exactly what was applied (Search: "back" + Backpacks)
- ✓ Result count updates immediately
- ✓ Facet counts update to reflect intersection (0 for irrelevant categories, keeps relevant ones with counts)
- ✓ Removing chip via × immediately restores prior state
- ✗ Sort label "Relevance" when search is active implies text-rank ordering, but code sorts by rating-desc. (medium issue — creates a false expectation that the system is ranking by query match quality)

### No-results state (03-no-results.png)

- ✓ Heading is clear: "No products match your filters"
- ✓ Body is specific to the actual problem: names the facet to relax and the count that would return
- ✓ Primary action is specific: "Relax category filter" (not generic "Fix it")
- ✓ Secondary actions: "Clear all filters" + popular searches
- ✓ Chips still visible at top showing what's applied — persona can see why they're in this state
- ✗ "Relax category filter" clears ALL active categories at once (not just most-constraining one) — undiscoverable edge case

### Empty-search state (probe-empty-search.png)

- ✗ "Clear all filters" button mislabeled when no facet filters are active — should read "Clear search" in this context
- ✓ Body text is specific to search ("We couldn't find anything for 'xyzzy123'")
- ✓ Popular searches provided as exit path

### Mobile layout (probe-mobile-landing.png, probe-mobile-search.png)

- ✗ Filters expand inline above product grid on single-column collapse — full filter rail visible before any products. Persona must scroll past the entire filter panel to reach products.
- ✓ Layout does collapse correctly (no horizontal overflow observed)
- ✓ Search field visible at top, functional
- n/a Chips visible (mobile probe didn't apply filters)
