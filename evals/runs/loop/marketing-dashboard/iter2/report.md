## Goal (as understood)
A non-technical marketing manager needs to land on the dashboard, immediately read overall revenue vs target and data freshness, identify the best and worst-performing channels, and confirm whether the period is on track — all in plain language without analytics jargon.
Reviewed on: desktop 1280×900 (primary); also spot-checked at 768px narrow.

---

## What's working

1. **Headline does the "so what" job.** The plain-language summary at the top ("you're behind target · 94% of goal · Display needs attention") lands the essential answer before the persona reads a single number. The brief's core-job criterion is met on cold load.
2. **KPI cards give target and trend context together.** Every metric shows value, vs-prior-period delta, target, and a progress bar in one compact card. No jargon ("Return on ad spend" is explained inline as "per $1 spent").
3. **Date-range switch updates everything consistently.** Switching to 7 or 90 days re-renders the headline, all KPI values, the channel breakdown, and the trend chart x-axis correctly. No stale data.

---

## Findings (worst first)

### F1 — "Strongest channel" disagrees with the channel panel
- severity: medium
- principle: clarity / consistency
- scope: cross-screen (headline + channel breakdown)
- observation: The headline names Email as "your strongest channel." In the channel panel Paid Search ($132,940) sits first and tallest — visibly larger. Email ($78,200) is third by revenue. The code ranks "strongest" by performance ratio vs target (Email 1.21× vs Paid Search 1.12×), not by revenue, but that definition is invisible to the persona. [01-overview.png, 02-channels.png]
- why it matters: A marketer deciding where to push budget reads the headline, concludes "put more into Email," then glances at the bars and sees Paid Search dwarfing Email. The headline and chart contradict each other for any revenue-first reader. The brief's success criterion is "name the best channel"; this makes the correct answer ambiguous.
- suggested direction: Either align the definition ("Email is your most efficient channel" or "Email is beating its target by the widest margin") so the label matches what the bar chart shows, or surface both dimensions (e.g. "Paid Search brings in the most; Email is the most efficient"). One sentence; no jargon.

---

### F2 — Ad spend delta: "+" sign conflicts with red / downward arrow
- severity: medium
- principle: clarity / consistency
- scope: Ad spend KPI card
- observation: The card shows "+3.4% vs prior period" in red with a downward (▼) arrow. Spend increasing is treated as bad (correct), so the code applies "down/red," but the literal text sign "+" still says "up." A skim reader holds two contradictory signals simultaneously. [01-kpis.png]
- why it matters: The persona is non-technical and checks the dashboard in a hurry. The dashboard's whole purpose is to remove interpretation effort. A conflicting signal on a visible cost metric forces exactly the mental step the design is meant to skip; the persona may misread whether spend rose or fell.
- suggested direction: Drop the literal +/− prefix for the spend delta and reframe it in directional plain language ("Spend up 3.4%") paired with the existing color/arrow, or add a parenthetical ("(over budget pace)") so the direction and its evaluation are explicit without a sign conflict.

---

### F3 — Legend's "Close to target" state is defined but never shown
- severity: low
- principle: consistency
- scope: legend + channel breakdown
- observation: The legend defines three color bands (green / amber / red). At current data no channel falls in the 90–99% range, so amber never appears in the channel bars. Users see the legend promise three states but find only two in practice. [02-legend.png, 02-channels.png]
- why it matters: Low impact on the core job, but a careful persona who reads the legend may momentarily wonder if amber is broken or applies to something else off-screen.
- suggested direction: No urgent change. If the design is retained, the legend could appear only when relevant, or a brief tooltip on the legend explains "Close to target: within 10% of goal" so the user understands it's conditional.

---

### F4 — KPI progress bars signal status by color alone (no card-level text)
- severity: low
- principle: clarity / accessibility
- scope: KPI cards (revenue, new customers, ROAS)
- observation: The three performance KPI cards use green/amber/red progress bars but carry no text label (e.g. "On track" / "Behind") on the card face itself. The legend below covers the mapping, but it requires the user to look away and remember. The existing percentage text ("94% reached") provides enough numeric context that interpretation is rarely blocked. [01-kpis.png]
- why it matters: Marginal; numeric percentage text mitigates the gap. Worth fixing for robustness (accessibility, print, fast skim) but not an urgent task-blocker.
- suggested direction: Add a small status badge or one-word label (e.g. "Behind") below the bar, reusing the existing good/warn/bad color classes so it stays consistent with the legend and channels.
