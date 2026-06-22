# Stage 1 — Raw Pass

App: Northwind Checkout (checkout-loop)
Viewport: 1280×900 (primary) + 390×844 (mobile spot-check)
Screenshots: evals/runs/looprun/checkout/iter2/shots/

---

## Part 1 — Task completion (goal review)

### Task 1: Place an order end to end
**Result: COMPLETES** (shots: 01-cart → 07-confirmation)

- Cart step shows 3 items with quantity controls and a "Continue to shipping" CTA. ✓
- Shipping step renders, form validates, "Continue to payment" advances. ✓
- Payment step renders, form validates, "Review order" advances. ✓
- Review step shows items, shipping address, masked card (last 4 digits). "Place order" button prominent. ✓
- Confirmation shows "Order placed", order number NW-XXXXXX, email receipt notice, full cost breakdown, estimated delivery date. ✓

**Success criterion met**: Persona reaches confirmation with order number, no dead ends.

---

### Task 2: See the full cost before committing
**Result: COMPLETES** (shots: cost-summary-cart, cost-summary-after-qty, cost-summary-shipping)

- Order summary sidebar visible from cart step onward: subtotal ($197.00), Shipping (Free), Estimated tax ($16.25), Total ($213.25). ✓
- Quantity increment updates order summary correctly: +2 headphones → subtotal $455.00, tax $37.54, total $492.54. ✓
- Shipping step: same sidebar values persist unchanged. ✓
- Footer note: "Taxes and shipping shown above. No surprises at the end." ✓

**Success criterion met**: Full breakdown (subtotal, shipping, tax, total) visible from step 1. Total never changes unexpectedly.

---

### Task 3: Review and edit before placing the order
**Result: PARTIALLY COMPLETES with significant friction** (shots: 01-review-before-edit, 02-back-on-shipping, 03-review-after-edit)

- Review step shows Items / Shipping / Payment sections with "Edit" links. ✓
- Clicking Edit (Shipping) takes user back to the shipping form — fields are PRE-FILLED from prior data. ✓
- After editing city and submitting shipping, the flow goes to the PAYMENT step — and **the payment fields are BLANK** (source: `goTo("payment")` is called but `paymentData` values are never written back into the DOM inputs). The user must re-enter all four payment fields.
- The scenario fills payment again, clicks to review, and review shows the updated city "Capital City". ✓ (after re-entry)
- Place order confirms. ✓

**Broken promise**: Review → Edit Shipping → re-enter all payment data. The UI promises "go back and edit" but silently erases entered payment details, forcing full re-entry. This is the headline friction point.

**Note on Edit Items**: Clicking Edit (Items) from review transforms cart CTA to "Return to review" / "Cancel" — but this path also requires going through payment again if the user returns via "Return to review", since it lands on review directly. If items are changed, the edit-cart-to-review shortcut skips re-validating payment, which is acceptable for a static app.

---

## Part 2 — Encoding inventory

| Encoding | Where | Meaning |
|---|---|---|
| Blue filled circle (step dot) | Step indicator | Current/active step |
| Green filled circle (step dot) | Step indicator | Completed step |
| Gray filled circle (step dot) | Step indicator | Future/not yet reached step |
| Blue underline connector | Step indicator | Line between steps, color indicates done vs pending |
| Blue button (btn-primary) | All steps | Primary forward action |
| White/outline button (btn-ghost) | All steps | Secondary/back action |
| Red border + red text (.invalid + .error) | Form fields | Validation error state |
| Green circle with checkmark | Confirmation | Success / order placed |
| Blue link text ("Edit") | Review step | Navigate back to edit a section |

**Color consistency**: Red = error only (not used decoratively). Blue = action + active step (consistent meaning — could theoretically conflict between "step I'm on" and "button", but since these are different element types it doesn't cause confusion). Green = done/success (consistent). No inconsistency found.

**Learnable without a legend?** Yes — conventions match standard e-commerce patterns. Step dots with numbers are universally understood. Error red with adjacent text is standard.

**Accessibility note**: "Estimated tax" in order summary becomes "Tax" on confirmation screen — minor label inconsistency.

---

## Part 3 — Per-screen checklist

### Shared spine (every screen)

**Visual hierarchy & grouping**
- Cart: ✓ Items list visually dominant, CTA clearly below, order summary sidebar grouped separately.
- Shipping: ✓ Form fields in logical order (name → email → address → city/zip). CTA pair (back / continue) grouped at bottom.
- Payment: ✓ Card fields logically ordered. Expiry + CVC in a two-column row, consistent with convention.
- Review: ✓ Three blocks (Items, Shipping, Payment) clearly separated. "Place order" most visually prominent CTA.
- Confirmation: ✓ Checkmark icon + "Order placed" heading lead; order number and email notice follow; cost summary recapped.

**Consistent meaning of color & icons**
- ✓ (see encoding inventory above — no violations found)
- ✓ Error state uses red border AND red text (not color alone).
- ✓ Icons in cart are emoji thumbnails (decorative). Step dots carry number + label text (not color alone).

**Feedback & system status**
- ✓ Step indicator updates on each navigation, visually confirming progress.
- ✓ Validation errors appear synchronously on form submission attempt and clear on fix.
- ✓ Confirmation state is unambiguous (large "Order placed", order number, email statement).
- ✗ No loading/processing state on "Place order" click — the app is static so there's no real delay, but in production this pattern would need a spinner or button disabled state. Low priority given known static constraint.

**Error prevention & recall**
- ✓ Field validation prevents advancing with empty/invalid fields.
- ✗ Payment data not repopulated when returning to payment step from review-edit-shipping flow. User must recall and re-enter all card details. (High severity — see task 3.)
- ✓ CVC placeholder ("123") matches the help text in validation message.
- ✓ Expiry placeholder "MM/YY" matches format hint in label.

**Consistency & language**
- ✓ Button labels name the outcome: "Continue to shipping", "Continue to payment", "Review order", "Place order". Action-oriented, clear.
- ✗ Minor: "Estimated tax" (order summary) vs "Tax" (confirmation recap). Same number, different label. Low.
- ✓ "Back to cart" / "Back to shipping" — directional. Unambiguous.
- ✓ Text is plain-language throughout; no jargon.
- ✓ Legibility: text sizes appear readable; no identified contrast issues.

---

### Guided-flow checklist (per step)

#### Step 1 — Cart

1. ✓ Clear what step is for: "Your cart", items listed, order summary alongside.
2. ✓ Single CTA "Continue to shipping" — visible, not hunted for.
3. ✓ Label names outcome ("shipping").
4. ✓ Step indicator advances to show progress.
5. ✓ One thing: review cart, quantity adjust, proceed.
6. ✓ No extraneous fields.
7. ✓ Quantity +/− controls; − is disabled at qty=1 (prevents zero-quantity bug). ✓
8. n/a (no text input).
9. ✓ Step indicator shows "1 of 5".
10. ✓ Back navigation available from later steps.
11. n/a (no irreversible action here).
12. ✓ Full cost breakdown visible. Trust note present.

#### Step 2 — Shipping

1. ✓ "Shipping address" heading, "All fields are required" sub-note.
2. ✓ Single CTA "Continue to payment".
3. ✓ Label names next step.
4. ✓ Step indicator shows step 2 active, step 1 done.
5. ✓ One thing: address collection.
6. ✓ Fields: name, email, address, city, zip — all standard for shipping.
7. ✓ Labels persistent (above inputs, not placeholder-only); field types appropriate; autocomplete attributes present.
8. ✓ Blur validation fires; errors are specific and adjacent ("Please enter your full name.", "Enter a valid email address.", "Enter a 5-digit ZIP code.").
9. ✓ Progress indicator shows 2/5.
10. ✓ "Back to cart" available.
11. n/a.
12. ✓ Cost sidebar visible.

**Issue**: No "State" field — addresses without a state may be ambiguous for delivery. However, this is not listed as a brief requirement and the app is static, so n/a for this review.

#### Step 3 — Payment

1. ✓ "Payment" heading, scope clear.
2. ✓ "Review order" CTA prominent.
3. ✓ Label names outcome.
4. ✓ Step indicator shows 3/5.
5. ✓ One thing: payment details.
6. ✓ Fields: card number, name on card, expiry, CVC — standard minimal set.
7. ✓ Placeholders ("1234 5678 9012 3456", "MM/YY", "123") are format hints, supplemented by persistent labels above. ✓
8. ✓ Validation on submit + blur. Messages specific: "Enter a valid card number.", "Use MM/YY format.", "Enter the 3-4 digit code."
9. ✓ Progress indicator 3/5.
10. ✓ "Back to shipping" available.
11. n/a (not irreversible).
12. ✓ Cost sidebar visible.

**Issue seen in probe**: When this step is reached after Edit Shipping from review, all fields are blank — previously entered payment data is not restored. User must re-enter. (High severity.)

#### Step 4 — Review

1. ✓ "Review your order", "Please confirm everything below. You can still go back and edit." — intent unmistakable.
2. ✓ "Place order" CTA visible at bottom; not buried.
3. ✓ "Place order" names the irreversible action.
4. ✓ Step indicator 4/5. After placing, moves to 5 (Done).
5. ✓ One thing: verify and commit.
6. n/a.
7. n/a (no inputs).
8. n/a.
9. ✓ Progress shown.
10. ✓ Three Edit links (Items, Shipping, Payment) + Back button.
11. ✓ This IS the review/confirm step before the irreversible commit. Fulfilled.
12. ✓ Cost sidebar present. Full breakdown also recapped on confirmation.

#### Step 5 — Confirmation

1. ✓ "Order placed" — unambiguous completion state.
2. n/a (no next action required).
3. n/a.
4. ✓ Step indicator shows all done (step 5 active).
5. n/a.
6. n/a.
7. n/a.
8. n/a.
9. n/a.
10. n/a.
11. n/a.
12. ✓ Order number, receipt email, cost recap, delivery estimate — all trust signals present.

---

## Mobile spot-check (390px)

- Order summary reflows to TOP of page on mobile (above cart items) — shots: m01-cart-mobile.
- Cart items visible below summary; CTA visible after scrolling slightly.
- Step indicator compresses to fit on one line — numbers and labels visible but smaller (shots: m01).
- Shipping form lays out fine in single column; all fields legible (shots: m02-shipping-mobile).
- Review step: order summary at top, then review blocks — "Place order" visible after scroll (shots: m04-review-mobile).
- Confirmation clear and well-structured (shots: m05-confirmation-mobile).

**Mobile-specific note**: On the cart step, the order summary appearing before "Your cart" means the persona sees total cost before seeing what they're buying. This is slightly unconventional but aligns with the brief's emphasis on cost transparency. Not a failure, but the "Your cart" heading lands below the fold on mobile without scrolling.
