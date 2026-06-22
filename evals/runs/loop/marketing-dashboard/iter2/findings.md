# Findings — Brightline Marketing Campaign Performance
Source: raw.md (iter2)

---

## F1 — "Strongest channel" label names the wrong channel (medium)

The headline says "Email is your strongest channel" but Email ($78,200) is third by revenue behind Paid Search ($132,940) and Paid Social ($101,660). The code ranks "strongest" by performance ratio vs target, not by revenue. A non-technical marketer reading "strongest channel" will assume highest-revenue, then look at the channel bars and see Paid Search at the top — a direct contradiction. The headline makes a claim the channel panel immediately refutes to any revenue-first reader.

- severity: medium
- principle: clarity / consistency
- scope: cross-screen (headline + channel panel)
- impact: persona forms a wrong mental model of which channel deserves budget; undermines trust in the summary.

---

## F2 — Ad spend delta sign contradicts its color/arrow (medium)

The Ad spend card shows "+3.4% vs prior period" in red with a downward arrow. The code inverts arrow direction for cost metrics (deltaGoodWhenUp: false), so a spend increase renders as "down" (bad) in red. The literal "+3.4%" means spend went up, but red + downward arrow means bad — two simultaneous signals that conflict. A non-technical persona skimming the card must consciously reconcile them; the dashboard is designed to eliminate that mental step.

- severity: medium
- principle: clarity / consistency
- scope: Ad spend KPI card
- impact: persona may misread spend direction, dismissing a real budget concern or worrying unnecessarily.

---

## F3 — Legend "Close to target" state never appears in channel bars (low)

The legend defines three states (green/amber/red) but the channel panel currently shows only green and red. The amber "Close to target" swatch exists in the legend but users never see it applied. A user who reads the legend carefully and then scans the channels expecting three categories finds only two, weakening the legend as a reference.

- severity: low
- principle: consistency / feedback
- scope: legend + channel breakdown
- impact: minor confusion / eroded trust, no task block.

---

## F4 — KPI progress bars signal status via color alone, no card-level text (low)

The KPI cards use green/amber/red progress bars with no text label on the card confirming the status. The legend below covers color meanings but requires the user to have read it and connected it back. The percentage text already present ("94% reached") provides enough numeric context that this rarely blocks interpretation.

- severity: low
- principle: clarity / accessibility
- scope: KPI cards
- impact: minimal; numeric context text mitigates; a robustness gap rather than a real block.

---

## NOT a finding: Trend subtitle static across date ranges

The trend subtitle always says "Yesterday's revenue of $15,100 was above the daily target of $13,800." This is factually correct regardless of range (same last data point), so it does not mislead. Missed opportunity for responsiveness, but no wrong reading results.
