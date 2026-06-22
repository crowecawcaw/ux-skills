# Brief — Marketing Dashboard

```yaml
app:
  id: marketing-dashboard
  name: Brightline Marketing — Campaign Performance
  one_line_purpose: >
    A single at-a-glance dashboard where a marketer can read campaign results,
    see which channels are over- or under-performing, and tell whether they're
    on track against target — without any analytics jargon.
  how_to_run: >
    Self-contained static app (index.html + style.css + app.js, vanilla, no
    build, no network). Served by the shared static server at
    http://localhost:4010/marketing-dashboard/index.html. Capture screenshots
    with `node evals/shoot.mjs evals/apps/marketing-dashboard/scenarios/<f>.json
    /tmp/out` from the repo root.

primary_device: >
  Desktop laptop at ~1280px is the primary review target (matches a marketer
  checking results at their desk). Layout reflows to a single column on narrow
  screens, but mobile is not the focus.

persona:
  goals: >
    Quickly understand how campaigns are performing this period, spot what's
    working and what isn't, and decide where to push budget — then get back to
    running campaigns.
  context: >
    A non-technical marketing manager at a mid-size DTC brand. Checks the
    dashboard a few times a week, usually in a hurry, on a laptop.
  expertise_level: >
    Non-technical. Comfortable with consumer/marketing tools but does NOT think
    in analytics jargon — terms like "attribution window", "CPA", or "blended
    ROAS" without explanation would lose them. Wants plain language.
  pain_points: >
    Most dashboards are a wall of numbers with no context — is 4,200 orders good
    or bad? Hard to tell at a glance whether they're on track or which channel to
    fix. Wants the "so what", not raw metrics.

core_job:
  when: I sit down to check how our campaigns are doing this month
  i_want_to: see overall performance, what's over/under-performing, and whether we're on target
  so_i_can: decide what's working and where to move budget — fast and confidently
  success_functional: >
    Within seconds the persona can state overall revenue vs target, name the
    best and worst channel, and say whether the period is on track — all from
    plain-language labels and clear visual cues, with a visible data-freshness
    timestamp.
  success_emotional: >
    Feels oriented and in control, not overwhelmed — the dashboard tells them
    the story ("you're on track, fix Display") rather than making them do the
    interpretation. Trusts the numbers because they see how fresh they are.

surface_type: monitoring

primary_tasks:
  - title: Read overall performance at a glance
    goal: From a cold load, grasp how campaigns are doing this period vs target.
    happy_path:
      - Land on the dashboard (default Last 30 days)
      - Read the plain-language headline summary
      - Scan the KPI cards (revenue, spend, new customers, return on ad spend),
        each shown with its target and change vs the prior period
      - Note the "data as of" freshness label
    happy_path_script: evals/apps/marketing-dashboard/scenarios/01-overview.json
    success_criterion: >
      Within a few seconds the persona can say overall revenue, whether it's on
      track vs target, and how fresh the data is.

  - title: See which channels over- or under-perform
    goal: Identify the strongest and weakest channels and read each vs target.
    happy_path:
      - Look at the "How each channel is doing" breakdown
      - Use the legend to read the color meaning (ahead / close / behind target)
      - Identify the best and worst channel and their status
    happy_path_script: evals/apps/marketing-dashboard/scenarios/02-channels.json
    success_criterion: >
      The persona can name which channels are ahead of and behind target and
      tell the difference visually without reading every number.

  - title: Check whether we're on track over time and change the window
    goal: Read the revenue trend vs the daily target and switch the date range.
    happy_path:
      - Read the revenue-over-time line chart against the dashed target line
      - Change the date range control (e.g. to Last 90 days)
      - Confirm the KPIs, headline, and chart update consistently
    happy_path_script: evals/apps/marketing-dashboard/scenarios/03-range.json
    success_criterion: >
      The persona can tell whether revenue is trending above or below target and
      successfully view a different time window with everything updating.

scope:
  in:
    - The single dashboard view (KPI cards, headline, trend chart, channel
      breakdown, date-range control, freshness label, legend)
    - Plain-language labels and target/prior-period context for every metric
  out:
    - Drill-down into individual campaigns, ads, or audiences
    - Editing budgets or launching campaigns (read-only monitoring surface)
    - Data accuracy / the upstream pipeline (a backend concern)

known_gaps:
  - Dataset is inlined and synthetic; the date-range control summarizes the same
    underlying series rather than fetching new data.
  - No per-channel drill-down or export — this is a top-level monitoring view.

constraints:
  - Static single page; vanilla HTML/CSS/JS, no build step, no external CDNs,
    no network requests.
  - Charts are hand-rolled inline SVG / CSS (no charting library).
  - Primary review target is desktop ~1280px; reflows to one column when narrow.
```
