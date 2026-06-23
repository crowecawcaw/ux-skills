# Ground Truth — marketing-dashboard DETECTION eval

Scoring key for the five defective variants of the Brightline Marketing
"Campaign Performance" dashboard. The reviewer drives each variant via its own
`scenarios/*.json` (which point at `/marketing-dashboard-defects/vN/index.html`)
and reviews against the **clean** app's `brief.md`. This file lives outside any
app dir and MUST NOT be visible to the reviewer.

Base (clean) app: `evals/apps/marketing-dashboard/`
Variants: `evals/apps/marketing-dashboard-defects/v1..v5/`

Severity guide: **high** = clearly breaks comprehension or misleads a decision;
**medium** = degrades trust/clarity but recoverable; **low** = polish / minor
legibility.

15 seeded defects total (v1: 3, v2: 3, v3: 3, v4: 3, v5: 3).

---

## v1 — hierarchy inversion, missing freshness, no context

Surfaces on: **01-overview** (KPI row + top bar). Also visible 02/03.

| id | location / element | what's wrong | principle | severity |
|----|--------------------|--------------|-----------|----------|
| v1-d1 | KPI row, first/hero card | **Ad spend** is promoted to the large hero slot (first, biggest type, highlighted card); **Revenue** — the key decision metric — is demoted to a small normal card. A cost/vanity metric is the most prominent thing on the dashboard. | hierarchy | high |
| v1-d2 | Top bar, right side | The **"Data as of …" freshness timestamp is gone** entirely. On a monitoring dashboard implying live data the persona can't tell if numbers are current. | freshness | high |
| v1-d3 | Revenue KPI card | Revenue card shows **only the bare dollar figure** — its vs-prior-period delta, target, "% reached" and progress bar were removed. No context to judge if the number is good. | context | medium |

## v2 — color encoding broken, alert not salient, truncated labels

Surfaces on: **02-channels** (channel panel + the missing legend). Also 01/03.

| id | location / element | what's wrong | principle | severity |
|----|--------------------|--------------|-----------|----------|
| v2-d1 | Channel breakdown bars + removed legend | **Color carries no meaning.** All channel bars render the same brand blue regardless of status, AND the color legend ("Ahead / Close / Behind target") was deleted. Status survives only as a small text label. Fails in grayscale; nothing visually separates a behind-target channel from a healthy one. | color-meaning | high |
| v2-d2 | Channel status text ("Behind target") | The status text for every state uses the **same muted grey ink** — a behind-target channel is not visually distinct (no red, no emphasis) from one that's ahead. Alert state has no salience. | alert-salience | medium |
| v2-d3 | Channel name column | Name column narrowed to 64px with ellipsis, so labels like "Paid Search" / "Paid Social" **truncate** ("Paid Se…") and become ambiguous. | legibility | low |

## v3 — chart-type misuse, truncated axis, illegible axis labels

Surfaces on: **03-range** (trend chart) and **02-channels** (donut). Also 01.

| id | location / element | what's wrong | principle | severity |
|----|--------------------|--------------|-----------|----------|
| v3-d1 | "How each channel is doing" panel | The channel comparison is rendered as a **donut/pie of revenue share**. Part-to-whole angle/area encoding makes channel-to-channel comparison hard and **drops the vs-target comparison and target markers** entirely — the panel's core job (who's over/under target) is gone. | chart-fit | high |
| v3-d2 | "Revenue over time" trend chart, y-axis | **Truncated y-axis**: the y-axis starts at ~96% of the lowest day instead of $0, so modest day-to-day revenue movement is exaggerated into a dramatic swing. Misleads the on-track read. | chart-fit / misleading-axis | high |
| v3-d3 | Trend chart axis labels | Axis labels shrunk to 8px in a near-white grey (#c4ccd6) — y-axis dollar values and dates are **hard to read**. | legibility | low |

## v4 — inconsistent units, overlapping labels

Surfaces on: **01-overview** (KPI units) and **03-range** (overlapping x-axis). 

| id | location / element | what's wrong | principle | severity |
|----|--------------------|--------------|-----------|----------|
| v4-d1 | KPI cards, Revenue vs Ad spend values | **Inconsistent money units side by side**: Revenue hero shows abbreviated "$412K" while Ad spend shows full "$111,321". Same kind of figure, two scales — forces mental conversion and invites misreading. | consistency / context | medium |
| v4-d2 | Trend chart x-axis | A date label is drawn at **every data point**, so on 30-/90-day ranges the x-axis dates **overlap into an illegible smear**. | legibility | high |
| v4-d3 | Return-on-ad-spend KPI card | The value renders as "3.7x" while its target reads "Target $3.50 per $1 spent" — the **metric and its target use different units/formats**, making the comparison misleading. | consistency / context | medium |

## v5 — same color two meanings, no vs-target context

Surfaces on: **03-range** (trend line vs target) and **02-channels** (statuses), **01-overview** (KPIs).

| id | location / element | what's wrong | principle | severity |
|----|--------------------|--------------|-----------|----------|
| v5-d1 | Trend chart: actual line vs target line | The **daily-target line is now the same solid brand blue as the actual-revenue line** (and no longer dashed), so the two series are **indistinguishable** — you can't tell actual from target. The legend still claims they differ. | color-meaning | high |
| v5-d2 | All KPI cards | The **target / "% reached" context and the progress bar were removed** from every KPI — cards show only a bare figure + prior-period delta, with no way to judge against target. | context | high |
| v5-d3 | Channel status colors | **"Close to target" reuses the same red** (text and bar) as "Behind target" — one color now means two different statuses, collapsing the three-state scheme and falsely flagging a near-target channel as behind. | color-meaning | medium |

---

### Severity tally
- high: v1-d1, v1-d2, v2-d1, v3-d1, v3-d2, v4-d2, v5-d1, v5-d2  (8)
- medium: v1-d3, v2-d2, v4-d1, v4-d3, v5-d3  (5)
- low: v2-d3, v3-d3  (2)

### Notes for the grader
- Every variant keeps the rest of the app good — defects are isolated.
- v1/v4/v5 surface best on the **01-overview** scenario; v2 on **02-channels**;
  v3 on **03-range** (axis) + **02-channels** (donut); v4-d2 and v5-d1 on **03-range**.
- A defect counts as detected if the reviewer names the element and the problem
  (the exact principle label need not match).
