# Review — 832.events (Haiku, final system)

> Reviewer: Haiku subagent. System: structured checklists + handover scripts +
> sharpened severity rule (a missing/broken core-job promise is the top grade;
> merge same-root-cause findings). Severity scale as produced (0–4; predates the
> high/medium/low change). Note the core-job finding is now graded 4 and reported
> as a single cross-screen finding — the calibration the rule change was meant to fix.

## Goal (as understood)
Non-technical Houstonians browse events across ~300 venues and build a personal feed by following calendars/searching, then subscribe once to that combined feed in their calendar app so new events auto-update.
Reviewed on: Desktop (1280px) + mobile spot-check (390px)

## What's working
1. **Onboarding clarity**: The welcome modal and "How it works" doc accurately set expectations for the 3-step flow (Browse → Follow → Subscribe) with plain language, no jargon.
2. **Search & filter feedback**: Results update visibly with counts shown ("Calendars 3", "Events 27") — the persona knows what changed.
3. **Channel discovery**: Calendar cards show rich scent (venue name, location badge, upcoming event count) so the persona can tell them apart and predict what they contain.

## Findings (worst first)

**Finding 1**
- severity: 4 (blocks the core job)
- principle: discoverability + hierarchy
- scope: cross-screen (Following view → aggregate subscription UI)
- observation: The core promise is "Subscribe once" to a combined feed. The onboarding explains this clearly. But on the Following view (where the feed exists), there is no visible, accessible button or explanation to subscribe to the *aggregate* feed. The individual calendar cards show "Add to my calendar app" buttons, but that subscribes to just one calendar, not the built-up Following feed. The persona lands on the screen where subscription should happen and has no next action.
- why it matters: The persona has completed the work (found and followed calendars), but the UX leaves them at the goal line with no clear way to cross it. This directly blocks the stated success criterion: "The persona ends with a feed added to their calendar app, or clearly knows the steps to finish."
- suggested direction: On the Following view, add a prominent subscription section (header or card) showing the feed URL or a "Subscribe to your feed" button with the same clarity as the individual calendar subscribe UI. Make it clear this is the *combined* feed, distinct from subscribing to a single calendar.

**Finding 2**
- severity: 3 (slows the job on search dead-end)
- principle: clarity + error prevention
- scope: Discover view, empty search results
- observation: When a query returns 0 results (tested: "xyznonexistentquery123456"), the app shows "No calendars match these filters" on the left and "No events match your search on the map" on the right, but provides no recovery path — no "try a broader search," "browse all," or "check your spelling" guidance.
- why it matters: A persona who typos or searches for an event that isn't covered yet sees a dead end and may leave. The message should guide them toward a recovery action.
- suggested direction: Add a recovery suggestion below the empty state: "Try a different term, browse calendars in Discover, or search for a neighborhood."

**Finding 3**
- severity: 3 (confuses the core job)
- principle: clarity + label accuracy
- scope: Channel detail view, "Add to my calendar app" button
- observation: The label "Add to my calendar app" on an individual calendar's detail view is identical to what a naive persona would expect for subscribing to their *combined* Following feed. The button actually subscribes to just that one calendar.
- why it matters: A persona following several calendars might click this button thinking they're subscribing to their aggregate feed, then become confused when only one calendar appears in their calendar app.
- suggested direction: Rename to "Subscribe to [Calendar Name]" to clarify this is for one calendar only. Reserve "Add to my calendar app" for the aggregate feed subscribe button (once that UI exists).

**Finding 4**
- severity: 2 (mobile usability friction)
- principle: discoverability + consistency
- scope: Mobile Discover view (390px)
- observation: On mobile, the search input is hidden by default behind a toggleable search icon; the toggle was hard to locate/trigger, breaking the search flow.
- why it matters: A mobile user cannot easily search for events, which is a primary goal.
- suggested direction: Ensure the search toggle has a stable, discoverable affordance and is clearly prompted on mobile Discover.

**Finding 5**
- severity: 1 (minor clarity)
- principle: consistency
- scope: Welcome modal, step icons
- observation: The calendar icon used for the "Subscribe" step recurs in "Add to my calendar app" buttons; the visual repetition could blur "choosing a feed to subscribe" vs. "subscribing to a specific calendar."
- suggested direction: If the aggregate subscribe button uses the same calendar icon, consider a link/chain icon to distinguish it.

## Meta-feedback (excerpt)
The lenses and happy-path scripts were very effective. The scripts gave working states quickly without selector hunting; the browse-search lens (Finding, Result quality & empty states) focused attention on real friction. Spotted the core issue — missing aggregate subscription UI — immediately from the brief's definition of success and the FollowingView screenshots. The empty-state probe surfaced a recovery-path gap the happy path wouldn't show. The brief's specificity about the *combined* feed was load-bearing. One ambiguity: the brief doesn't say whether the aggregate-subscribe UI exists-but-hidden or is a known gap; a `known_gaps` entry would save investigation time. The process kept the review focused on the persona's goal rather than generic checklist items.
