## Goal (as understood)
A non-technical but experienced online shopper completes a multi-step checkout (cart → shipping → payment → review → confirmation) quickly and confidently, with the full cost visible from the start and the ability to review and edit before committing.
Reviewed on: Desktop 1280×900 (primary) + 390×844 mobile spot-check.

## What's working
1. **Cost transparency end to end** — Subtotal, shipping (Free), estimated tax, and total are visible in the sidebar from the cart step onward. Quantities update the summary live. Total never changes unexpectedly. The footer note "No surprises at the end." is kept.
2. **Confirmation is clear and complete** — The confirmation screen shows order number, receipt email address, full cost recap (subtotal / shipping / tax / total paid), and an estimated delivery date. The persona leaves with no ambiguity.
3. **Validation is specific and inline** — Errors appear adjacent to the offending field with plain-language, fix-oriented messages on both shipping and payment forms. The happy path through the flow has no dead ends.

## Findings (worst first)

---

**Finding 1**
- severity: high
- principle: feedback / error prevention / consistency
- scope: review step → edit shipping → payment step
- observation: When the persona clicks "Edit" on the Shipping block from the review screen, corrects an address field, and submits, the app routes to the payment step with all four payment fields blank. The previously entered card number, name on card, expiry, and CVC are captured in `paymentData` but never written back into the DOM inputs when the payment panel is re-displayed. The persona must re-enter all card details to proceed.
- why it matters: The review screen explicitly says "You can still go back and edit." Silently erasing payment data contradicts that promise. For a persona with low patience for friction, re-typing a 16-digit card number after fixing a city name is an outsized effort penalty at the moment of highest commitment anxiety. It erodes trust precisely when the app needs to earn it.
- suggested direction: When navigating to the payment panel, pre-populate its inputs from the stored `paymentData` object (mirror the same approach already used for the shipping form, where fields are pre-filled on back-navigation). Alternatively, when routing from review → edit shipping → payment, detect that payment is already captured and route directly to review, bypassing the payment re-entry entirely.

---

**Finding 2**
- severity: medium
- principle: discoverability / flexibility
- scope: cross-screen (step indicator, all steps)
- observation: The step indicator dots are purely decorative — clicking a completed (green) step does nothing. There are no click handlers on the `<li>` elements. Users accustomed to multi-step checkout often click the indicator to jump back. The only backward navigation during active steps is sequential "Back" button presses; during the shipping step, reaching the cart requires two clicks (Back to cart), which is reasonable, but a user on payment who wants to jump to cart must press Back twice.
- why it matters: Experienced online shoppers (the persona) commonly click progress steps to navigate. Inert dots that look interactive will be tried at least once, failing silently. This is a secondary path (Edit links on the review screen cover the main case), so it won't block completion, but it adds friction and surprise.
- suggested direction: Make completed step dots clickable and navigate the user to that step. If data-loss concern exists, keep the forward steps inert (grayed out and not clickable) while making completed steps interactive.

---

**Finding 3**
- severity: low
- principle: hierarchy / consistency
- scope: mobile (390px) — cart step
- observation: At mobile width the order summary card reflows to the top of the page, above the "Your cart" heading and item list. The persona sees the $213.25 total before they see what they're buying. The cart items and CTA require a short scroll to reach.
- why it matters: Marginally disorienting — conventional expectation is to see "what am I buying" before "what does it cost." Does not block the task; cost-first may even suit the brief's transparency goal. Impact is low.
- suggested direction: On mobile, consider stacking the cart panel (items + CTA) first and collapsing the order summary into an accordion or placing it below. Alternatively, keep the current order and accept the cost-first framing as intentional.

---

**Finding 4**
- severity: low
- principle: consistency
- scope: order summary sidebar (all steps) vs confirmation screen
- observation: The tax row is labelled "Estimated tax" in the persistent order summary sidebar throughout steps 1–4, but "Tax" on the confirmation screen's cost recap. Same numeric value, different label.
- why it matters: The label switch could momentarily suggest the confirmed amount is different in nature from the estimate shown earlier. Effect is negligible for most users.
- suggested direction: Align the label — use "Tax" on confirmation (since the amount is now final) and optionally drop "Estimated" from the sidebar once the order is placed, or keep "Estimated tax" consistently until confirmation and switch to "Tax" there with a note.
