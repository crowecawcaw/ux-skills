# Brief — Northwind Checkout

```yaml
app:
  name: Northwind Checkout
  one_line_purpose: >
    A multi-step e-commerce checkout that takes a shopper from their cart to a
    placed order — costs shown clearly up front and a clear confirmation at the end.
  how_to_run: >
    Self-contained static app (vanilla HTML/CSS/JS, no build, no network). Served
    by the shared static server on :4010 from evals/apps. Open
    http://localhost:4010/checkout/index.html. Capture screenshots with
    `node evals/shoot.mjs evals/apps/checkout/scenarios/<scenario>.json <outDir>`
    (run from repo root).

primary_device: >
  Desktop laptop at ~1280px is the primary review target (matches the persona's
  context — paying at a desk). The layout collapses to a single column under
  760px, so spot-check mobile at 390px for the step indicator and the order
  summary moving above the form.

persona:
  goals: >
    Complete a purchase quickly and confidently, knowing the full price (including
    shipping and tax) before committing, and end with a clear confirmation.
  context: >
    A shopper who has already added items to their cart and just wants to pay.
    Browsing on a laptop, mild time pressure, low patience for friction.
  expertise_level: >
    Non-technical but experienced with online shopping. Expects familiar checkout
    conventions (steps, an order summary, a review screen, a "Place order" button).
  pain_points: >
    Hidden fees that only appear at the last step; long single-page forms; not
    being able to review or edit before an irreversible action; unclear whether
    the order actually went through.

core_job:
  when: I've got items in my cart and I'm ready to buy
  i_want_to: pay quickly with the full cost clear up front and no surprises
  so_i_can: place the order confidently and know it went through
  success_functional: >
    The persona moves cart → shipping → payment → review → confirmation, sees a
    full cost breakdown (subtotal, shipping, tax, total) from the start, reviews
    before placing the order, and lands on a clear confirmation with an order
    number.
  success_emotional: >
    Feels in control and unsurprised — the price never jumped, they got to check
    everything before committing, and they're confident the order is placed.

surface_type: guided-flow

primary_tasks:
  - title: Place an order end to end
    goal: Go from cart all the way to a confirmed order.
    happy_path:
      - Review the cart and continue to shipping
      - Fill the shipping address and continue
      - Fill payment details and continue
      - Review the order summary, then Place order
      - See the confirmation with an order number
    happy_path_script: evals/apps/checkout/scenarios/01-place-order.json
    success_criterion: >
      The persona reaches the confirmation state with an order number, having
      passed through every step without a dead end.

  - title: See the full cost before committing
    goal: Confirm subtotal, shipping, tax, and total are visible from early on.
    happy_path:
      - Land on the cart with the order summary already showing all costs
      - Adjust an item quantity and watch the totals update
      - Move forward and confirm the same breakdown stays visible
    happy_path_script: evals/apps/checkout/scenarios/02-cost-transparency.json
    success_criterion: >
      At every step before payment the persona can read subtotal, shipping, tax,
      and total — and the total never changes unexpectedly at the end.

  - title: Review and edit before placing the order
    goal: Use the review step to verify and correct details before committing.
    happy_path:
      - Reach the review step after entering shipping and payment
      - Use an "Edit" link to jump back and change a detail
      - Return to review and place the order
    happy_path_script: evals/apps/checkout/scenarios/03-review-edit.json
    success_criterion: >
      The persona can verify items, address, and payment on one screen and jump
      back to fix anything before the irreversible "Place order".

scope:
  in:
    - The multi-step checkout flow (cart, shipping, payment, review, confirmation)
    - The persistent order summary with full cost breakdown
    - Inline field validation and the review/edit affordances
  out:
    - Real payment processing / order persistence (the app is static; no network)
    - Product browsing and add-to-cart (the cart is pre-populated)
    - Accounts, login, saved addresses

known_gaps:
  - The cart is fixed/inlined; there is no "remove item" control (only quantity +/−).
  - Payment is not really charged and the order number is generated client-side.

constraints:
  - Static vanilla app; no build step, no external CDNs, no network calls.
  - Cart dataset is inlined in app.js.
  - Works on desktop (primary) and collapses to a single column on mobile.
```
