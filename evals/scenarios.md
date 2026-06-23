# Eval scenarios

Synthetic apps for exercising the UX review. Each is a self-contained static web
app (no build, no network) under `evals/apps/<id>/`, served by one shared static
server:

```sh
python3 -m http.server 4010 -d evals/apps   # apps at http://localhost:4010/<id>/
```

Every app ships a `brief.md` (see `evals/apps/catalog/brief.md` for the shape, and
`DESIGN.md` for the field-by-field contract) and happy-path `scenarios/*.json` for
the screenshot helper. Surface types span the three review lenses plus surfaces
deliberately outside them.

> Defects used for the detection eval are **not** documented here — they're kept
> as separate ground truth so this file can describe the scenarios neutrally.

| # | id | surface type | persona / goal | stresses |
|---|---|---|---|---|
| 1 | `account-wizard` | guided-flow | cautious first-timer opening an account | trust at sensitive input, progress, review-before-commit |
| 2 | `checkout` | guided-flow | shopper completing a cart | cost transparency, form effort, inline validation |
| 3 | `booking` | guided-flow | busy person grabbing an appointment slot | availability legibility, confirmation feedback |
| 4 | `catalog` | browse-search | bargain hunter narrowing options | filter UI, information scent, comparison, no-results recovery |
| 5 | `docs-search` | browse-search | frustrated user self-serving an answer | search tolerance, result scent, orientation |
| 6 | `incident-dashboard` | monitoring | on-call SRE deciding whether to act | at-a-glance status, alert salience, color-not-alone, drill-down |
| 7 | `marketing-dashboard` | monitoring | non-technical marketer reading results | information hierarchy, chart-type fit, context vs target, freshness |
| 8 | `data-table` | data table / admin | ops analyst managing records | find/compare/act, frozen headers, status encoding |
| 9 | `settings-console` | config | returning user changing a setting | consistency, label jargon, destructive-action prevention |
| 10 | `chat-assistant` | chat (outside the three lenses) | newcomer to a conversational app | streaming feedback, first-run capability discovery, empty/error states |

## Implemented so far

- **`marketing-dashboard`** (#7) — clean baseline + 5 defective variants for the
  detection eval.
- **`checkout`** (#2) — clean baseline.
- **`catalog`** (#4) — clean baseline.

The rest are documented here as the backlog. See `evals/README.md` for how to run
a review against any of these apps.
