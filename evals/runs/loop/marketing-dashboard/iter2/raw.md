# Raw Pass — Brightline Marketing Campaign Performance
Viewport: 1280×900 (desktop primary). Also probed 768px narrow.
Screenshots: evals/runs/looprun/marketing-dashboard/iter2/shots/

---

## 1. Task-completion walk-through

### Task 1 — Read overall performance at a glance
- Landing on `/marketing-dashboard-loop/index.html` (Last 30 days default).
- Headline renders immediately: "Over the last 30 days, you brought in **$391,000** — you're **behind target** (94% of your $414,000 goal). **Email** is your strongest channel; **Display** needs attention."
- KPI cards visible without scrolling: Revenue ($391,000), Ad spend ($105,570), New customers (4,250), Return on ad spend ($3.70). Each shows vs prior period delta and target text.
- Freshness: "Data as of Jun 22, 2026, 8:00 AM" in top-right bar.
- **PASS**: persona can state revenue ($391K), on-track status (behind, 94%), and data freshness within seconds. [01-overview.png]

### Task 2 — See which channels over- or under-perform
- Channel panel ("How each channel is doing") visible below the fold of the trend chart but on the same screen at 1280px.
- Color-coded bars: Paid Search (green), Paid Social (red), Email (green), Organic (green), Display (red).
- Each row has dollar amount and plain-text status: "Ahead of target" / "Behind target".
- Legend above panels: green = Ahead, amber = Close to target, red = Behind.
- Target marker (thin vertical tick) shows where target sits on each bar.
- **PASS**: persona can name best (Email, but by revenue Paid Search is highest) and worst (Display) channels and see status visually. Note: the headline says "Email is your strongest channel" but Email ($78,200) has lower revenue than Paid Search ($132,940). Paid Search is "strongest" by revenue, while Email has the highest performance ratio (perf: 1.21 vs Paid Search 1.12). The channel named "strongest" in the headline and the channel with the biggest bar in the chart disagree — a non-technical persona may be confused.
- **Issue**: Legend's "Close to target" (amber) state does not appear in channel bars at all in current data. All channels are binary green/red. Legend creates an expectation of three states; only two are shown. [02-channels.png, 02-legend.png]

### Task 3 — Check trend and change the date window
- Trend chart shows revenue line vs dashed daily target line with legend.
- Switching to "Last 90 days": KPI values update, headline updates, channel revenue values update, chart x-axis updates to "Mar 25 – Jun 22". Date range selector shows "Last 90 days". [03-range-90d.png, 03-trend-90d.png]
- Switching to "Last 7 days": KPI values update, headline says "just under target", chart x-axis shows "Jun 16 – Jun 22". [probe-7d.png]
- **Issue**: Trend chart subtitle always reads "Yesterday's revenue of $15,100 was above the daily target of $13,800" regardless of which date range is selected. The sentence is accurate in absolute terms (the last data point is always the same) but it doesn't contextually link to the selected window. A user switching to "Last 7 days" sees the same subtitle as "Last 90 days" — it never changes with range.
- **PASS (with issue)**: All KPIs, headline, and chart update correctly when range changes. The subtitle oddity is a minor inconsistency, not a blocker.

---

## 2. Encoding inventory

| Encoding | Color / Shape | Meaning | Learnable? |
|---|---|---|---|
| Green (#2f9e63) | KPI bar, channel bar, status text | Ahead of target / positive delta | Legend present below KPIs |
| Amber (#c98a17) | KPI bar (warn state), legend swatch | Close to target (90–99%) | In legend, not seen in channels currently |
| Red (#d24b4b) | KPI bar, channel bar, status text, delta arrow, headline "behind target" | Behind target / negative delta | Legend present; text label reinforces |
| Blue (#3b5bdb) | Brand mark, revenue line in chart | Brand / actual revenue | Chart legend labels it |
| Grey (#8a94a3) | Ad spend KPI bar, target line in chart, freshness text | Neutral / reference | Implicit; no conflicting use |
| Down arrow + red | KPI delta (Ad spend) | Spend increased (bad) | Arrow direction inverts for cost metrics |

**Color consistency**: Green/amber/red are used consistently for the same performance signal throughout. The Ad spend card deliberately uses grey (neutral) for its progress bar to avoid conflicting with the green/amber/red system — correct design decision.

**Signal beyond color**: Channel bars carry text "Ahead of target" / "Behind target". Headline also uses text "behind target". KPI progress bars use color only (no text label on the bar or card to confirm good/warn/bad). The legend covers this, but it sits between KPIs and the lower panels and applies to both areas ambiguously.

**Potential confusion**: The Ad spend delta shows "+3.4% vs prior period" in red with a down arrow. The "+" prefix and red/down signal conflict visually: a quick skim could read "up 3.4%" as positive. Text says "+3.4%" (an increase) while color/icon say bad — the reader must hold both in mind to interpret correctly.

---

## 3. Checklist — monitoring surface (per checklists.md)

### Main dashboard screen (1280×900)

**Shared spine**

- Visual hierarchy: ✓ Headline is largest text block at top; Revenue card is visually bigger (kpi-hero). Eye goes headline → KPIs → panels. [01-overview.png]
- Grouping: ✓ KPI cards grouped in a row; trend + channel in a 2-col grid below.
- Color meaning consistent: ✓ Green/amber/red used consistently for performance status throughout.
- Color + secondary signal: ✓ Channel status has text label. KPI bars have color only — secondary signal (text label on card) absent. Legend does cover it but requires user to connect legend → bar.
- Icons stable: n/a — no icons beyond brand mark. "?" tooltips present and functional.
- Feedback on action: ✓ Date range change immediately re-renders all KPIs, headline, channel values, chart.
- Error states: n/a — no user input beyond range selector; no error states observed.
- Error prevention: n/a — three fixed options in a select; no invalid input possible.
- Language: ✓ Plain language throughout. "Return on ad spend" is slightly technical but self-explanatory with context ($3.70 per $1 spent). No jargon like "CPA" or "attribution window".
- Legibility: ✓ Font sizes appropriate (11–38px hierarchy). Contrast appears adequate throughout.

**Monitoring checklist**

1. At-a-glance status: ✓ Headline + KPIs readable within seconds. [01-overview.png]
2. Primary view fits one screen: ✓ All panels above fold at 1280×900. [01-overview.png]
3. Fast encodings: ✓ Line chart for trend, horizontal bars for channel comparison.
4. Decision-critical metrics most salient: ✓ Revenue hero card largest; headline leads with key conclusion.
5. Non-data ink stripped: ✓ Gridlines subtle; no decorative elements.
6. Numbers with context: ✓ All KPIs show vs target and vs prior period. Channel bars show target marker.
7. Abnormal states findable: ✓ Red bars in channels immediately visible.
8. Alert by more than color: ✓ Channel breakdown has text. KPI bars use color only; no accompanying text on card. [01-kpis.png]
9. Drill-down: n/a — out of scope per brief.
10. Table layout: n/a.
11. Axes/units/freshness labelled: ✓ Freshness in top bar. Chart axes labelled. BUT trend subtitle doesn't update with range. [03-trend-30d.png, 03-trend-90d.png]
12. Chart type matched to question: ✓ Trend → line; channel comparison → bars.

### Narrow viewport (768px)

- ✓ KPI cards reflow to 2-column grid, readable. [probe-narrow-768.png]
- ✓ Channel panel appears below trend chart in single-column layout.
- ✓ Headline and freshness timestamp remain readable.
- ✓ Date range selector and freshness move to second row in topbar — legible.
