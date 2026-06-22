# UX Review — Northwind Checkout (iter1)

## Goal (as understood)
A time-pressed, non-technical shopper who has already filled their cart wants to pay quickly, see the full cost (subtotal, shipping, tax, total) up front with no surprises, review and edit everything before committing, and land on a clear confirmation with an order number. Success = cart → shipping → payment → review → confirmation, no dead ends, total never jumps.

Reviewed on: desktop 1280px (primary), spot-checked mobile at 390px. Findings noted where device-specific.

## What's working
1. **Full cost is transparent from the very first screen and stays put.** The order summary (subtotal, shipping, tax, total) is visible from the cart onward and persists on every step — sticky aside on desktop, pinned above the form on mobile. Adjusting a cart quantity updates subtotal, tax, and total live, and the total shown on the cart ($213.25) is identical at review and on the confirmation ("Total paid $213.25") — the price genuinely never jumps. Directly serves the persona's top pain point.
2. **The review step is a real, editable guard before the irreversible action.** Each section (Items / Shipping / Payment) has its own "Edit" link, and jumping back retains all previously entered data — including payment fields, which are NOT lost when the user goes back to edit shipping. Card is correctly masked to "ending in 4242".
3. **Clear, confident confirmation.** The Done step shows a green check, "Order placed", a concrete order number (NW-######), the receipt email, a full cost breakdown, and an estimated delivery date — the persona knows the order went through.
4. **Inline validation is specific and well-placed.** Empty/invalid submits surface per-field, plain-language, adjacent messages ("Enter a valid email address.", "Enter a 5-digit ZIP code.") with red borders, clearing as the user fixes them. No dead ends; the step indicator's active (blue) / done (green) states read clearly.

## Findings (worst first)

### 1. Editing from the review step forces a full re-walk forward with no "return to review"
- **severity:** medium
- **principle:** flexibility / feedback
- **scope:** cross-screen (review → shipping/payment → review)
- **observation:** From the review screen, the per-section "Edit" links correctly drop the user back onto the relevant form with data preserved. But there is no way to get straight back to review after the fix — the only path is the standard forward buttons ("Continue to payment" → "Review order"). A shopper who jumps to Shipping to correct one typo must pass through the Payment step again (even though nothing changed there) before they can confirm and place the order.
- **why it matters:** The persona is time-pressed and low-patience; "edit one field, then click through two more screens to get back" is exactly the friction a review step is supposed to remove. It also risks a moment of doubt ("did my payment info survive?") even though it did. The on-screen promise — "You can still go back and edit" — is delivered, but the round-trip is heavier than the persona expects from familiar checkouts.
- **suggested direction:** After an Edit jump, return the user directly to review on submit (e.g. set a "came from review" flag so the shipping/payment forms route back to review instead of forward), or add a persistent "Back to review" affordance on the intermediate steps when the user arrived via an Edit link.

### 2. On mobile (<760px) the step indicator collapses to bare numbers, losing all stage labels
- **severity:** low
- **principle:** discoverability / orientation
- **scope:** step indicator (mobile only)
- **observation:** Below 760px the CSS hides every step `.label`, leaving only numbered dots 1–5 with the active underline. The words Cart / Shipping / Payment / Review / Done disappear, so the persona must infer what each number means.
- **why it matters:** Progress position is still conveyed by the active/done coloring, so this doesn't block the task — but a non-technical shopper loses the "where am I / what's left" wayfinding the labels provide, one of the brief's named expectations ("familiar checkout conventions — steps"). Impact is mild because the panel heading (e.g. "Shipping address") still names the current step.
- **suggested direction:** Keep at least the current step's label visible on mobile (or shrink labels rather than hiding them entirely) so the numbered dots aren't unlabelled.

### 3. Shipping shows "Free" with no explanation of the threshold or the normal cost
- **severity:** low
- **principle:** clarity / trust
- **scope:** order summary (cross-screen)
- **observation:** The inlined cart subtotal ($197) already exceeds the $150 free-shipping threshold, so the Shipping line reads "Free" from the start and never shows the $6.99 flat rate. There's no copy explaining why it's free or that a smaller cart would incur shipping.
- **why it matters:** Minor and arguably positive (free shipping is good news), but a careful shopper may wonder whether "Free" is conditional, and if a quantity is decreased below the threshold the line would silently switch to "$6.99" with no explanation — a small surprise risk that cuts against the "no surprises" promise. Low because the happy-path cart is always above the threshold.
- **suggested direction:** Add a short note when shipping is free (e.g. "Free shipping on orders over $150") so the basis is legible and a future threshold crossing wouldn't read as an unexplained jump.
