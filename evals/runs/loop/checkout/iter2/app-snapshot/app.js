// Northwind checkout — vanilla JS multi-step guided flow.
// No network, no build. Cart data inlined below.

(function () {
  "use strict";

  // --- Inlined cart dataset ---
  var cart = [
    { id: "sku-wht", name: "Aero Wireless Headphones", emoji: "🎧", price: 129.0, qty: 1 },
    { id: "sku-cbl", name: "Braided USB-C Cable (2m)", emoji: "🔌", price: 14.5, qty: 2 },
    { id: "sku-std", name: "Adjustable Laptop Stand", emoji: "💻", price: 39.0, qty: 1 }
  ];

  var SHIPPING_FLAT = 6.99;
  var FREE_SHIPPING_THRESHOLD = 150.0;
  var TAX_RATE = 0.0825; // 8.25%

  var STEPS = ["cart", "shipping", "payment", "review", "confirmation"];

  // When user navigates to cart from review, remember to return to review after cart edit.
  var returnToReview = false;

  // Captured form state
  var shippingData = {};
  var paymentData = {};

  // --- Helpers ---
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function money(n) { return "$" + n.toFixed(2); }

  function subtotal() {
    return cart.reduce(function (s, it) { return s + it.price * it.qty; }, 0);
  }
  function shippingCost(sub) { return sub >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT; }
  function taxAmount(sub) { return sub * TAX_RATE; }
  function grandTotal() {
    var sub = subtotal();
    return sub + shippingCost(sub) + taxAmount(sub);
  }

  // --- Rendering ---
  function renderCart() {
    var list = $("#cart-list");
    list.innerHTML = "";
    cart.forEach(function (it, i) {
      var li = document.createElement("li");
      li.className = "cart-item";
      li.innerHTML =
        '<div class="cart-thumb">' + it.emoji + "</div>" +
        '<div class="cart-info">' +
          '<div class="cart-name">' + it.name + "</div>" +
          '<div class="cart-meta">' + money(it.price) + " each</div>" +
        "</div>" +
        '<div class="qty-control">' +
          '<button type="button" aria-label="Decrease quantity" data-dec="' + i + '"' + (it.qty <= 1 ? ' disabled' : '') + '>−</button>' +
          '<span class="qty">' + it.qty + "</span>" +
          '<button type="button" aria-label="Increase quantity" data-inc="' + i + '">+</button>' +
        "</div>" +
        '<div class="cart-line-price">' + money(it.price * it.qty) + "</div>";
      list.appendChild(li);
    });
  }

  function renderSummary() {
    var sub = subtotal();
    var ship = shippingCost(sub);
    var tax = taxAmount(sub);

    var items = $("#summary-items");
    items.innerHTML = "";
    cart.forEach(function (it) {
      var li = document.createElement("li");
      li.innerHTML =
        '<span class="si-name">' + it.name + " ×" + it.qty + "</span>" +
        '<span class="si-price">' + money(it.price * it.qty) + "</span>";
      items.appendChild(li);
    });

    $("#cost-subtotal").textContent = money(sub);
    $("#cost-shipping").textContent = ship === 0 ? "Free" : money(ship);
    $("#cost-tax").textContent = money(tax);
    $("#cost-total").textContent = money(sub + ship + tax);
  }

  function renderReview() {
    // Items
    var ri = $("#review-items");
    ri.innerHTML = "";
    cart.forEach(function (it) {
      var li = document.createElement("li");
      li.innerHTML =
        '<span class="ri-name">' + it.name + " ×" + it.qty + "</span>" +
        '<span class="ri-price">' + money(it.price * it.qty) + "</span>";
      ri.appendChild(li);
    });
    // Shipping
    $("#review-shipping").textContent =
      shippingData.name + "\n" +
      shippingData.address + "\n" +
      shippingData.city + ", " + shippingData.zip + "\n" +
      shippingData.email;
    // Payment (masked)
    var digits = (paymentData.card || "").replace(/\D/g, "");
    var last4 = digits.slice(-4);
    $("#review-payment").textContent =
      "Card ending in " + last4 + "\n" +
      paymentData.cardname + " · Exp " + paymentData.exp;
  }

  function renderConfirmation() {
    var sub = subtotal();
    var ship = shippingCost(sub);
    var tax = taxAmount(sub);
    var total = sub + ship + tax;

    $("#confirm-name").textContent = (shippingData.name || "there").split(" ")[0];
    $("#confirm-email").textContent = shippingData.email || "your email";

    var orderNo = "NW-" + Math.floor(100000 + Math.random() * 900000);
    $("#confirm-number").textContent = orderNo;

    var eta = new Date();
    eta.setDate(eta.getDate() + 4);
    $("#confirm-eta").textContent = eta.toLocaleDateString(undefined, {
      weekday: "long", month: "long", day: "numeric"
    });

    $("#confirm-summary").innerHTML =
      '<div class="cost-row"><span>Subtotal</span><span>' + money(sub) + "</span></div>" +
      '<div class="cost-row"><span>Shipping</span><span>' + (ship === 0 ? "Free" : money(ship)) + "</span></div>" +
      '<div class="cost-row"><span>Tax</span><span>' + money(tax) + "</span></div>" +
      '<div class="cost-row total"><span>Total paid</span><span>' + money(total) + "</span></div>";
  }

  // --- Step navigation ---
  function goTo(step) {
    STEPS.forEach(function (s) {
      var panel = $("#panel-" + s);
      if (panel) panel.hidden = s !== step;
    });
    updateIndicator(step);
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (step === "review") renderReview();
    if (step === "confirmation") renderConfirmation();
  }

  function updateIndicator(current) {
    var idx = STEPS.indexOf(current);
    $all("#step-indicator .step").forEach(function (el) {
      var s = el.getAttribute("data-step");
      var i = STEPS.indexOf(s);
      el.classList.remove("active", "done");
      if (i < idx) el.classList.add("done");
      else if (i === idx) el.classList.add("active");
    });
  }

  // --- Validation ---
  var VALIDATORS = {
    name: function (v) { return v.trim().length >= 2 ? "" : "Please enter your full name."; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Enter a valid email address."; },
    address: function (v) { return v.trim().length >= 4 ? "" : "Please enter your street address."; },
    city: function (v) { return v.trim().length >= 2 ? "" : "Please enter your city."; },
    zip: function (v) { return /^\d{5}(-\d{4})?$/.test(v.trim()) ? "" : "Enter a 5-digit ZIP code."; },
    card: function (v) {
      var d = v.replace(/\s|-/g, "");
      return /^\d{15,16}$/.test(d) ? "" : "Enter a valid card number.";
    },
    cardname: function (v) { return v.trim().length >= 2 ? "" : "Enter the name on the card."; },
    exp: function (v) {
      var m = v.trim().match(/^(\d{2})\/(\d{2})$/);
      if (!m) return "Use MM/YY format.";
      var mm = parseInt(m[1], 10);
      if (mm < 1 || mm > 12) return "Enter a valid month.";
      return "";
    },
    cvc: function (v) { return /^\d{3,4}$/.test(v.trim()) ? "" : "Enter the 3-4 digit code."; }
  };

  function validateField(input) {
    var name = input.name;
    var fn = VALIDATORS[name];
    if (!fn) return true;
    var msg = fn(input.value);
    var errEl = $('.error[data-for="' + input.id + '"]');
    if (msg) {
      input.classList.add("invalid");
      input.setAttribute("aria-invalid", "true");
      if (errEl) errEl.textContent = msg;
      return false;
    }
    input.classList.remove("invalid");
    input.removeAttribute("aria-invalid");
    if (errEl) errEl.textContent = "";
    return true;
  }

  function validateForm(form) {
    var ok = true;
    $all("input", form).forEach(function (input) {
      if (!validateField(input)) ok = false;
    });
    return ok;
  }

  function captureForm(form, target) {
    $all("input", form).forEach(function (input) {
      target[input.name] = input.value;
    });
  }

  function wireInlineValidation(form) {
    $all("input", form).forEach(function (input) {
      input.addEventListener("blur", function () { validateField(input); });
      input.addEventListener("input", function () {
        // Clear an existing error as the user fixes it (don't add new ones until blur).
        if (input.classList.contains("invalid")) validateField(input);
      });
    });
  }

  function updateCartActionsForReview() {
    var actions = $("#panel-cart .step-actions");
    // Replace the single "Continue to shipping" button with "Return to review"
    actions.innerHTML =
      '<button class="btn btn-ghost" id="cancel-cart-edit">Cancel</button>' +
      '<button class="btn btn-primary" id="to-shipping">Return to review</button>';
    // Wire new buttons
    $("#cancel-cart-edit").addEventListener("click", function () {
      returnToReview = false;
      resetCartActions();
      goTo("review");
    });
    $("#to-shipping").addEventListener("click", function () {
      if (returnToReview) {
        returnToReview = false;
        resetCartActions();
        goTo("review");
      } else {
        goTo("shipping");
      }
    });
  }

  function resetCartActions() {
    var actions = $("#panel-cart .step-actions");
    actions.innerHTML = '<button class="btn btn-primary" id="to-shipping">Continue to shipping</button>';
    $("#to-shipping").addEventListener("click", function () {
      if (returnToReview) {
        returnToReview = false;
        resetCartActions();
        goTo("review");
      } else {
        goTo("shipping");
      }
    });
  }

  // --- Wiring ---
  function init() {
    renderCart();
    renderSummary();
    updateIndicator("cart");

    // Cart quantity controls
    $("#cart-list").addEventListener("click", function (e) {
      var inc = e.target.getAttribute("data-inc");
      var dec = e.target.getAttribute("data-dec");
      if (inc !== null) { cart[+inc].qty++; renderCart(); renderSummary(); }
      else if (dec !== null) {
        if (cart[+dec].qty > 1) { cart[+dec].qty--; renderCart(); renderSummary(); }
      }
    });

    $("#to-shipping").addEventListener("click", function () {
      if (returnToReview) {
        returnToReview = false;
        goTo("review");
      } else {
        goTo("shipping");
      }
    });

    var formShipping = $("#form-shipping");
    wireInlineValidation(formShipping);
    formShipping.addEventListener("submit", function (e) {
      e.preventDefault();
      if (validateForm(formShipping)) {
        captureForm(formShipping, shippingData);
        goTo("payment");
      }
    });

    var formPayment = $("#form-payment");
    wireInlineValidation(formPayment);
    formPayment.addEventListener("submit", function (e) {
      e.preventDefault();
      if (validateForm(formPayment)) {
        captureForm(formPayment, paymentData);
        goTo("review");
      }
    });

    $("#place-order").addEventListener("click", function () { goTo("confirmation"); });

    // Back / Edit buttons (any element with data-back)
    $all("[data-back]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var dest = btn.getAttribute("data-back");
        // When editing cart from review, set a flag so we can skip back to review after edit.
        if (dest === "cart" && btn.closest("#panel-review")) {
          returnToReview = true;
          updateCartActionsForReview();
        }
        goTo(dest);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
