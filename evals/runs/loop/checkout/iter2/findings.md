# Stage 2 — Findings

Source: raw.md
Brief: Northwind Checkout — persona wants to pay quickly with no surprises.

---

## Task-completion check first

**Task 1 (end-to-end order)** — completes. No headline break.
**Task 2 (cost transparency)** — completes. Full breakdown visible from step 1, consistent throughout.
**Task 3 (review and edit)** — technically completes but with significant friction: editing shipping from the review step forces full re-entry of all payment fields. This is the headline finding.

---

## Candidate findings

### F1 — Payment data wiped when editing shipping from review (HIGH)

After the persona reaches review and clicks Edit on Shipping, the app navigates back to the shipping form (pre-filled). After correcting shipping and submitting, the flow lands on the payment step with all four fields blank. `captureForm` saves to `paymentData` but the DOM inputs are never repopulated from that store when the payment panel is re-shown. The persona must re-enter the full card number, name, expiry, and CVC.

Does it affect the goal? Yes — the brief's persona has "low patience for friction" and this contradicts the UI's own promise: "Please confirm everything below. You can still go back and edit." Re-entering a 16-digit card number after a trivial address fix is a trust and effort failure.

**Grade: HIGH** — core-job promise (edit freely before committing) is broken; the workaround imposes significant effort at the worst moment.

---

### F2 — Step indicator dots not interactive (MEDIUM)

The progress indicator dots have no click handlers; clicking a completed step does nothing. Users familiar with multi-step checkout often click the step dots to navigate back. The Edit links on the review screen cover the primary use case, but navigating backward during shipping or payment requires chaining "Back" button presses (no single-click shortcut to Cart, for example).

Does it affect the goal? Partial friction — task not blocked because back buttons and review-screen Edit links exist.

**Grade: MEDIUM** — real friction, workaround available.

---

### F3 — Mobile: order summary appears above cart items (LOW)

At 390px the order summary reflows to the top of the page, above "Your cart". The persona sees the $213.25 total before seeing the items they're buying. Unconventional; not harmful given the brief's cost-transparency emphasis, but the cart heading lands below the fold.

**Grade: LOW** — does not block the task.

---

### F4 — "Estimated tax" vs "Tax" label inconsistency (LOW)

Order summary labels the tax line "Estimated tax" through steps 1–4. Confirmation recap calls it "Tax". Same value, different label — minor doubt moment about finality.

**Grade: LOW** — no meaningful impact on task completion.

---

## Dropped candidates

- No loading state on "Place order": static app, known constraint — not a finding.
- No state field: not a brief requirement, out of scope.
- Step indicator color-only: each dot also carries a number and text label, so meaning is not color-alone.

---

## Summary

| # | Title | Severity |
|---|---|---|
| F1 | Payment data wiped on edit-shipping-from-review | HIGH |
| F2 | Step indicator not interactive | MEDIUM |
| F3 | Mobile: order summary above cart items | LOW |
| F4 | "Estimated tax" vs "Tax" label inconsistency | LOW |
