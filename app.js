(() => {
  "use strict";

  const META_KEY = "jcfc-meta-v1";
  const SESSION_KEY = "jcfc-session-v1";
  const SLOT_ROWS = [
    ["LW", "ST", "RW"],
    ["LCM", "DM", "RCM"],
    ["LB", "LCB", "RCB", "RB"],
    ["GK"],
  ];

  const POSITION_WEIGHTS = {
    GK:  { pace: 0.08, passing: 0.25, defending: 0.34, physical: 0.13, attack: 0.00, control: 0.20 },
    RB:  { pace: 0.25, passing: 0.19, defending: 0.23, physical: 0.13, attack: 0.12, control: 0.08 },
    LB:  { pace: 0.25, passing: 0.19, defending: 0.23, physical: 0.13, attack: 0.12, control: 0.08 },
    RCB: { pace: 0.14, passing: 0.14, defending: 0.35, physical: 0.24, attack: 0.02, control: 0.11 },
    LCB: { pace: 0.14, passing: 0.14, defending: 0.35, physical: 0.24, attack: 0.02, control: 0.11 },
    DM:  { pace: 0.09, passing: 0.24, defending: 0.25, physical: 0.18, attack: 0.06, control: 0.18 },
    RCM: { pace: 0.09, passing: 0.24, defending: 0.12, physical: 0.10, attack: 0.18, control: 0.27 },
    LCM: { pace: 0.09, passing: 0.24, defending: 0.12, physical: 0.10, attack: 0.18, control: 0.27 },
    RW:  { pace: 0.24, passing: 0.14, defending: 0.03, physical: 0.06, attack: 0.30, control: 0.23 },
    LW:  { pace: 0.24, passing: 0.14, defending: 0.03, physical: 0.06, attack: 0.30, control: 0.23 },
    ST:  { pace: 0.18, passing: 0.09, defending: 0.01, physical: 0.16, attack: 0.41, control: 0.15 },
  };

  const makePlayer = (name, position, cost, pace, passing, defending, physical, attack, control, styles) => ({
    name, position, cost, pace, passing, defending, physical, attack, control, styles,
  });

  const PLAYERS = {
    ederson: makePlayer("Ederson", "GK", 78, 69, 94, 84, 80, 20, 88, ["distributor", "sweeper"]),
    alisson: makePlayer("Alisson", "GK", 82, 65, 88, 92, 84, 18, 89, ["stopper", "sweeper"]),
    courtois: makePlayer("Thibaut Courtois", "GK", 82, 55, 80, 94, 88, 15, 86, ["stopper", "commanding"]),
    donnarumma: makePlayer("Gianluigi Donnarumma", "GK", 72, 56, 76, 90, 88, 16, 83, ["stopper", "commanding"]),

    hakimi: makePlayer("Achraf Hakimi", "RB", 88, 96, 84, 78, 80, 85, 86, ["overlap", "runner", "direct"]),
    trent: makePlayer("Trent Alexander-Arnold", "RB", 87, 78, 94, 76, 70, 78, 90, ["creator", "distributor", "technical"]),
    walker: makePlayer("Kyle Walker", "RB", 68, 92, 76, 86, 86, 67, 77, ["recovery", "aggressive", "runner"]),
    frimpong: makePlayer("Jeremie Frimpong", "RB", 76, 97, 79, 69, 72, 84, 86, ["overlap", "runner", "press"]),
    carvajal: makePlayer("Dani Carvajal", "RB", 66, 78, 82, 86, 82, 74, 83, ["aggressive", "technical", "leader"]),
    kounde: makePlayer("Jules Koundé", "RB", 78, 84, 80, 89, 82, 66, 84, ["controller", "recovery", "technical"]),

    saliba: makePlayer("William Saliba", "CB", 90, 86, 82, 93, 88, 45, 88, ["recovery", "controller"]),
    vanDijk: makePlayer("Virgil van Dijk", "CB", 88, 82, 84, 94, 94, 55, 86, ["commanding", "distributor"]),
    rudiger: makePlayer("Antonio Rüdiger", "CB", 75, 88, 74, 91, 94, 42, 78, ["aggressive", "recovery", "press"]),
    bastoni: makePlayer("Alessandro Bastoni", "CB", 82, 76, 90, 90, 84, 48, 88, ["distributor", "controller", "technical"]),
    dias: makePlayer("Rúben Dias", "CB", 84, 75, 82, 93, 91, 42, 84, ["commanding", "controller"]),
    araujo: makePlayer("Ronald Araújo", "CB", 79, 89, 73, 91, 93, 44, 77, ["aggressive", "recovery"]),
    gvardiol: makePlayer("Joško Gvardiol", "CB", 83, 85, 84, 88, 86, 69, 86, ["technical", "runner", "controller"]),

    theo: makePlayer("Theo Hernández", "LB", 86, 96, 82, 76, 88, 83, 85, ["overlap", "runner", "direct"]),
    nuno: makePlayer("Nuno Mendes", "LB", 79, 95, 82, 80, 78, 79, 86, ["overlap", "runner", "technical"]),
    davies: makePlayer("Alphonso Davies", "LB", 80, 98, 78, 76, 80, 78, 84, ["runner", "direct", "recovery"]),
    robertson: makePlayer("Andy Robertson", "LB", 65, 84, 85, 84, 83, 70, 80, ["press", "overlap", "aggressive"]),
    dimarco: makePlayer("Federico Dimarco", "LB", 72, 82, 90, 78, 72, 80, 87, ["creator", "technical", "overlap"]),

    rodri: makePlayer("Rodri", "DM", 96, 66, 94, 92, 88, 79, 95, ["controller", "distributor", "anchor"]),
    rice: makePlayer("Declan Rice", "DM", 90, 80, 86, 91, 91, 77, 88, ["anchor", "runner", "press"]),
    tchouameni: makePlayer("Aurélien Tchouaméni", "DM", 82, 78, 85, 89, 90, 71, 87, ["anchor", "aggressive", "controller"]),
    caicedo: makePlayer("Moisés Caicedo", "DM", 78, 78, 82, 90, 88, 66, 84, ["press", "aggressive", "runner"]),
    kimmich: makePlayer("Joshua Kimmich", "DM", 82, 72, 93, 84, 75, 74, 92, ["creator", "controller", "distributor"]),

    bellingham: makePlayer("Jude Bellingham", "CM", 98, 86, 88, 80, 90, 91, 93, ["runner", "box", "press"]),
    deBruyne: makePlayer("Kevin De Bruyne", "CM", 90, 75, 97, 63, 77, 90, 94, ["creator", "distributor", "direct"]),
    valverde: makePlayer("Federico Valverde", "CM", 87, 92, 87, 82, 91, 82, 88, ["runner", "press", "direct"]),
    pedri: makePlayer("Pedri", "CM", 86, 74, 94, 70, 67, 80, 96, ["controller", "creator", "technical"]),
    barella: makePlayer("Nicolò Barella", "CM", 80, 83, 88, 79, 82, 79, 90, ["press", "runner", "technical"]),
    odegaard: makePlayer("Martin Ødegaard", "CM", 86, 77, 94, 66, 69, 86, 94, ["creator", "controller", "press"]),
    musiala: makePlayer("Jamal Musiala", "CM", 88, 88, 87, 56, 70, 89, 96, ["creator", "dribbler", "technical"]),
    wirtz: makePlayer("Florian Wirtz", "CM", 87, 84, 91, 61, 70, 89, 95, ["creator", "technical", "direct"]),

    salah: makePlayer("Mohamed Salah", "RW", 96, 91, 87, 45, 78, 96, 92, ["finisher", "direct", "runner"]),
    saka: makePlayer("Bukayo Saka", "RW", 90, 88, 88, 58, 78, 91, 92, ["press", "creator", "direct"]),
    yamal: makePlayer("Lamine Yamal", "RW", 88, 91, 90, 42, 64, 91, 96, ["creator", "dribbler", "technical"]),
    dembele: makePlayer("Ousmane Dembélé", "RW", 82, 96, 84, 45, 65, 88, 92, ["dribbler", "press", "direct"]),
    palmer: makePlayer("Cole Palmer", "RW", 84, 79, 92, 51, 71, 91, 94, ["creator", "technical", "finisher"]),
    rodrygo: makePlayer("Rodrygo", "RW", 82, 90, 84, 45, 70, 88, 91, ["dribbler", "direct", "finisher"]),

    vinicius: makePlayer("Vinícius Júnior", "LW", 98, 98, 84, 38, 73, 95, 96, ["dribbler", "direct", "runner"]),
    mbappe: makePlayer("Kylian Mbappé", "LW", 100, 99, 84, 39, 82, 98, 96, ["finisher", "direct", "runner"]),
    kvaratskhelia: makePlayer("Khvicha Kvaratskhelia", "LW", 86, 90, 85, 46, 72, 90, 95, ["dribbler", "creator", "technical"]),
    leao: makePlayer("Rafael Leão", "LW", 83, 96, 79, 39, 84, 89, 90, ["direct", "runner", "dribbler"]),
    son: makePlayer("Son Heung-min", "LW", 82, 89, 82, 43, 75, 93, 89, ["finisher", "direct", "runner"]),
    diaz: makePlayer("Luis Díaz", "LW", 76, 92, 79, 54, 74, 85, 89, ["press", "dribbler", "runner"]),

    haaland: makePlayer("Erling Haaland", "ST", 100, 93, 72, 45, 96, 99, 88, ["finisher", "target", "runner"]),
    kane: makePlayer("Harry Kane", "ST", 92, 72, 91, 48, 86, 98, 94, ["finisher", "creator", "target"]),
    lautaro: makePlayer("Lautaro Martínez", "ST", 84, 84, 79, 56, 86, 92, 90, ["press", "finisher", "aggressive"]),
    osimhen: makePlayer("Victor Osimhen", "ST", 84, 94, 70, 48, 91, 94, 84, ["runner", "press", "finisher"]),
    isak: makePlayer("Alexander Isak", "ST", 86, 91, 80, 44, 79, 94, 93, ["finisher", "technical", "runner"]),
  };

  const SCENARIOS = [
    {
      id: "press",
      name: "Relentless High Press",
      brief: "Build a front-foot 4-3-3 that wins the ball high, attacks quickly and still has enough control to survive transitions.",
      budget: 420,
      preferred: ["press", "runner", "aggressive", "overlap"],
      multipliers: { pace: 1.18, passing: 0.97, defending: 1.08, physical: 1.13, attack: 1.05, control: 0.96 },
      targets: { pace: 84, defending: 79, physical: 80, attack: 83 },
      fixed: { GK: "ederson", LCB: "bastoni", RCB: "saliba", LB: "theo", DM: "rice", LW: "vinicius" },
      open: [
        { slot: "RB", options: ["hakimi", "frimpong", "walker"] },
        { slot: "LCM", options: ["valverde", "pedri", "deBruyne"] },
        { slot: "RCM", options: ["bellingham", "barella", "odegaard"] },
        { slot: "RW", options: ["saka", "salah", "dembele"] },
        { slot: "ST", options: ["osimhen", "haaland", "kane"] },
      ],
    },
    {
      id: "possession",
      name: "Total Control",
      brief: "Complete a patient possession team that can dominate the ball, progress through pressure and create without losing defensive security.",
      budget: 405,
      preferred: ["controller", "creator", "distributor", "technical"],
      multipliers: { pace: 0.91, passing: 1.22, defending: 1.00, physical: 0.94, attack: 1.00, control: 1.24 },
      targets: { passing: 86, control: 87, defending: 78, attack: 81 },
      fixed: { GK: "alisson", RB: "kounde", RCB: "saliba", LB: "gvardiol", DM: "rodri", RW: "saka" },
      open: [
        { slot: "LCB", options: ["bastoni", "dias", "araujo"] },
        { slot: "LCM", options: ["pedri", "deBruyne", "valverde"] },
        { slot: "RCM", options: ["odegaard", "musiala", "barella"] },
        { slot: "LW", options: ["kvaratskhelia", "son", "leao"] },
        { slot: "ST", options: ["kane", "lautaro", "haaland"] },
      ],
    },
    {
      id: "counter",
      name: "Devastating Counter",
      brief: "Build a compact side that can defend pressure, break lines with one pass and attack open space before the opposition can recover.",
      budget: 430,
      preferred: ["direct", "runner", "finisher", "recovery"],
      multipliers: { pace: 1.24, passing: 1.03, defending: 1.05, physical: 1.05, attack: 1.17, control: 0.93 },
      targets: { pace: 87, attack: 85, defending: 79, physical: 78 },
      fixed: { GK: "courtois", RB: "hakimi", RCB: "rudiger", LCB: "vanDijk", DM: "tchouameni", RW: "salah" },
      open: [
        { slot: "LB", options: ["davies", "nuno", "robertson"] },
        { slot: "LCM", options: ["valverde", "bellingham", "pedri"] },
        { slot: "RCM", options: ["deBruyne", "wirtz", "barella"] },
        { slot: "LW", options: ["mbappe", "vinicius", "son"] },
        { slot: "ST", options: ["haaland", "isak", "osimhen"] },
      ],
    },
  ];

  const app = document.querySelector("#app");
  let meta = loadJson(META_KEY, { bestScore: 0, games: 0, perfect: 0 });
  let game = loadJson(SESSION_KEY, null);

  function loadJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function save() {
    localStorage.setItem(META_KEY, JSON.stringify(meta));
    if (game) localStorage.setItem(SESSION_KEY, JSON.stringify(game));
    else localStorage.removeItem(SESSION_KEY);
  }

  function scenario() {
    return SCENARIOS.find((item) => item.id === game?.scenarioId);
  }

  function currentOpen() {
    return scenario()?.open[game.step] ?? null;
  }

  function player(id) {
    return PLAYERS[id];
  }

  function lineupPlayerId(slot) {
    const selected = game?.selections?.[slot];
    return selected ?? scenario()?.fixed?.[slot] ?? null;
  }

  function suitability(p, slot, sc) {
    const weights = POSITION_WEIGHTS[slot];
    let total = 0;
    let weightTotal = 0;

    for (const [attribute, baseWeight] of Object.entries(weights)) {
      const adjustedWeight = baseWeight * (sc.multipliers[attribute] ?? 1);
      total += p[attribute] * adjustedWeight;
      weightTotal += adjustedWeight;
    }

    const matches = p.styles.filter((style) => sc.preferred.includes(style)).length;
    return Math.min(99, total / weightTotal + Math.min(5, matches * 2.4));
  }

  function decisionMetric(p, slot, sc) {
    const fit = suitability(p, slot, sc);
    const valueBonus = Math.max(-2, Math.min(5, (92 - p.cost) * 0.16));
    return fit + valueBonus;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function topbar(title, subtitle = "") {
    return `
      <header class="topbar panel">
        <div>
          <p class="eyebrow">JCFC SQUAD DECISION LAB</p>
          <h1 class="brand">JC<span>FC</span></h1>
        </div>
        <div class="actions">
          ${title ? `<span class="badge good">${escapeHtml(title)}${subtitle ? ` · ${escapeHtml(subtitle)}` : ""}</span>` : ""}
          ${game ? '<button class="btn ghost" data-action="home">Menu</button>' : ""}
        </div>
      </header>`;
  }

  function renderHome() {
    const hasSession = Boolean(game && !game.complete);
    app.innerHTML = `
      <main class="shell">
        ${topbar()}
        <section class="hero panel">
          <p class="eyebrow">BUILD THE XI. DEFEND YOUR DECISIONS.</p>
          <h1>THE <span>TRANSFER</span> TEST</h1>
          <p class="lead">You inherit a partly completed team. Fill five gaps using real-life players and receive a manager rating out of 10.</p>
          <p class="copy">The score considers tactical fit, squad balance, decision quality and budget management. Expensive does not always mean correct.</p>
          <div class="actions">
            <button class="btn primary" data-action="random">Random challenge</button>
            ${hasSession ? '<button class="btn" data-action="continue">Continue challenge</button>' : ""}
          </div>
          <div class="kpis">
            <div class="kpi"><span>Best rating</span><strong>${meta.bestScore.toFixed(1)}/10</strong></div>
            <div class="kpi"><span>Challenges completed</span><strong>${meta.games}</strong></div>
          </div>
        </section>

        <section class="section panel">
          <div class="section-head">
            <div>
              <p class="eyebrow">CHOOSE A TACTICAL BRIEF</p>
              <h2>Three ways to build</h2>
            </div>
          </div>
          <div class="options">
            ${SCENARIOS.map((sc) => `
              <button class="player-card" data-scenario="${sc.id}">
                <div class="player-top">
                  <div>
                    <div class="player-name">${escapeHtml(sc.name)}</div>
                    <div class="player-style">${escapeHtml(sc.brief)}</div>
                  </div>
                  <span class="player-cost">${sc.budget} cr</span>
                </div>
                <div>${sc.preferred.map((style) => `<span class="player-tag">${escapeHtml(style)}</span>`).join("")}</div>
              </button>`).join("")}
          </div>
        </section>
        <p class="disclaimer">Player attributes and credit values are original game ratings for entertainment, not official data or market valuations.</p>
      </main>`;
  }

  function renderPitch() {
    const open = currentOpen();
    return `
      <div class="pitch">
        ${SLOT_ROWS.map((row, index) => `
          <div class="pitch-row ${["front", "mid", "def", "gk"][index]}">
            ${row.map((slot) => {
              const id = lineupPlayerId(slot);
              const p = id ? player(id) : null;
              const isOpen = scenario().open.some((item) => item.slot === slot);
              const isActive = open?.slot === slot;
              return `
                <div class="slot ${isOpen && !p ? "open" : ""} ${isActive ? "active" : ""}">
                  <span class="position">${slot}</span>
                  <strong>${p ? escapeHtml(p.name) : isActive ? "Choose now" : "Vacant"}</strong>
                  <small>${p ? `${p.cost} cr${scenario().fixed[slot] ? " · LOCKED" : ""}` : "3 options"}</small>
                </div>`;
            }).join("")}
          </div>`).join("")}
      </div>`;
  }

  function topStats(p) {
    const values = [
      ["PAC", p.pace], ["PAS", p.passing], ["DEF", p.defending],
      ["PHY", p.physical], ["ATK", p.attack], ["CTL", p.control],
    ];
    return values.sort((a, b) => b[1] - a[1]).slice(0, 3);
  }

  function renderPlayerOption(id, slot) {
    const p = player(id);
    const fit = Math.round(suitability(p, slot, scenario()));
    const remainingAfter = scenario().budget - (game.spent + p.cost);
    return `
      <button class="player-card" data-player="${id}">
        <div class="player-top">
          <div>
            <div class="player-name">${escapeHtml(p.name)}</div>
            <div class="player-style">${escapeHtml(p.styles.join(" · "))}</div>
          </div>
          <span class="player-cost">${p.cost} cr</span>
        </div>
        <div class="player-stats">
          ${topStats(p).map(([label, value]) => `<div class="player-stat"><span>${label}</span><strong>${value}</strong></div>`).join("")}
          <div class="player-stat"><span>TACTICAL FIT</span><strong>${fit}</strong></div>
          <div class="player-stat"><span>AFTER PICK</span><strong>${remainingAfter} cr</strong></div>
        </div>
      </button>`;
  }

  function renderChallenge() {
    const sc = scenario();
    const open = currentOpen();
    const remaining = sc.budget - game.spent;
    const progress = (game.step / sc.open.length) * 100;

    app.innerHTML = `
      <main class="shell">
        ${topbar(sc.name, `${game.step + 1}/${sc.open.length}`)}
        <div class="dashboard">
          <section class="pitch-wrap panel">${renderPitch()}</section>
          <aside class="side">
            <section class="brief panel">
              <p class="eyebrow">THE BRIEF</p>
              <h2>${escapeHtml(sc.name)}</h2>
              <p>${escapeHtml(sc.brief)}</p>
              <div class="kpis">
                <div class="kpi"><span>Budget remaining</span><strong style="color:${remaining < 0 ? "var(--red)" : "inherit"}">${remaining} cr</strong></div>
                <div class="kpi"><span>Positions filled</span><strong>${game.step}/5</strong></div>
              </div>
              <div class="progress" style="margin-top:14px"><i style="width:${progress}%"></i></div>
            </section>

            <section class="selector panel">
              <p class="eyebrow">RECRUITMENT DECISION</p>
              <h2>Choose your ${open.slot}</h2>
              <p style="color:var(--muted)">All three are strong players. Pick the one that best suits the brief and your remaining credits.</p>
              <div class="options">${open.options.map((id) => renderPlayerOption(id, open.slot)).join("")}</div>
            </section>
          </aside>
        </div>
        <p class="disclaimer">Ratings are bespoke JCFC game data. No official endorsement is implied.</p>
      </main>`;
  }

  function evaluate() {
    const sc = scenario();
    const reviews = [];
    let decisionTotal = 0;
    let tacticalTotal = 0;

    for (const open of sc.open) {
      const chosenId = game.selections[open.slot];
      const chosen = player(chosenId);
      const ranked = open.options
        .map((id) => ({ id, p: player(id), fit: suitability(player(id), open.slot, sc), metric: decisionMetric(player(id), open.slot, sc) }))
        .sort((a, b) => b.metric - a.metric);
      const selected = ranked.find((entry) => entry.id === chosenId);
      const best = ranked[0];
      const rank = ranked.findIndex((entry) => entry.id === chosenId) + 1;
      decisionTotal += selected.metric / best.metric;
      tacticalTotal += selected.fit / 100;

      const matched = chosen.styles.filter((style) => sc.preferred.includes(style));
      const verdict = rank === 1 ? "Best choice" : rank === 2 ? "Good alternative" : "Risky choice";
      const explanation = rank === 1
        ? `${chosen.name} was the strongest overall option in this challenge model. ${matched.length ? `The ${matched.join(" and ")} traits matched the brief particularly well.` : "The attribute profile fitted the role without creating a major weakness."}`
        : `${chosen.name} produced a tactical-fit rating of ${Math.round(selected.fit)}. ${best.p.name} ranked higher for this brief, mainly through a stronger mix of ${best.p.styles.filter((style) => sc.preferred.includes(style)).slice(0, 2).join(" and ") || "role fit and value"}.`;

      reviews.push({ slot: open.slot, chosen, best: best.p, verdict, rank, fit: Math.round(selected.fit), explanation });
    }

    const ids = Object.keys(sc.fixed).map((slot) => sc.fixed[slot]).concat(Object.values(game.selections));
    const squad = ids.map(player);
    const attributeAverages = {};
    for (const attribute of Object.keys(sc.targets)) {
      attributeAverages[attribute] = squad.reduce((sum, p) => sum + p[attribute], 0) / squad.length;
    }

    const balance = Object.entries(sc.targets)
      .reduce((sum, [attribute, target]) => sum + Math.min(1, attributeAverages[attribute] / target), 0) / Object.keys(sc.targets).length;

    const spendRatio = game.spent / sc.budget;
    const budget = spendRatio <= 1
      ? Math.max(0.70, 1 - Math.abs(0.95 - spendRatio) * 0.75)
      : Math.max(0.20, 1 - (spendRatio - 1) * 2.7);

    const decision = decisionTotal / sc.open.length;
    const tactical = tacticalTotal / sc.open.length;
    const score = Math.max(1, Math.min(10, 10 * (decision * 0.42 + tactical * 0.31 + balance * 0.17 + budget * 0.10)));

    return {
      score,
      reviews,
      components: {
        "Decision quality": decision * 10,
        "Tactical fit": tactical * 10,
        "Squad balance": balance * 10,
        "Budget management": budget * 10,
      },
      spent: game.spent,
      budget: sc.budget,
    };
  }

  function grade(score) {
    if (score >= 9.5) return ["Elite recruitment", "You understood the brief, controlled the budget and found almost every optimal choice."];
    if (score >= 8.6) return ["Top-class build", "A high-level squad with only small areas where another option could have improved the fit."];
    if (score >= 7.6) return ["Strong squad", "The plan is clear and the team should compete, although a couple of decisions left value on the table."];
    if (score >= 6.5) return ["Solid but imperfect", "There is a workable team here, but the recruitment did not fully match the tactical identity."];
    if (score >= 5.0) return ["Questionable window", "Big names may be present, but the balance, value or tactical logic needs work."];
    return ["Board meeting incoming", "The squad and the brief are pulling in different directions. Time to reload the shortlist."];
  }

  function componentBars(result) {
    return Object.entries(result.components).map(([name, value]) => `
      <div class="component">
        <div class="component-head"><span>${escapeHtml(name)}</span><strong>${value.toFixed(1)}/10</strong></div>
        <div class="progress"><i style="width:${value * 10}%"></i></div>
      </div>`).join("");
  }

  function renderResults() {
    const result = game.result;
    const [title, description] = grade(result.score);

    app.innerHTML = `
      <main class="shell">
        ${topbar(scenario().name, "Complete")}
        <div class="results-grid">
          <section class="score-card panel">
            <p class="eyebrow">MANAGER RATING</p>
            <div class="score">${result.score.toFixed(1)}<span>/10</span></div>
            <h2>${escapeHtml(title)}</h2>
            <p>${escapeHtml(description)}</p>
            <span class="badge ${result.score >= 8.5 ? "good" : result.score >= 6.5 ? "warn" : "bad"}">${result.spent} / ${result.budget} credits spent</span>
            <div class="component-list">${componentBars(result)}</div>
            <div class="actions" style="justify-content:center;margin-top:24px">
              <button class="btn primary" data-action="random">New random challenge</button>
              <button class="btn" data-action="home">Main menu</button>
            </div>
          </section>

          <section class="section panel" style="margin-top:0">
            <div class="section-head">
              <div>
                <p class="eyebrow">DECISION REVIEW</p>
                <h2>How every pick scored</h2>
              </div>
            </div>
            <div class="review-list">
              ${result.reviews.map((review) => `
                <article class="review">
                  <div class="review-head">
                    <div>
                      <p class="eyebrow">${review.slot}</p>
                      <h3>${escapeHtml(review.chosen.name)}</h3>
                    </div>
                    <span class="badge ${review.rank === 1 ? "good" : review.rank === 2 ? "warn" : "bad"}">${review.verdict}</span>
                  </div>
                  <p>${escapeHtml(review.explanation)}</p>
                  <div style="margin-top:10px">
                    <span class="score-chip">Fit ${review.fit}/100</span>
                    ${review.rank !== 1 ? `<span class="score-chip">Best: ${escapeHtml(review.best.name)}</span>` : ""}
                  </div>
                </article>`).join("")}
            </div>
          </section>
        </div>
        <p class="disclaimer">This is an original fan-made decision game. Ratings are fictional and subjective.</p>
      </main>`;
  }

  function startScenario(id) {
    const sc = SCENARIOS.find((item) => item.id === id);
    if (!sc) return;
    game = { scenarioId: id, step: 0, spent: 0, selections: {}, complete: false, result: null };
    save();
    renderChallenge();
  }

  function randomScenario() {
    const choices = game?.scenarioId ? SCENARIOS.filter((item) => item.id !== game.scenarioId) : SCENARIOS;
    startScenario(choices[Math.floor(Math.random() * choices.length)].id);
  }

  function choosePlayer(id) {
    const open = currentOpen();
    if (!open || !open.options.includes(id)) return;
    const chosen = player(id);
    game.selections[open.slot] = id;
    game.spent += chosen.cost;
    game.step += 1;

    if (game.step >= scenario().open.length) {
      game.complete = true;
      game.result = evaluate();
      meta.games += 1;
      meta.bestScore = Math.max(meta.bestScore, game.result.score);
      if (game.result.score >= 9.95) meta.perfect += 1;
      save();
      renderResults();
      return;
    }

    save();
    renderChallenge();
  }

  function goHome() {
    renderHome();
  }

  app.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.scenario) {
      startScenario(button.dataset.scenario);
      return;
    }

    if (button.dataset.player) {
      choosePlayer(button.dataset.player);
      return;
    }

    switch (button.dataset.action) {
      case "random":
        randomScenario();
        break;
      case "continue":
        game?.complete ? renderResults() : renderChallenge();
        break;
      case "home":
        goHome();
        break;
      default:
        break;
    }
  });

  if (game?.complete && game.result) renderResults();
  else renderHome();
})();
