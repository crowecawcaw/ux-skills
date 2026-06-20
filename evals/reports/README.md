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
| `haiku-structured.md` | Haiku | structured checklists + handover scripts; 0–4 severity |
| `haiku-final.md` | Haiku | same + sharpened severity rule (core-job = top grade) |

The two Haiku runs are the point of the exercise: a weaker model leaning on the
guidance reaches the same headline finding as the stronger reviewers. Between the
two, only the SKILL's prioritization rule changed — and the core-job finding's
grade moved from "3 (major)" up to "4 (blocks the goal)", confirming the guidance
(not the model) drove the calibration.
