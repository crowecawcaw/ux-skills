# Stage 1 — Raw Pass

## 1. Task Completion Check

### Task 1: Read overall performance at a glance
**SUCCESS.** On cold load (Last 30 days):
- Headline text immediately reads: "Over the last 30 days, you brought in $391,000 — you're **behind target** (94% of your $414,000 goal). **Email** is your strongest channel; **Display** needs attention."
- "behind target" is colored red (var(--bad)) in the headline. Clear, plain language.
- KPI cards: Revenue $391,000 with "Target $414,000 · 94% reached"; Ad spend $105,570 with "Budget $117,369 · 90% used"; New customers 4,250 with "Target 4,500 · 94% reached"; ROAS $3.70 with "Target $3.50 per $1 spent."
- Freshness label: "Data as of Jun 22, 2026, 8:00 AM" — top right, visible on load.
- **Success criterion met**: within seconds, persona can state revenue ($391K), on-track status (behind, 94%), and freshness (Jun 22 8 AM).

### Task 2: See which channels over/under-perform
**SUCCESS (with a discoverability note).** Channel panel "How each channel is doing":
- 5 channels with colored horizontal bars (green=ahead, red=behind) and text labels "Ahead of target" / "Behind target."
- Legend is present between KPI row and panels grid. 
- Paid Search: green, $132,940, Ahead. Paid Social: red, $101,660, Behind. Email: green, $78,200, Ahead. Organic: green, $50,830, Ahead. Display: red, $27,370, Behind.
- Persona can visually scan and immediately identify green/red without reading every number.
- **Success criterion met**: persona can name best (Paid Search / Email) and worst (Display / Paid Social) channels visually.

### Task 3: Check trend over time and change the window
**SUCCESS (with a stale subtitle quirk).** 
- Revenue over time chart shows blue line vs dashed grey target line (labeled in chart legend). Chart subtitle updates to yesterday's number.
- Switching from 30d → 90d: headline, KPIs, and chart all update. Range selector in top-right updates to "Last 90 days."
- 90d headline: "you brought in $1,102,900 — you're behind target (89% of your $1,242,000 goal)."
- The chart subtitle ("Yesterday's revenue of $15,100 was above the daily target of $13,800") stays the same across all three windows because it always shows the most recent day's number vs. the fixed DAILY_TARGET — this is technically accurate but looks frozen.
- **Success criterion met**: persona can tell trend direction and can switch windows with everything updating.

---

## 2. Encoding Inventory

### Colors
| Color | Hex/Var | Used on | Meaning |
|---|---|---|---|
| Green (#2f9e63) | --good | KPI bar fills, delta arrows, channel fills, legend swatch | "Ahead of target" / positive change |
| Amber (#c98a17) | --warn | KPI bar fills, legend swatch | "Close to target" (90–99%) |
| Red (#d24b4b) | --bad | KPI bar fills, delta arrows, channel fills, headline "behind target", legend swatch | "Behind target" / negative change / under-performing |
| Blue (#3b5bdb) | --brand | Trend line, dot, focus ring, brand mark | Actual revenue in chart |
| Grey (--ink-faint, #8a94a3) | — | Dashed target line in chart, axis labels, freshness label | Secondary/reference data |

**Consistency check**: Green/amber/red are used consistently in KPI bars, channel bars, and legend swatches — same three-tier meaning throughout. Legend labels them explicitly. The headline uses red for "behind target" and green for "on track" — same mapping.

**Issue — Ad Spend KPI bar vs. delta arrow conflict**: The Ad spend card shows a red downward-pointing delta (+6.6% is red because spending more is flagged as bad, `deltaGoodWhenUp: false`). The bar fill is GREEN (90% of budget used → ratio=0.9, status computed as `statusFor(2 - 0.9) = statusFor(1.1) = "good"`). So the arrow says "bad" (red) while the bar says "good" (green). These two encodings contradict each other on the same card. The legend ("green = Ahead of target") doesn't explain what green means for a spend bar.

**Issue — Legend scope ambiguity**: The legend sits between KPI cards and the panels below. It's introduced before the channel panel but after the KPI cards. A reader scanning top-to-bottom might apply it to the KPI cards (where it's also relevant) or only to the channels. The legend labels apply to both uses but are physically closer to the channel panel.

### Icons / Badges
| Element | Meaning |
|---|---|
| `?` circle button on each KPI card | Native tooltip on hover — shows plain-language definition of the metric. Keyboard-inaccessible via hover alone; accessible via `title` attribute. |
| ▲ (up arrow prefix on delta) | Positive change (green) or spend increase (red) |
| ▼ (down arrow prefix on delta) | Negative change |
| Vertical 2px dark bar inside channel track | Target mark — where channel's target revenue lands on the bar scale |

**Note on target mark**: The dark vertical tick in channel bars is the target marker. When the fill bar extends past it → ahead of target. When the fill ends before it → behind. This is a good visual encoding but the mark is 2px wide and low-contrast on the colored fill area — easily missed on casual scan.

---

## 3. Per-Screen Checklist

### Screen: Dashboard (single view, all panels)

**Shared Spine**

**Visual hierarchy & grouping**
- ✓ Eye lands on headline first (large, top of content area), then KPI cards, then charts. Goal-relevant hierarchy.
- ✓ Related elements grouped: KPIs in a card row; trend + channels in a two-column grid; legend between KPI area and panel area.

**Consistent meaning of color & icons**
- ✓ Green/amber/red consistent across KPI bars, channel bars, headline text.
- ✗ Ad spend card: bar fill is green, delta arrow is red — two contradictory signals on the same metric. (shot: 01-kpis.png)
- ✓ All colors also carry text labels (channel status text, legend, headline text) — not color-only.
- ✓ Icons (arrows) labeled by text suffix ("vs prior period").

**Feedback & system status**
- ✓ Date range change triggers immediate update of headline, KPIs, chart, and channels.
- ✓ `aria-live="polite"` on headline for screen readers.
- n/a — no error states reachable in this read-only dashboard.

**Error prevention & recall**
- ✓ Defaults to Last 30 days — sensible starting view.
- ✓ Context (target, prior period) shown in-card — user doesn't need to remember other numbers.

**Consistency & language**
- ✓ Plain language throughout ("Revenue", "Ad spend", "New customers", "Return on ad spend"). No jargon.
- ✓ ROAS defined via hover tooltip ("Revenue earned for every $1 spent on ads. Higher is better.")
- ✗ All three derived KPI deltas (+6.6% vs prior period for Revenue, Ad spend, New customers in 30d view) are mechanically identical because spend and conversions are modeled as fixed ratios of revenue. Non-technical persona may notice three cards showing the same percentage — feels coincidental or broken. (shots: 01-kpis.png, probe-7d-kpis.png)
- ✓ Labels consistent across range changes.

**Monitoring checklist**

1. ✓ Overall status graspable within seconds — headline + colored KPI bars. (01-overview.png)
2. ✓ Primary view fits one screen at 1280×900 without scrolling. (01-overview.png)
3. ✓ Trend chart uses line (position/length) — fast encoding. Channel breakdown uses horizontal bars — correct choice. No pie or gauge.
4. ✓ Revenue KPI is hero (larger font, blue-tinted card) — most prominent. ROAS is fourth, smallest.
5. ✓ Non-data ink is low — light gridlines, no borders on chart, minimal decoration.
6. ✓ All numbers shown with target and prior-period context.
7. ✓ Abnormal states (red channels, red headline) are visually immediate.
8. ✓ Alert meaning carried by color + text label + bar position (not color alone).
9. ✗ No drill-down path from flagged channel to action. (acceptable per brief's known_gaps — read-only scope) — n/a as per scope.
10. n/a — no table with overflow.
11. ✓ Axes labeled (y-axis dollar values, x-axis dates). Chart subtitle states yesterday's number and daily target. "Data as of" freshness label present.
12. ✓ Line chart for trend, horizontal bars for channel comparison — appropriate type.

**Additional probe observations (7d and 90d views)**:
- 7d view: headline says "just under target" (97%) — uses neutral plain language, not alarming. Correct.
- 90d view: Revenue KPI bar is red (89% of target) — correctly signals behind target for this window.
- Channel bar chart: layout, colors, and labels are identical across all three windows (channel perf ratios are hardcoded, not window-dependent). This is a known synthetic-data artifact noted in brief.
- Trend chart in 90d: more volatile line, harder to read trend direction — but this is a real UX observation; 90 spiky data points make the trend visually noisy. The dashed target line helps anchor the eye.
