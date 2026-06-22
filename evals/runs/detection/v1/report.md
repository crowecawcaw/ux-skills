# UX Review Report — Brightline Marketing Campaign Performance (Defects v1)

## Goal (as understood)
A non-technical marketing manager can land on the dashboard and, within seconds, read overall revenue vs target, name the best and worst channel, and tell whether the period is on track — all from plain-language labels and a visible data-freshness timestamp.

Reviewed on: Desktop 1280×900 (primary device per brief). All findings are desktop-scoped unless noted.

---

## What's working

1. **Headline summary delivers the "so what" immediately.** The plain-language sentence at the top names revenue, on-track status, strongest channel, and weakest channel without jargon — the persona gets the story without digging.
2. **Channel panel is scannable.** Color-coded bars with inline status labels ("Ahead of target" / "Behind target") let the persona identify the weakest channel (Display) at a glance, with a text fallback independent of color.
3. **Date-range control updates consistently.** Switching from 30 days to 90 days refreshes the headline figure, KPI cards, and trend chart in a single operation — no stale numbers.

---

## Findings (worst first)

### 1. Revenue KPI card shows no target, no delta, and no progress bar
- **severity:** high
- **principle:** feedback / hierarchy
- **scope:** KPI row — Revenue card (cross-range: all three date windows)
- **observation:** The Revenue card displays only the raw number (`$391,000`). Every other KPI card shows a vs-prior-period delta, a target line, and a progress bar. The Revenue card DOM (`#kpi-revenue`) has no `kpi-context` or `kpi-bar` elements; `renderKpi` passes delta/target/ratio but they have nowhere to render. (See `01-kpis.png`, `probe-7d-kpis-full.png`.)
- **why it matters:** Revenue vs target is the single question the brief centers on. Stripping the context from the most important card forces the persona to read the headline sentence for interpretation — exactly the extra step the dashboard is meant to eliminate. The card row exists to provide at-a-glance target and delta for every metric simultaneously.
- **suggested direction:** Restore the `kpi-context` and `kpi-bar` sub-elements to `#kpi-revenue` in `index.html`. The `renderKpi` call in `app.js` (lines 271–276) already passes all required values.

---

### 2. Data-freshness timestamp absent on all views
- **severity:** high
- **principle:** feedback / system status
- **scope:** Cross-screen (topbar — all date ranges)
- **observation:** `renderFreshness()` looks for `document.getElementById("freshness")` (app.js line 256), but no element with that id exists in `index.html`. The function silently returns. The `.freshness` CSS class is defined but never applied. No timestamp appears on any range. (See `probe-30d-header.png`, `probe-7d-header.png`.)
- **why it matters:** The brief's functional success criterion explicitly requires "a visible data-freshness timestamp." The persona checks in a hurry and needs to know whether numbers are from this morning or three days ago before acting. Its absence removes the trust signal the brief names in the emotional success goal.
- **suggested direction:** Add `<span id="freshness" class="freshness"></span>` to the topbar in `index.html` (after `#range-select`). No JS change needed — `renderFreshness()` is already implemented and will populate it on load.

---

### 3. Ad spend delta arrow contradicts the displayed sign
- **severity:** medium
- **principle:** consistency / clarity
- **scope:** KPI row — Ad spend card (cross-range)
- **observation:** When ad spend rises, the delta reads "+6.6% vs prior period" with a ▼ down-arrow in red. The arrow direction (▼ = down) is the opposite of the numeric sign (+ = up). The code uses `deltaGoodWhenUp: false` to flag rising spend as bad, but expresses that judgment via the directional arrow rather than a separate sentiment signal. (See `01-kpis.png`.)
- **why it matters:** The brief's persona is non-technical and checks in a hurry. An arrow that says "down" next to "+6.6%" requires the user to reconcile two signals — exactly the interpretation burden the dashboard is meant to remove. They may misread whether spend actually went up or down.
- **suggested direction:** Separate direction from sentiment: keep the arrow pointing in the direction the number moved (▲ for +6.6%), and add a warning badge or color to signal "this is bad." Or change the label copy ("Over budget" vs "Under budget") so the judgment is in words, not arrow direction.

---

### 4. "Close to target" legend entry describes a state that never appears
- **severity:** low
- **principle:** consistency / clarity
- **scope:** Legend + channel breakdown panel
- **observation:** The legend shows three swatches: Ahead (green), Close (amber), Behind (red). No channel has a performance index between 0.9 and 1.0 (`statusFor` threshold), so amber never appears in the channel bars on any date range. (See `02-legend.png`, `02-channels.png`.)
- **why it matters:** A legend entry for a non-occurring state is minor but adds a doubt for a persona interpreting a new UI — they may wonder whether they've missed something or misread the chart. Not blocking.
- **suggested direction:** Either adjust the dataset so at least one channel occupies the "close" band, or suppress the amber swatch from the legend when no channel currently occupies it.
