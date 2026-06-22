// GearFinder — product catalog with faceted search. Vanilla JS, no deps.
'use strict';

// ---- inline image helper: simple colored placeholder with an icon glyph ----
function svgImage(bg, glyph) {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='180' viewBox='0 0 240 180'>` +
    `<rect width='240' height='180' fill='${bg}'/>` +
    `<rect x='0' y='0' width='240' height='180' fill='url(#g)' opacity='0.18'/>` +
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
    `<stop offset='0' stop-color='#ffffff'/><stop offset='1' stop-color='#000000'/></linearGradient></defs>` +
    `<text x='120' y='110' font-size='72' text-anchor='middle' fill='#ffffff' opacity='0.92'>${glyph}</text>` +
    `</svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// ---- dataset (24 items) ----
const PRODUCTS = [
  { id: 1,  title: 'TrailLite 45L Hiking Backpack', brand: 'Summit', category: 'Backpacks', price: 129, rating: 4.6, color: '#2f7d57', glyph: '🎒' },
  { id: 2,  title: 'DayPack 22L Commuter Bag', brand: 'Summit', category: 'Backpacks', price: 64, rating: 4.2, color: '#3a6ea5', glyph: '🎒' },
  { id: 3,  title: 'Ultralight Down Sleeping Bag', brand: 'NorthPeak', category: 'Camping', price: 189, rating: 4.8, color: '#7b4fa0', glyph: '🛏️' },
  { id: 4,  title: '2-Person Backpacking Tent', brand: 'NorthPeak', category: 'Camping', price: 219, rating: 4.5, color: '#c0622d', glyph: '⛺' },
  { id: 5,  title: 'Compact Camp Stove', brand: 'Ember', category: 'Camping', price: 49, rating: 4.3, color: '#b3402e', glyph: '🔥' },
  { id: 6,  title: 'Insulated Stainless Bottle 1L', brand: 'Ember', category: 'Hydration', price: 32, rating: 4.7, color: '#2b8c8c', glyph: '🍶' },
  { id: 7,  title: 'Hydration Vest 12L', brand: 'Stride', category: 'Hydration', price: 78, rating: 4.1, color: '#456b2f', glyph: '🦺' },
  { id: 8,  title: 'GoreShell Rain Jacket', brand: 'Stride', category: 'Apparel', price: 159, rating: 4.4, color: '#34495e', glyph: '🧥' },
  { id: 9,  title: 'Merino Base Layer Top', brand: 'WoolWorks', category: 'Apparel', price: 72, rating: 4.6, color: '#8a5a2b', glyph: '👕' },
  { id: 10, title: 'Trail Running Shorts', brand: 'Stride', category: 'Apparel', price: 38, rating: 3.9, color: '#5d6d7e', glyph: '🩳' },
  { id: 11, title: 'Quick-Dry Hiking Socks 3-Pack', brand: 'WoolWorks', category: 'Apparel', price: 24, rating: 4.5, color: '#7d6608', glyph: '🧦' },
  { id: 12, title: 'TrailGrip Hiking Boots', brand: 'Summit', category: 'Footwear', price: 175, rating: 4.7, color: '#6e4b2a', glyph: '🥾' },
  { id: 13, title: 'Featherweight Trail Shoes', brand: 'Stride', category: 'Footwear', price: 119, rating: 4.2, color: '#1f618d', glyph: '👟' },
  { id: 14, title: 'Approach Sandals', brand: 'Ember', category: 'Footwear', price: 56, rating: 3.8, color: '#a04000', glyph: '👡' },
  { id: 15, title: 'Headlamp 400 Lumen', brand: 'Lumio', category: 'Electronics', price: 42, rating: 4.6, color: '#283747', glyph: '🔦' },
  { id: 16, title: 'Solar Power Bank 20000mAh', brand: 'Lumio', category: 'Electronics', price: 68, rating: 4.0, color: '#117864', glyph: '🔋' },
  { id: 17, title: 'GPS Trail Watch', brand: 'Lumio', category: 'Electronics', price: 249, rating: 4.5, color: '#1a5276', glyph: '⌚' },
  { id: 18, title: 'Trekking Poles (pair)', brand: 'NorthPeak', category: 'Accessories', price: 89, rating: 4.4, color: '#7e5109', glyph: '🥢' },
  { id: 19, title: 'Quick-Dry Travel Towel', brand: 'WoolWorks', category: 'Accessories', price: 19, rating: 4.3, color: '#117a65', glyph: '🧻' },
  { id: 20, title: 'First-Aid Trail Kit', brand: 'Ember', category: 'Accessories', price: 29, rating: 4.7, color: '#922b21', glyph: '🩹' },
  { id: 21, title: 'Foldable Camp Chair', brand: 'NorthPeak', category: 'Camping', price: 45, rating: 4.1, color: '#1e8449', glyph: '🪑' },
  { id: 22, title: 'Bear-Safe Food Canister', brand: 'Summit', category: 'Camping', price: 84, rating: 4.5, color: '#6c3483', glyph: '🥫' },
  { id: 23, title: 'Collapsible Water Filter', brand: 'Ember', category: 'Hydration', price: 54, rating: 4.6, color: '#1f8c8c', glyph: '💧' },
  { id: 24, title: 'Packable Puffy Vest', brand: 'WoolWorks', category: 'Apparel', price: 98, rating: 4.2, color: '#2e4053', glyph: '🦺' },
];

// ---- state ----
const state = {
  query: '',
  categories: new Set(),
  brands: new Set(),
  maxPrice: 400,       // 400 == "Any"
  minRating: 0,        // 0 == "Any"
  sort: 'featured',
};

const PRICE_MAX = 400;
const RATING_STEPS = [0, 3, 4, 4.5];

const el = (id) => document.getElementById(id);

// ---- derived facet values ----
const ALL_CATEGORIES = [...new Set(PRODUCTS.map((p) => p.category))].sort();
const ALL_BRANDS = [...new Set(PRODUCTS.map((p) => p.brand))].sort();

// ---- matching ----
function matchesQuery(p, q) {
  if (!q) return true;
  const hay = (p.title + ' ' + p.brand + ' ' + p.category).toLowerCase();
  // tolerant: every whitespace-separated token must appear as a substring
  return q.toLowerCase().split(/\s+/).filter(Boolean).every((tok) => hay.includes(tok));
}

function passesFacets(p) {
  if (state.categories.size && !state.categories.has(p.category)) return false;
  if (state.brands.size && !state.brands.has(p.brand)) return false;
  if (p.price > state.maxPrice) return false;
  if (p.rating < state.minRating) return false;
  return true;
}

function currentResults() {
  let list = PRODUCTS.filter((p) => matchesQuery(p, state.query) && passesFacets(p));
  list = sortList(list);
  return list;
}

function sortList(list) {
  const copy = list.slice();
  switch (state.sort) {
    case 'price-asc': copy.sort((a, b) => a.price - b.price); break;
    case 'price-desc': copy.sort((a, b) => b.price - a.price); break;
    case 'rating-desc': copy.sort((a, b) => b.rating - a.rating); break;
    default: // featured: rating desc as a sensible default ordering
      copy.sort((a, b) => b.rating - a.rating || a.price - b.price);
  }
  return copy;
}

// counts for a facet, holding that facet out (so counts stay useful)
function facetCounts(kind) {
  const counts = {};
  for (const p of PRODUCTS) {
    if (!matchesQuery(p, state.query)) continue;
    if (kind !== 'category' && state.categories.size && !state.categories.has(p.category)) continue;
    if (kind !== 'brand' && state.brands.size && !state.brands.has(p.brand)) continue;
    if (p.price > state.maxPrice) continue;
    if (p.rating < state.minRating) continue;
    const key = kind === 'category' ? p.category : p.brand;
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function stars(rating) {
  const full = Math.round(rating);
  return '★★★★★'.slice(0, full) + '☆☆☆☆☆'.slice(0, 5 - full);
}

// ---- rendering ----
function renderFacets() {
  // Category
  const catCounts = facetCounts('category');
  el('facet-category').innerHTML = ALL_CATEGORIES.map((c) => {
    const checked = state.categories.has(c) ? 'checked' : '';
    const n = catCounts[c] || 0;
    return `<label class="opt"><input type="checkbox" data-cat="${c}" ${checked} />` +
      `<span>${c}</span><span class="opt-count">${n}</span></label>`;
  }).join('');

  // Brand
  const brandCounts = facetCounts('brand');
  el('facet-brand').innerHTML = ALL_BRANDS.map((b) => {
    const checked = state.brands.has(b) ? 'checked' : '';
    const n = brandCounts[b] || 0;
    return `<label class="opt"><input type="checkbox" data-brand="${b}" ${checked} />` +
      `<span>${b}</span><span class="opt-count">${n}</span></label>`;
  }).join('');

  // Price
  el('facet-price').value = state.maxPrice;
  el('price-out').textContent = state.maxPrice >= PRICE_MAX ? 'Any' : `Up to $${state.maxPrice}`;

  // Rating
  el('facet-rating').innerHTML = RATING_STEPS.map((r) => {
    const checked = state.minRating === r ? 'checked' : '';
    const label = r === 0 ? 'Any rating' : `${r}+ stars`;
    const starsHtml = r === 0 ? '' : `<span class="stars" aria-hidden="true">${stars(r)}</span>`;
    return `<label class="opt"><input type="radio" name="rating" data-rating="${r}" ${checked} />` +
      `<span>${label}</span>${starsHtml}</label>`;
  }).join('');
}

function renderChips() {
  const chips = [];
  if (state.query) {
    chips.push(chip(`Search: “${state.query}”`, () => { state.query = ''; el('search').value = ''; toggleClear(); }));
  }
  state.categories.forEach((c) => chips.push(chip(c, () => state.categories.delete(c))));
  state.brands.forEach((b) => chips.push(chip(b, () => state.brands.delete(b))));
  if (state.maxPrice < PRICE_MAX) {
    chips.push(chip(`Up to $${state.maxPrice}`, () => { state.maxPrice = PRICE_MAX; }));
  }
  if (state.minRating > 0) {
    chips.push(chip(`${state.minRating}+ stars`, () => { state.minRating = 0; }));
  }
  el('chips').innerHTML = '';
  chips.forEach((c) => el('chips').appendChild(c));
}

function chip(label, onRemove) {
  const span = document.createElement('span');
  span.className = 'chip';
  span.innerHTML = `<span>${label}</span>`;
  const x = document.createElement('button');
  x.className = 'chip-x';
  x.type = 'button';
  x.setAttribute('aria-label', `Remove filter ${label}`);
  x.textContent = '×';
  x.addEventListener('click', () => { onRemove(); update(); });
  span.appendChild(x);
  return span;
}

function renderResults(list) {
  const grid = el('grid');
  const empty = el('empty');
  el('result-count').textContent = list.length;
  el('result-noun').textContent = list.length === 1 ? 'product' : 'products';

  if (list.length === 0) {
    grid.hidden = true;
    grid.innerHTML = '';
    empty.hidden = false;
    renderEmpty();
    return;
  }
  empty.hidden = true;
  grid.hidden = false;
  grid.innerHTML = list.map(cardHtml).join('');
}

function cardHtml(p) {
  return `<article class="card">` +
    `<img class="card-img" src="${svgImage(p.color, p.glyph)}" alt="${p.title}" />` +
    `<div class="card-body">` +
    `<div class="card-brand">${p.brand}</div>` +
    `<h3 class="card-title">${p.title}</h3>` +
    `<div class="card-rating"><span class="stars" aria-hidden="true">${stars(p.rating)}</span>` +
    `<span>${p.rating.toFixed(1)}</span></div>` +
    `<div class="card-foot">` +
    `<span class="card-price">$${p.price}</span>` +
    `<span class="card-cat">${p.category}</span>` +
    `</div></div></article>`;
}

// Suggest what to relax: find the single facet whose removal yields the most results.
function relaxSuggestion() {
  const active = [];
  if (state.categories.size) active.push('category');
  if (state.brands.size) active.push('brand');
  if (state.maxPrice < PRICE_MAX) active.push('price');
  if (state.minRating > 0) active.push('rating');

  let best = null;
  for (const f of active) {
    const test = {
      categories: f === 'category' ? new Set() : state.categories,
      brands: f === 'brand' ? new Set() : state.brands,
      maxPrice: f === 'price' ? PRICE_MAX : state.maxPrice,
      minRating: f === 'rating' ? 0 : state.minRating,
    };
    const n = PRODUCTS.filter((p) =>
      matchesQuery(p, state.query) &&
      (!test.categories.size || test.categories.has(p.category)) &&
      (!test.brands.size || test.brands.has(p.brand)) &&
      p.price <= test.maxPrice &&
      p.rating >= test.minRating
    ).length;
    if (n > 0 && (!best || n > best.n)) best = { facet: f, n };
  }
  return best;
}

const FACET_LABEL = { category: 'category', brand: 'brand', price: 'max price', rating: 'minimum rating' };
const FACET_ACTION_LABEL = { category: 'all category filters', brand: 'brand filter', price: 'max price filter', rating: 'minimum rating filter' };

function renderEmpty() {
  const detail = el('empty-detail');
  const suggest = el('empty-suggest');
  const relaxBtn = el('empty-relax');
  const clearBtn = el('empty-clear');

  // F3: label “Clear” button accurately based on what is actually active
  const onlySearchActive = state.query && !state.categories.size && !state.brands.size && state.maxPrice >= PRICE_MAX && state.minRating === 0;
  clearBtn.textContent = onlySearchActive ? 'Clear search' : 'Clear all filters';

  const best = relaxSuggestion();
  if (best) {
    // F4: be accurate about clearing ALL category filters, not just one
    const actionDesc = best.facet === 'category' && state.categories.size > 1
      ? `Removing all category filters`
      : `Relaxing the ${FACET_LABEL[best.facet]} filter`;
    detail.textContent = `Your current filters are too narrow. ${actionDesc} would show ${best.n} ${best.n === 1 ? 'product' : 'products'}.`;
    relaxBtn.hidden = false;
    relaxBtn.textContent = best.facet === 'category' && state.categories.size > 1
      ? `Remove all category filters`
      : `Relax ${FACET_LABEL[best.facet]} filter`;
    relaxBtn.onclick = () => { relaxFacet(best.facet); update(); };
  } else {
    detail.textContent = state.query
      ? `We couldn't find anything for “${state.query}”. Try a different search term.`
      : `No products available. Try clearing your filters.`;
    relaxBtn.hidden = true;
  }

  // Suggestions: a few popular searches that DO return results
  const ideas = ['backpack', 'tent', 'jacket', 'boots', 'water'];
  const working = ideas.filter((q) => PRODUCTS.some((p) => matchesQuery(p, q))).slice(0, 4);
  suggest.innerHTML = `<div>Or try a popular search:</div><div class="suggest-chips">` +
    working.map((q) => `<button type="button" class="suggest-chip" data-suggest="${q}">${q}</button>`).join('') +
    `</div>`;
}

function relaxFacet(facet) {
  if (facet === 'category') state.categories.clear();
  else if (facet === 'brand') state.brands.clear();
  else if (facet === 'price') state.maxPrice = PRICE_MAX;
  else if (facet === 'rating') state.minRating = 0;
}

function clearAllFilters() {
  state.categories.clear();
  state.brands.clear();
  state.maxPrice = PRICE_MAX;
  state.minRating = 0;
}

function toggleClear() {
  el('search-clear').hidden = !el('search').value;
}

// ---- main update loop ----
function update() {
  renderFacets();
  renderChips();
  renderResults(currentResults());
}

// ---- events ----
el('search').addEventListener('input', (e) => {
  state.query = e.target.value.trim();
  toggleClear();
  update();
});
el('search-clear').addEventListener('click', () => {
  el('search').value = '';
  state.query = '';
  toggleClear();
  el('search').focus();
  update();
});

el('facet-category').addEventListener('change', (e) => {
  const c = e.target.getAttribute('data-cat');
  if (c == null) return;
  if (e.target.checked) state.categories.add(c); else state.categories.delete(c);
  update();
});
el('facet-brand').addEventListener('change', (e) => {
  const b = e.target.getAttribute('data-brand');
  if (b == null) return;
  if (e.target.checked) state.brands.add(b); else state.brands.delete(b);
  update();
});
el('facet-price').addEventListener('input', (e) => {
  state.maxPrice = Number(e.target.value);
  el('price-out').textContent = state.maxPrice >= PRICE_MAX ? 'Any' : `Up to $${state.maxPrice}`;
});
el('facet-price').addEventListener('change', () => update());
el('facet-rating').addEventListener('change', (e) => {
  const r = e.target.getAttribute('data-rating');
  if (r == null) return;
  state.minRating = Number(r);
  update();
});

el('sort').addEventListener('change', (e) => {
  state.sort = e.target.value;
  update();
});

el('reset-all').addEventListener('click', () => {
  state.query = '';
  el('search').value = '';
  toggleClear();
  clearAllFilters();
  state.sort = 'featured';
  el('sort').value = 'featured';
  update();
});

el('empty-clear').addEventListener('click', () => {
  state.query = '';
  el('search').value = '';
  toggleClear();
  clearAllFilters();
  update();
});

el('empty').addEventListener('click', (e) => {
  const q = e.target.getAttribute && e.target.getAttribute('data-suggest');
  if (q) {
    state.query = q;
    el('search').value = q;
    toggleClear();
    clearAllFilters();
    update();
  }
});

// ---- mobile filter toggle ----
(function () {
  const toggleBtn = el('mobile-filter-toggle');
  const panel = el('filters-panel');
  const overlay = el('filters-overlay');
  if (!toggleBtn) return;

  function openFilters() {
    panel.classList.add('filters-open');
    overlay.hidden = false;
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeFilters() {
    panel.classList.remove('filters-open');
    overlay.hidden = true;
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    if (panel.classList.contains('filters-open')) closeFilters(); else openFilters();
  });
  overlay.addEventListener('click', closeFilters);
})();

// ---- init ----
update();
