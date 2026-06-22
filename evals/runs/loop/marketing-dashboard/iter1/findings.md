# Stage 2 — Findings

All three primary tasks complete successfully. No task-level blockers. Findings below are friction points that slow or mislead the persona on the core job.

---

## Finding 1 — Ad Spend card sends contradictory color signals (MEDIUM)

**Source**: raw.md § Encoding Inventory (Ad Spend bar vs. delta conflict) + Checklist item "Consistent meaning of color"

The Ad Spend KPI card simultaneously shows:
- A **red** delta arrow (▼ red "+6.6% vs prior period"), because deltaGoodWhenUp: false — spending more is flagged bad.
- A **green** progress bar, because 90% of budget used computes to status="good" via statusFor(2 - 0.9) = "good".

Same card, same moment, two opposite color signals about the same metric. The legend ("green = Ahead of target") does not resolve this — it applies to channels and KPI bars alike, but "ahead of budget" for spend has a completely different valence than "ahead of target" for revenue.

A non-technical persona scanning the cards will be confused: is ad spend performing well or badly? The text ("90% used") provides enough context for a careful reader, but the contradictory colors slow and undermine trust.

**Severity: medium** — real confusion on a key metric, but the text gives enough context that a careful reader can interpret it. It slows, doesn't block.
**Principle**: consistency
**Scope**: KPI row — Ad Spend card

---

## Finding 2 — Three KPI deltas show the exact same percentage (MEDIUM)

**Source**: raw.md § Consistency & language

On the 30-day view, Revenue, Ad spend, and New customers all display "+6.6% vs prior period". On the 7-day view all three show "+13.0% vs prior period". Spend and conversions are derived as fixed ratios of revenue, so their prior-period deltas are mathematically identical.

For the non-technical persona — whose explicit pain point is trusting that numbers tell them something real — seeing three cards with the same change percentage reads as a display bug or implausibly neat coincidence. This directly undermines the brief's "trusts the numbers" emotional success criterion.

**Severity: medium** — doesn't block any task, but directly hits the brief's trust requirement.
**Principle**: feedback / trust
**Scope**: KPI row — Revenue, Ad spend, New customers cards

---

## Finding 3 — Channel target marker is hard to read at a glance (LOW)

**Source**: raw.md § Encoding Inventory (target mark note) + shot 02-channels.png

The target marker in the channel bar chart is a 2px dark-grey vertical line. On "Ahead of target" channels (green fill), the mark sits inside the colored bar — low contrast against green. On "Behind target" channels (red fill), the mark is to the right of the fill on the grey track — more visible.

Text labels redundantly carry the same information, so task completion is not affected. The bar position encoding (fill past mark = ahead) is a good design in principle but is too subtle for a quick scan.

**Severity: low** — polish only; text labels compensate fully.
**Principle**: hierarchy / legibility
**Scope**: Channel breakdown panel

---

## Dropped candidates

- "?" tooltip not keyboard-accessible: hover-only via title attribute. Brief persona uses a desktop with mouse; metric names are plain enough without tooltip. No real impact.
- Trend subtitle identical across windows: Always shows yesterday's data point — technically correct regardless of window. Persona unlikely to notice.
- Legend position ambiguity: sits between KPI cards and panels, applies to both — accessible from both positions. No task impact.
- 90-day chart visual noise: accurate data density for the window; trend direction still readable. Not a UX defect.
