## Goal (as understood)

A non-technical marketing manager needs to sit down, open one page, and within seconds know: overall revenue vs. target this period, which channel is over- or under-performing, and whether the period is on track — then move on. Success means the dashboard tells the story in plain language; the persona leaves feeling oriented, not overwhelmed.

Reviewed on: Desktop 1280×900 (primary target per brief). All findings apply at this viewport.

---

## What's working

1. **Plain-language headline does the core job.** On every load the headline summarizes revenue, target shortfall as a percentage, and names the best and worst channel — all in one sentence, with no jargon. Switching date ranges updates it correctly. The brief's persona can read overall status without touching anything else.

2. **Color + text labels together, not color alone.** Every status signal (KPI bars, channel bars, headline "behind target") is reinforced with a text label or value. The legend is visible between the KPI area and the channel panel. A colorblind user or hasty scanner who misses a color still gets the status in words.

3. **Freshness and date-range control are always visible.** "Data as of Jun 22, 2026, 8:00 AM" sits in the top-right bar alongside the range selector; both persist across all range changes. The persona can verify data age without digging.

---

## Findings (worst first)

### F1 — Ad Spend card shows contradictory color signals
- **severity**: medium
- **principle**: consistency
- **scope**: KPI row — Ad Spend card
- **observation**: The Ad Spend card simultaneously displays a red delta arrow ("+6.6% vs prior period" coded bad because spending more is unfavorable) and a green progress bar (90% of budget used, coded "good" via inverted status logic). Two colors, same card, opposite meanings. The legend ("green = Ahead of target") does not disambiguate spend-specific logic.
- **why it matters**: This persona checks the spend card specifically to know if they're burning through budget too fast or not enough. Contradictory signals on one card require the persona to stop, read the sub-labels carefully, and reason through the logic — exactly the kind of interpretation work the brief says the dashboard should spare them. It also erodes trust in the color system the rest of the dashboard relies on.
- **suggested direction**: Pick one signal role for the spend progress bar. If the bar represents budget utilization, style it differently from the revenue-performance bars (e.g., a neutral grey fill with a colored tip or a utilization label) so it's visually distinct from the "ahead/behind target" system. Alternatively, remove the color from the spend bar entirely and let only the text ("90% used") carry the message — the delta arrow already flags the directional concern.

---

### F2 — Revenue, Ad Spend, and New Customers deltas are always identical
- **severity**: medium
- **principle**: feedback / trust
- **scope**: KPI row — Revenue, Ad spend, New customers cards
- **observation**: On the 30-day view all three cards show "+6.6% vs prior period"; on the 7-day view all three show "+13.0%". This is an artifact of spend and conversions being modeled as fixed ratios of revenue (spend = revenue × 0.27; conversions = revenue ÷ 92), making their prior-period percentage changes mathematically identical to revenue's.
- **why it matters**: The brief explicitly identifies "is 4,200 orders good or bad? Hard to tell" as the persona's core pain point — they struggle to trust numbers without context. Seeing three different KPIs move by the exact same percentage on every view looks like a display bug or fabricated data. The brief's emotional success criterion is that the persona "trusts the numbers." Three identical deltas directly undermine that.
- **suggested direction**: If the underlying data model allows, introduce any independent variation between spend and conversion deltas (e.g., model spend efficiency changes separately from revenue). If the synthetic-data constraint makes this hard, at minimum suppress the redundant deltas for derived metrics or present them as ratios to revenue ("spend efficiency flat vs. prior period") so the sameness is explained rather than suspicious.

---

### F3 — Channel target marker is too thin to read at a glance
- **severity**: low
- **principle**: hierarchy / legibility
- **scope**: Channel breakdown panel
- **observation**: The target marker in each channel bar is a 2px dark-grey vertical tick. On "ahead" channels (green fill), this mark sits inside the colored bar and is nearly invisible — low contrast on green. The intended encoding (bar extends past mark = ahead; bar ends before mark = behind) is only discernible at slow inspection speed.
- **why it matters**: The persona's goal includes "tell the difference visually without reading every number." The bar position encoding should reinforce the color and text, but at 2px it adds no useful signal for a quick scan. Text labels fully compensate, so there is no task failure — this is a missed reinforcement opportunity.
- **suggested direction**: Widen the target mark to 3–4px with a white border or a small notch on the track edge, so it's legible at scan speed on both green and red fill backgrounds. A small chevron or tick above the track bar would also work.
