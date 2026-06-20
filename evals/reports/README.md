# Review reports (disposable)

Scratch output from review runs, committed so the generated feedback is
inspectable. **Safe to delete** — nothing depends on these:

```sh
git rm -r evals/reports && git commit -m "drop review reports"
```

Each file is a reviewer agent's verbatim output against `evals/832events-brief.md`
using `skills/ux-review/`. Reports predate the severity-scale change (high/medium/
low); the ones here still use the older 0–4 scale they were produced with.

| File | Model | System version |
|---|---|---|
| `832events-latest/` | Haiku | **current** — formal staged process (`raw.md` + `report.md`), task-completion-first, high/medium/low |
| `haiku-final.md` | Haiku | earlier — structured checklists, 0–4 severity |
| `haiku-structured.md` | Haiku | earlier — structured checklists, 0–4 severity (pre severity-rule sharpening) |

`832events-latest/raw.md` is the genuine Stage 1 artifact the reviewer wrote to
disk (task-completion check → encoding inventory → per-screen checklist);
`report.md` is the final deliverable it returned.

The two Haiku runs are the point of the exercise: a weaker model leaning on the
guidance reaches the same headline finding as the stronger reviewers. Between the
two, only the SKILL's prioritization rule changed — and the core-job finding's
grade moved from "3 (major)" up to "4 (blocks the goal)", confirming the guidance
(not the model) drove the calibration.
