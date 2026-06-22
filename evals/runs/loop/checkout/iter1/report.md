## Goal (as understood)

A shopper on a desktop laptop completes a multi-step checkout (cart → shipping → payment → review → confirmation), sees the full cost (subtotal, shipping, tax, total) from the first screen, can review and edit before placing the order, and lands on a clear confirmation with an order number.

Reviewed on: 1280 × 900 desktop (primary), 390 × 844 mobile (spot-check). Findings noted as device-specific where applicable.

---

## What's working

1. **Cost transparency holds throughout.** Subtotal, shipping ("Free"), estimated tax, and total appear in the persistent right-hand order summary from the cart screen onwards and update live when quantities change. The total on the confirmation matches what was shown at every prior step — no surprise at the end.
2. **Core flow completes without a dead end.** Cart → Shipping → Payment → Review → Confirmation succeeds cleanly. The confirmation delivers an order number, a personalised name, receipt email, full cost breakdown, and an estimated delivery date — everything the persona needs to feel confident the order is placed.
3. **Inline validation is specific and adjacent.** On blur, each field shows a plain-language message immediately below it (e.g. "Enter a 5-digit ZIP code."). Errors clear as the user corrects them. Payment data is preserved in DOM when navigating back, so users do not have to re-type after an edit round-trip.

---

## Findings (worst first)

### 1. Editing items from the review screen forces a full re-traversal of two forms

- **severity:** high
- **principle:** feedback / discoverability
- **scope:** Review step → Cart → re-entry path
- **observation:** The "Edit" button in the Items block on the Review screen routes the user back to the Cart step (`data-back="cart"`). From the cart, there is no path directly back to Review — the user must click "Continue to shipping," then "Continue to payment" (submitting that form), and only then reaches Review again. The Edit buttons for Shipping and Payment correctly return to their own steps and proceed directly to Review. The Items Edit is the only one that breaks this contract.
- **why it matters:** The brief's persona has low patience for friction and explicitly expects to "verify and correct details before committing." The label "Edit" sets the expectation of a quick, scoped change. Instead, editing the cart quantity — even by one unit — costs the persona two additional form submissions. This is the highest-friction path to an action the review screen actively invites. The mismatch between the promise ("Edit") and the cost (two form passes) is a trust break at the most sensitive moment.
- **suggested direction:** After a cart edit, return the user directly to Review rather than starting a fresh forward flow. One approach: capture a "came-from-review" flag, skip re-validating shipping/payment (already captured), and call `goTo("review")` after the cart mutation. Alternatively, label the Items "Edit" button "Edit cart" and show a "Return to review" button on the Cart step when the user arrived from review.

---

### 2. Mobile step indicator loses step labels, leaving only unlabelled numbers

- **severity:** medium
- **principle:** clarity / hierarchy
- **scope:** Step indicator, mobile (390 px)
- **observation:** At 390 px the step labels ("Cart", "Shipping", "Payment", "Review", "Done") are hidden via `display: none` in the responsive CSS. Only the numbered dots (1–5) remain. The indicator shows current step (blue dot) and completed steps (green dots) but gives no textual clue about what each step number represents.
- **why it matters:** The persona expects "familiar checkout conventions (steps, an order summary, a review screen)." On mobile, step 4 being the review step — the last chance before an irreversible action — is not readable from the indicator. The form heading carries this on each step, but the indicator adds no orientation value at all on mobile. A shopper who glances at the indicator to gauge proximity to the "Place order" moment gets no useful information.
- **suggested direction:** Keep abbreviated labels on mobile — "Cart", "Ship", "Pay", "Review", "Done" fit at 390 px with slightly smaller font or condensed spacing. Even 2–3-character abbreviations preserve orientation without requiring additional vertical space.

---

### 3. No required-field markers — fields look optional until submit

- **severity:** medium
- **principle:** error prevention / clarity
- **scope:** Shipping and Payment form steps
- **observation:** All form fields are required, but none carry a visible required indicator (asterisk, "(required)", or similar). Labels are present and persistent (not placeholder-only), which is good, but there is no up-front signal that every field must be filled.
- **why it matters:** The persona has "low patience for friction." Discovering that a skipped field blocks progress only after clicking "Continue to payment" is a surprise validation failure — the opposite of what the brief promises ("no surprises"). A shopper who skips Email (thinking it optional) hits an error on submit and may question whether other entries were lost.
- **suggested direction:** Mark all required fields with a small asterisk or "(required)" adjacent to each label, consistent with common checkout convention. Alternatively, add a single note above the form ("All fields are required") to set expectations without annotating each field individually.

---

### 4. Quantity decrement button is silently inert at minimum — no disabled feedback

- **severity:** low
- **principle:** feedback / error prevention
- **scope:** Cart step
- **observation:** The "−" button does nothing when quantity is already 1 (guarded by `if (cart[+dec].qty > 1)`). The button remains fully visible and interactive in appearance — no disabled state, no tooltip, no colour change. The brief notes item removal as a known gap, but the silent inactive button compounds it.
- **why it matters:** A shopper trying to remove an item will click "−" repeatedly, see nothing happen, and be unsure whether the click registered or whether removal is possible at all. This does not block purchase but erodes confidence in the cart step.
- **suggested direction:** Disable the "−" button visually (`disabled` attribute + reduced opacity) when quantity is 1, so the shopper immediately understands the minimum is reached. A tooltip or adjacent note ("Minimum quantity: 1") is an acceptable alternative if a disabled state conflicts with the design system.

---

### 5. Step indicator uses two accent colours with no legend

- **severity:** low
- **principle:** consistency / discoverability
- **scope:** Cross-screen — step indicator
- **observation:** Completed steps show a green dot and green underline; the current step shows blue. The distinction is logical (done vs. in-progress) but nowhere explained. The numbers and relative positions carry enough context for an experienced shopper; the dual colour is redundant but not harmful.
- **why it matters:** Low impact for this persona — the conventional left-to-right step indicator is familiar enough that coloured dots are correctly interpreted without a legend. Flagged because it does require the user to infer colour meaning rather than read it.
- **suggested direction:** No change required if the two-colour scheme is intentional. If a future iteration adds a legend, one line ("✓ Completed · ● Current") would make it explicit. This is a polish item, not a functional gap.
