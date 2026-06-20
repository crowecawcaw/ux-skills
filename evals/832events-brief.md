# Brief — 832.events

```yaml
app:
  name: 832.events
  one_line_purpose: >
    Find Houston-area events and pipe them into your own calendar app — browse
    everything in one place, follow what you like, and subscribe once to a feed
    that updates itself.
  how_to_run: >
    See evals/832events.md. From repo root the dev server runs via
    `cd evals/832events && npm run web:dev`, serving http://localhost:5173.
    Capture screenshots with `node evals/shoot.mjs <scenario.json>` (run from
    repo root; the helper finds Playwright under evals/832events/web).

primary_device: >
  Desktop laptop at ~1280px is the primary review target (matches the persona's
  context). The subscribe handoff is platform-dependent (webcal: on Apple vs.
  Google vs. copy-link), so also spot-check mobile at 390px — and when a finding
  only applies to one platform, say so.

persona:
  goals: >
    Keep up with what's happening around Houston (live music, art, breweries,
    neighborhood happenings) without checking a dozen sites — and have those
    events show up in the calendar app they already use.
  context: >
    A Houston local, browsing casually on a laptop or phone in spare moments.
    Already lives in Google / Apple Calendar.
  expertise_level: >
    Non-technical. Comfortable with consumer apps, but does NOT know what an
    .ics feed or "calendar subscription" is in technical terms.
  pain_points: >
    Event info is scattered across venue sites, Instagram, and Eventbrite.
    Doesn't want yet another app to check; wants events to come to them.

core_job:
  when: I hear Houston has a lot going on but I keep missing things
  i_want_to: see what's on and get the stuff I care about into my own calendar
  so_i_can: actually show up to events without hunting for them
  subscribe_target: >
    The "subscribe once" promise is about the COMBINED feed the persona builds
    by following calendars / neighborhoods / saved searches — one self-updating
    link — not subscribing to each calendar separately. Judge the core job
    against that aggregate feed.
  success_functional: >
    The persona finds events/calendars matching an interest and gets a feed
    added to their calendar app (or clearly understands how to).
  success_emotional: >
    Feels this is "for them" and trustworthy, not a confusing data dump; feels
    confident the subscription will keep working without effort.

surface_type: browse-search   # with a guided sub-flow for subscribing

primary_tasks:
  - title: Understand what this is and decide to use it
    goal: From a cold landing, grasp what the site does and why it's useful.
    happy_path:
      - Land on the site (welcome / first-run state)
      - Read the value proposition
      - Decide to start browsing
    success_criterion: >
      Within a few seconds the persona can say what the site does and what they
      can do next.

  - title: Find events matching an interest
    goal: Surface events/calendars for a specific interest or neighborhood.
    happy_path:
      - From Discover, search or filter (e.g. "brewery", a tag, a neighborhood)
      - Scan results (calendar cards, events list, map)
      - Open something to see its upcoming events
    success_criterion: >
      The persona quickly lands on a set of events/calendars they care about and
      can tell them apart.

  - title: Subscribe so events land in my calendar (the core job)
    goal: Get a chosen calendar/feed into the persona's own calendar app.
    happy_path:
      - Pick a calendar or build a feed (follow calendars / a saved search)
      - Find the subscribe / add-to-calendar action
      - Understand what to do to complete it in Google / Apple / Outlook
    success_criterion: >
      The persona ends with a feed added to their calendar app, or clearly knows
      the steps to finish — without needing to understand .ics jargon.

scope:
  in:
    - The web SPA (Discover, Following, You, search, filters, map, subscribe)
    - Our own instructions for completing the handoff in a calendar app
  out:
    - Data quality / coverage of individual events (a backend concern)
    - The .ics file format internals; the calendar app's own UI after handoff

known_gaps:   # so the reviewer doesn't re-report known issues as discoveries
  - (none recorded yet — add anything intentionally unbuilt or in-flight here)

constraints:
  - Static site; data comes from generated feeds (some calendars may be sparse)
  - Works on desktop and mobile
```
