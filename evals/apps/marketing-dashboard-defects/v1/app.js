/* Marketing analytics dashboard — vanilla, no deps.
   Inline dataset summarized per date range. Plain-language, marketer-friendly. */

(function () {
  "use strict";

  // ---- Inline dataset ---------------------------------------------------
  // Daily revenue figures (most recent last). 90 days available; ranges slice it.
  // Numbers are realistic-but-synthetic for a mid-size DTC brand.
  const AS_OF = new Date("2026-06-22T08:00:00");

  // Generate a believable daily revenue series with weekly seasonality + growth.
  function buildSeries(days) {
    const out = [];
    const seed = 12000;
    for (let i = 0; i < days; i++) {
      const dow = (i + 5) % 7; // weekend dip
      const weekend = dow === 0 || dow === 6 ? 0.78 : 1;
      const wave = 1 + 0.10 * Math.sin(i / 4.5);
      const growth = 1 + (i / days) * 0.18;
      const noise = 1 + (((i * 37) % 11) - 5) / 100;
      const rev = Math.round((seed * weekend * wave * growth * noise) / 50) * 50;
      out.push(rev);
    }
    return out;
  }
  const FULL = buildSeries(90); // index 0 = oldest

  // Per-channel share of revenue and their target index (>1 = ahead).
  const CHANNELS = [
    { name: "Paid Search", share: 0.34, perf: 1.12 },
    { name: "Paid Social", share: 0.26, perf: 0.83 },
    { name: "Email",       share: 0.20, perf: 1.21 },
    { name: "Organic",     share: 0.13, perf: 1.04 },
    { name: "Display",     share: 0.07, perf: 0.66 },
  ];

  // Daily revenue target the team committed to.
  const DAILY_TARGET = 13800;
  // Spend & conversion modeling (kept simple, derived from revenue).
  const SPEND_RATE = 0.27;          // spend ~27% of revenue
  const ORDER_VALUE = 92;           // avg revenue per new customer

  // ---- Helpers ----------------------------------------------------------
  const fmtMoney = (n) =>
    "$" + Math.round(n).toLocaleString("en-US");
  const fmtMoneyK = (n) => {
    if (n >= 1000) return "$" + (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "K";
    return "$" + Math.round(n);
  };
  const fmtNum = (n) => Math.round(n).toLocaleString("en-US");
  const pct = (n) => (n >= 0 ? "+" : "") + n.toFixed(1) + "%";

  function statusFor(ratio) {
    if (ratio >= 1.0) return "good";
    if (ratio >= 0.9) return "warn";
    return "bad";
  }

  // ---- Compute summary for a range -------------------------------------
  function summarize(days) {
    const series = FULL.slice(FULL.length - days);
    let prevSeries = FULL.slice(Math.max(0, FULL.length - days * 2), FULL.length - days);
    // If there isn't a full prior window of equal length (e.g. the 90-day
    // range), estimate it from the same data so deltas stay meaningful rather
    // than collapsing to 0%: scale the older portion up to the window length.
    if (prevSeries.length < days) {
      const avail = prevSeries.length
        ? prevSeries
        : FULL.slice(0, Math.max(1, Math.floor(days / 2)));
      const avg = avail.reduce((a, b) => a + b, 0) / avail.length;
      prevSeries = Array.from({ length: days }, () => avg);
    }

    const revenue = series.reduce((a, b) => a + b, 0);
    const prevRevenue = prevSeries.reduce((a, b) => a + b, 0) || revenue;
    const spend = revenue * SPEND_RATE;
    const prevSpend = prevRevenue * SPEND_RATE;
    const conversions = revenue / ORDER_VALUE;
    const prevConversions = prevRevenue / ORDER_VALUE;
    const roas = revenue / spend;
    const prevRoas = prevRevenue / prevSpend;

    const revTarget = DAILY_TARGET * days;
    const spendTarget = revTarget * SPEND_RATE * 1.05; // budget cap a bit above
    const convTarget = revTarget / ORDER_VALUE;
    const roasTarget = 3.5;

    return {
      days, series,
      revenue, prevRevenue, revTarget,
      spend, prevSpend, spendTarget,
      conversions, prevConversions, convTarget,
      roas, prevRoas, roasTarget,
    };
  }

  // ---- Render KPI cards -------------------------------------------------
  function deltaPct(cur, prev) {
    if (!prev) return 0;
    return ((cur - prev) / prev) * 100;
  }

  function renderKpi(id, opts) {
    const card = document.getElementById(id);
    const valEl = card.querySelector('[data-field="value"]');
    const deltaEl = card.querySelector('[data-field="delta"]');
    const targetEl = card.querySelector('[data-field="target"]');
    const barEl = card.querySelector('[data-field="bar"]');

    valEl.textContent = opts.value;

    // Revenue card was stripped of its context block in this build; guard the
    // optional sub-elements so the rest of the card still renders.
    const ratio = opts.ratio;
    const status = statusFor(opts.deltaGoodWhenUp === false ? (2 - ratio) : ratio);
    if (deltaEl) {
      const d = opts.delta;
      deltaEl.textContent = pct(d) + " vs prior period";
      deltaEl.classList.remove("up", "down");
      if (opts.deltaGoodWhenUp === false) {
        deltaEl.classList.add(d <= 0 ? "up" : "down");
      } else {
        deltaEl.classList.add(d >= 0 ? "up" : "down");
      }
    }
    if (targetEl) targetEl.textContent = opts.targetText;
    if (barEl) {
      barEl.style.width = Math.max(4, Math.min(100, ratio * 100)) + "%";
      barEl.className = "kpi-bar-fill fill-" + status;
    }
  }

  // ---- Trend chart (inline SVG) ----------------------------------------
  function renderTrend(s) {
    const series = s.series;
    const W = 640, H = 260, padL = 48, padR = 16, padT = 16, padB = 28;
    const innerW = W - padL - padR;
    const innerH = H - padT - padB;

    const maxV = Math.max(DAILY_TARGET, ...series) * 1.12;
    const minV = 0;
    const x = (i) => padL + (series.length === 1 ? 0 : (i / (series.length - 1)) * innerW);
    const y = (v) => padT + innerH - ((v - minV) / (maxV - minV)) * innerH;

    // gridlines + y labels
    const ticks = 4;
    let grid = "";
    for (let t = 0; t <= ticks; t++) {
      const v = (maxV / ticks) * t;
      const yy = y(v);
      grid += `<line class="grid-line" x1="${padL}" y1="${yy.toFixed(1)}" x2="${W - padR}" y2="${yy.toFixed(1)}"/>`;
      grid += `<text class="axis-label" x="${padL - 8}" y="${(yy + 4).toFixed(1)}" text-anchor="end">${fmtMoneyK(v)}</text>`;
    }

    // x labels (a few dates)
    const startDate = new Date(AS_OF);
    startDate.setDate(startDate.getDate() - (series.length - 1));
    let xlabels = "";
    const labelIdx = [0, Math.floor((series.length - 1) / 2), series.length - 1];
    labelIdx.forEach((i) => {
      const dt = new Date(startDate);
      dt.setDate(dt.getDate() + i);
      const label = dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const anchor = i === 0 ? "start" : i === series.length - 1 ? "end" : "middle";
      xlabels += `<text class="axis-label" x="${x(i).toFixed(1)}" y="${H - 8}" text-anchor="${anchor}">${label}</text>`;
    });

    // actual line + area
    let linePts = series.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
    let areaPts = `${padL},${y(0).toFixed(1)} ` + linePts + ` ${x(series.length - 1).toFixed(1)},${y(0).toFixed(1)}`;

    // target line (flat at DAILY_TARGET)
    const ty = y(DAILY_TARGET);
    const targetLine = `<line class="target-line" x1="${padL}" y1="${ty.toFixed(1)}" x2="${W - padR}" y2="${ty.toFixed(1)}"/>`;

    // a couple of endpoint dots
    const lastDot = `<circle class="dot" cx="${x(series.length - 1).toFixed(1)}" cy="${y(series[series.length - 1]).toFixed(1)}" r="3.5"/>`;

    const svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Daily revenue trend versus target">
      ${grid}
      <polygon class="actual-area" points="${areaPts}"/>
      ${targetLine}
      <polyline class="actual-line" points="${linePts}"/>
      ${lastDot}
      ${xlabels}
    </svg>`;
    document.getElementById("trend-chart").innerHTML = svg;

    const last = series[series.length - 1];
    const sub = document.getElementById("trend-sub");
    if (last >= DAILY_TARGET) {
      sub.innerHTML = `Yesterday's revenue of <strong>${fmtMoney(last)}</strong> was above the daily target of ${fmtMoney(DAILY_TARGET)}.`;
    } else {
      sub.innerHTML = `Yesterday's revenue of <strong>${fmtMoney(last)}</strong> was below the daily target of ${fmtMoney(DAILY_TARGET)}.`;
    }
  }

  // ---- Channel breakdown (bars) ----------------------------------------
  function renderChannels(s) {
    const list = document.getElementById("channel-list");
    list.innerHTML = "";
    const totals = CHANNELS.map((c) => ({
      name: c.name,
      revenue: s.revenue * c.share,
      perf: c.perf,
      target: (s.revenue * c.share) / c.perf,
    }));
    const maxRev = Math.max(...totals.map((t) => t.revenue));

    totals.forEach((t) => {
      const status = statusFor(t.perf);
      const statusText =
        status === "good" ? "Ahead of target" : status === "warn" ? "Close to target" : "Behind target";
      const widthPct = (t.revenue / maxRev) * 100;
      const targetPct = (t.target / maxRev) * 100;

      const row = document.createElement("div");
      row.className = "channel-row";
      row.innerHTML = `
        <div class="channel-name">${t.name}</div>
        <div class="channel-track" title="Marker shows this channel's target">
          <div class="channel-fill fill-${status}" style="width:${widthPct.toFixed(1)}%"></div>
          <div class="channel-target-mark" style="left:${Math.min(99, targetPct).toFixed(1)}%"></div>
        </div>
        <div class="channel-meta">
          <div class="channel-value">${fmtMoney(t.revenue)}</div>
          <div class="channel-status status-${status}">${statusText}</div>
        </div>`;
      list.appendChild(row);
    });
  }

  // ---- Headline summary -------------------------------------------------
  function renderHeadline(s) {
    const el = document.getElementById("headline-text");
    const ratio = s.revenue / s.revTarget;
    const onTrack = ratio >= 1;
    const close = ratio >= 0.95 && ratio < 1;
    const best = [...CHANNELS].sort((a, b) => b.perf - a.perf)[0];
    const worst = [...CHANNELS].sort((a, b) => a.perf - b.perf)[0];
    const phrase = onTrack
      ? `<span class="hl-good"><strong>on track</strong></span>`
      : close
      ? `<strong>just under target</strong>`
      : `<span class="hl-bad"><strong>behind target</strong></span>`;
    const window = s.days === 7 ? "the last 7 days" : s.days === 90 ? "the last 90 days" : "the last 30 days";
    el.innerHTML =
      `Over ${window}, you brought in <strong>${fmtMoney(s.revenue)}</strong> — you're ${phrase} ` +
      `(${Math.round(ratio * 100)}% of your ${fmtMoney(s.revTarget)} goal). ` +
      `<strong>${best.name}</strong> is your strongest channel; <strong>${worst.name}</strong> needs attention.`;
  }

  // ---- Freshness label --------------------------------------------------
  function renderFreshness() {
    const el = document.getElementById("freshness");
    if (!el) return; // freshness label not present in this build
    const txt = AS_OF.toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "numeric", minute: "2-digit",
    });
    el.textContent = "Data as of " + txt;
  }

  // ---- Wire it all up ---------------------------------------------------
  function render(days) {
    const s = summarize(days);

    renderHeadline(s);

    renderKpi("kpi-revenue", {
      value: fmtMoney(s.revenue),
      delta: deltaPct(s.revenue, s.prevRevenue),
      targetText: `Target ${fmtMoney(s.revTarget)} · ${Math.round((s.revenue / s.revTarget) * 100)}% reached`,
      ratio: s.revenue / s.revTarget,
    });
    renderKpi("kpi-spend", {
      value: fmtMoney(s.spend),
      delta: deltaPct(s.spend, s.prevSpend),
      deltaGoodWhenUp: false,
      targetText: `Budget ${fmtMoney(s.spendTarget)} · ${Math.round((s.spend / s.spendTarget) * 100)}% used`,
      ratio: s.spend / s.spendTarget,
    });
    renderKpi("kpi-conversions", {
      value: fmtNum(s.conversions),
      delta: deltaPct(s.conversions, s.prevConversions),
      targetText: `Target ${fmtNum(s.convTarget)} · ${Math.round((s.conversions / s.convTarget) * 100)}% reached`,
      ratio: s.conversions / s.convTarget,
    });
    renderKpi("kpi-roas", {
      value: "$" + s.roas.toFixed(2),
      delta: deltaPct(s.roas, s.prevRoas),
      targetText: `Target $${s.roasTarget.toFixed(2)} per $1 spent`,
      ratio: s.roas / s.roasTarget,
    });

    renderTrend(s);
    renderChannels(s);
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderFreshness();
    const sel = document.getElementById("range-select");
    render(parseInt(sel.value, 10));
    sel.addEventListener("change", function () {
      render(parseInt(sel.value, 10));
    });
  });
})();
