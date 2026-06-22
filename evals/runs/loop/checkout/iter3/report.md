# UX Review — Northwind Checkout (checkout-loop)

## Goal (as understood)
A desktop shopper with items already in their cart completes a purchase through a multi-step flow (Cart → Shipping → Payment → Review → Confirmation), seeing the full cost up front and arriving at an unambiguous confirmation with an order number.
Reviewed on: 1280×900 desktop (primary); spot-checked 390px mobile.

---

## What's working

1. **Cost transparency is solid from the first screen.** Subtotal, shipping ("Free"), estimated tax, and total are all visible in the order summary sidebar on every step from cart through confirmation. The total never changes unexpectedly, and the sidebar tagline "No surprises at the end." is delivered in full.
2. **Happy path completes cleanly end-to-end.** Cart → Shipping → Payment → Review → Confirmation all work without a dead end. The confirmation screen shows a named order number (NW-XXXXXX), the confirmed email, a cost breakdown, and an estimated delivery date — everything the persona needs to feel confident the order went through.
3. **Review-step edit-and-return works for shipping and payment.** "Edit" links on the review step for Shipping and Payment navigate back to the right panel with previously entered data pre-populated. The "Items" Edit link returns the user to review correctly via the "Return to review" button.

---

## Findings (worst first)

---

### 1. Payment data is wiped when user edits shipping from the review step
- **severity:** high
- **principle:** error prevention / consistency
- **scope:** Review → Shipping → Payment (edit path)
- **observation:** Clicking "Edit" on the Shipping block in the review step takes the user to the Shipping panel (pre-populated correctly). But after saving shipping, the app advances to Payment with all payment fields empty — the previously entered card number, name, expiry, and CVC are gone. The user must re-enter all payment details before they can return to review. Confirmed in scenario 03: after editing city, all four payment fields had to be re-filled before "Review order" could be clicked.
- **why it matters:** This persona has already entered sensitive payment information once. Being silently asked to type it again — without warning — will cause confusion, added friction, and potential abandonment. It directly breaks the brief's guarantee that the review step lets users "fix anything before the irreversible Place order." The root cause is in `app.js`: `paymentData` is only written in the payment form's submit handler (line 333); navigating away from review before submitting payment again leaves `paymentData` holding the old state, but `populatePaymentForm()` reads it only if `paymentData.card` exists — and if the user had previously completed payment, it should populate. Further investigation shows `populatePaymentForm` is called on `goTo("payment")` — the real failure is that when the user edits shipping, the Payment form's `novalidate` form still shows empty because the browser doesn't retain values across `hidden` toggling; `populatePaymentForm()` must be filling in correctly but the screenshot in scenario 03 shows blank fields, confirming it does not.
- **suggested direction:** Ensure `paymentData` is persisted before leaving any step and that `populatePaymentForm()` fills all fields unconditionally on every navigation to the payment panel. Add a brief inline notice on the payment step when re-entering from review ("Your card details were saved — review and continue") to reassure the user they don't need to re-type everything.

---

### 2. Editing cart items from review bypasses the cost-confirmation steps
- **severity:** medium
- **principle:** efficiency / trust
- **scope:** Review → Cart edit path
- **observation:** Clicking "Edit" on Items from the review step navigates to the cart panel with a "Return to review" button. After adjusting quantities, clicking "Return to review" jumps directly back to the review screen, skipping shipping and payment entirely. The order summary sidebar updates live, so the new total is visible, but the user never passes through the steps where cost was first confirmed. The review screen shows the updated total without any indication that amounts changed.
- **why it matters:** The brief's cost-transparency task requires the persona to see the full cost breakdown at every step before committing. After a quantity change that raises the total, the persona lands on review without any call-out that the total just changed. For a user with "low patience for friction" but also "pain points around hidden fees," a silent price change on the review screen could feel like exactly the kind of surprise the app promised to prevent.
- **suggested direction:** After returning to review from a cart edit, show a brief inline notice (e.g., "Quantities updated — your total is now $X") in the review panel so the change is acknowledged. Alternatively, route through payment one more time so the new total appears in the familiar confirmation flow.

---

### 3. Mobile: order summary prices clip at the right edge on the cart step
- **severity:** low
- **principle:** legibility
- **scope:** Cart step, mobile 390px
- **observation:** On the mobile layout the order summary card moves above the cart panel. At 390px, the per-item prices in the order summary are cut off — "$129" renders as "$12" with the trailing digit hidden. The subtotal, shipping, tax, and total rows are readable. (Shot: `mobile-01-cart.png`)
- **why it matters:** The brief calls out cost transparency as a primary task. If the persona cannot read item-line prices on mobile, they cannot verify the breakdown before continuing — which is the core promise of the sidebar. Low rather than medium because the total is readable and the item prices are also visible on the desktop cart step; mobile is a spot-check target.
- **suggested direction:** On the `.si-price` span add `white-space: nowrap; flex-shrink: 0` and on `.si-name` add `overflow: hidden; text-overflow: ellipsis` so the price is never sacrificed.

---

### 4. Bulk validation on empty submit is harder to parse than progressive errors
- **severity:** low
- **principle:** feedback / error recovery
- **scope:** Shipping and Payment steps
- **observation:** If the user clicks "Continue" without touching any field, all validation errors fire at once — five red messages appear simultaneously (shot: `probe-02-shipping-validation.png`). Individual-field errors appear on blur, which is correct. The messages are specific and adjacent to each field, so recovery is possible, but a wall of simultaneous errors increases cognitive load.
- **why it matters:** Minor friction for the persona who moves quickly and skips a field. Not a blocker, but the simultaneous appearance of many errors is harder to act on than one error at a time.
- **suggested direction:** On submit failure, auto-focus the first invalid field and scroll to it so the user's eye lands on the first thing to fix. This is a small improvement on already-reasonable behavior.
