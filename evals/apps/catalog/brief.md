# Brief — GearFinder (catalog)

```yaml
app:
  name: GearFinder
  one_line_purpose: >
    Browse an outdoor & tech gear catalog and narrow many products down to the
    right one with search and faceted filters — compare options at a glance and
    recover gracefully when a filter combo returns nothing.
  how_to_run: >
    Self-contained static app (vanilla HTML/CSS/JS, no build). A shared static
    server serves evals/apps on :4010. Open
    http://localhost:4010/catalog/index.html. Capture screenshots with
    `node evals/shoot.mjs evals/apps/catalog/scenarios/<f>.json /tmp/out`
    (run from repo root).

primary_device: >
  Desktop laptop at ~1280px is the primary review target — a two-column layout
  with a filter rail and a product grid. The layout collapses to a single column
  under ~760px, so spot-check mobile at 390px if a finding seems width-specific.

persona:
  goals: >
    A bargain hunter who wants to find gear matching an interest, weigh price
    against rating across several options, and land on the best-value pick.
  context: >
    Browsing on a laptop with time to compare. Cares about price and ratings;
    willing to use filters to cut a long list down.
  expertise_level: >
    Comfortable with consumer shopping sites (Amazon-style faceted search). Not
    technical; expects filters, chips, sort, and clear result counts to behave
    the way they do elsewhere.
  pain_points: >
    Hates scrolling through irrelevant results, and hates hitting a dead end
    where an over-tight filter combo returns nothing with no way out.

core_job:
  when: I have an interest in mind but the catalog is large
  i_want_to: search and filter down to a comparable shortlist
  so_i_can: pick the best-value product with confidence
  success_functional: >
    The persona finds products matching an interest, compares them on price and
    rating, and — if a filter combo returns nothing — recovers without starting
    over.
  success_emotional: >
    Feels in control of the narrowing process and never stuck; trusts the result
    count and chips to reflect exactly what they asked for.

surface_type: browse-search

primary_tasks:
  - title: Find products matching an interest
    goal: Surface products for a specific interest using search and filters.
    happy_path:
      - Land on the catalog (all products shown, sorted by relevance)
      - Type a search term (e.g. "backpack") — results narrow live
      - Apply a category and/or brand filter; watch the result count and chips
    happy_path_script: evals/apps/catalog/scenarios/01-search-filter.json
    success_criterion: >
      Within a few interactions the persona has a focused result set whose chips
      and count clearly reflect the applied search + filters.

  - title: Compare options at a glance
    goal: Weigh several products on price and rating, then re-sort.
    happy_path:
      - From a filtered set, scan cards (image, title, price, rating in fixed spots)
      - Change the sort control (e.g. Price: low to high)
      - Confirm the order changed and cards remain easy to compare
    happy_path_script: evals/apps/catalog/scenarios/02-compare.json
    success_criterion: >
      The persona can compare products on price and rating at a glance and re-sort
      to surface the best-value option.

  - title: Recover from a no-results state
    goal: Hit an over-narrow filter combo and recover via the no-results UI.
    happy_path:
      - Apply filters that together return zero products
      - See the helpful no-results state (what's wrong + how to fix)
      - Relax a filter (or clear all / pick a suggested search) to get results back
    happy_path_script: evals/apps/catalog/scenarios/03-no-results.json
    success_criterion: >
      The persona understands why nothing matched and recovers to a non-empty
      result set without abandoning the task.

scope:
  in:
    - The static catalog page (search, category/brand/price/rating facets, chips,
      sort, product grid, no-results recovery)
  out:
    - Product detail pages, cart/checkout, accounts (not built)
    - Data quality / coverage of the inline catalog (a fixed ~24-item dataset)

known_gaps:
  - (none recorded yet — this is the clean baseline)

constraints:
  - Fully static, vanilla JS, no network or build; dataset is inlined in app.js
  - All state (search, filters, sort) is in-memory only; a reload resets it
  - Works at desktop (~1280px) and collapses to one column on narrow viewports
```
