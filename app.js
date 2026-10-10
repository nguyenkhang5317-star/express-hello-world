const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

const html = String.raw`<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#100b18">
  <meta name="description" content="AFTERDARK — a private, neon-styled space for stories and community.">
  <title>AFTERDARK — Explore the Night</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #100b18;
      --panel: #1b1227;
      --pink: #ff3e9d;
      --purple: #9b5cff;
      --text: #f8f3ff;
      --muted: #b4a6c4;
      --line: #ffffff18;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background:
        radial-gradient(ellipse at 15% 0%, #702b7540, transparent 42rem),
        radial-gradient(ellipse at 90% 30%, #4931a333, transparent 38rem),
        var(--bg);
      color: var(--text);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    button, input { font: inherit; }
    button { cursor: pointer; }
    button:focus-visible, input:focus-visible, a:focus-visible {
      outline: 2px solid var(--pink);
      outline-offset: 3px;
    }
    .topbar {
      position: sticky; top: 0; z-index: 5;
      display: flex; justify-content: space-between; align-items: center;
      gap: 16px; padding: 16px clamp(18px, 6vw, 80px);
      background: #100b18eF; border-bottom: 1px solid var(--line);
      backdrop-filter: blur(16px);
    }
    .logo { color: var(--text); font-size: 21px; font-weight: 900; letter-spacing: 2px; text-decoration: none; }
    .logo span { color: var(--pink); }
    .btn {
      border: 0; border-radius: 12px; padding: 12px 17px; color: white;
      background: linear-gradient(110deg, var(--pink), var(--purple));
      font-weight: 750; transition: transform .18s, filter .18s;
    }
    .btn:hover { transform: translateY(-1px); filter: brightness(1.1); }
    .btn.secondary { background: #ffffff12; border: 1px solid var(--line); }
    .hero { max-width: 1050px; margin: auto; padding: 88px 24px 48px; text-align: center; }
    .eyebrow { color: var(--pink); font-size: 11px; font-weight: 850; letter-spacing: 3px; text-transform: uppercase; }
    h1 { margin: 20px 0; font-size: clamp(42px, 8vw, 78px); letter-spacing: -2px; line-height: 1.02; }
    h1 span { color: var(--pink); text-shadow: 0 0 36px #ff3e9d55; }
    .intro { max-width: 620px; margin: 0 auto; color: var(--muted); line-height: 1.8; }
    .search { display: flex; gap: 10px; max-width: 560px; margin: 30px auto 0; }
    .search input {
      flex: 1; min-width: 0; padding: 14px 16px; border-radius: 12px;
      border: 1px solid var(--line); background: #1b1227cc; color: var(--text);
    }
    main { max-width: 1100px; padding: 18px 24px 70px; margin: auto; }
    .section-heading { display: flex; justify-content: space-between; align-items: center; gap: 14px; margin: 18px 0 22px; }
    .section-heading h2 { margin: 0; font-size: 24px; }
    .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
    .card {
      overflow: hidden; border: 1px solid var(--line); border-radius: 18px;
      background: linear-gradient(145deg, #241631, #171020);
      transition: transform .2s ease, border-color .2s ease;
    }
    .card:hover { transform: translateY(-4px); border-color: #ff3e9d80; }
    .art {
      min-height: 165px; display: grid; place-items: center; font-size: 48px;
      background: radial-gradient(circle at 25% 25%, #ff3e9d55, transparent 48%),
                  radial-gradient(circle at 80% 75%, #9b5cff66, transparent 48%), #21152f;
    }
    .card-body { padding: 19px; }
    .card h3 { margin: 0 0 8px; font-size: 19px; }
    .card p { min-height: 48px; margin: 0 0 18px; color: var(--muted); font-size: 14px; line-height: 1.7; }
    .card .btn { width: 100%; }
    .notice {
      margin-top: 30px; padding: 19px 20px; border: 1px solid var(--line);
      border-radius: 14px; color: var(--muted); font-size: 13px; line-height: 1.8;
      background: #ffffff05;
    }
    footer { padding: 24px; border-top: 1px solid var(--line); color: var(--muted); text-align: center; font-size: 12px; }
    .modal {
      position: fixed; inset: 0; z-index: 10; display: grid; place-items: center;
      padding: 20px; background: #08050df2; backdrop-filter: blur(10px);
    }
    .modal[hidden] { display: none; }
    .modal-box {
      width: min(430px, 100%); padding: 30px; text-align: center;
      border: 1px solid #ff3e9d66; border-radius: 22px; background: var(--panel);
      box-shadow: 0 0 70px #9b5cff22;
    }
    .modal-box h2 { margin: 15px 0 10px; }
    .modal-box p { color: var(--muted); line-height: 1.7; }
    .modal-actions { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin-top: 22px; }
    #ageMessage { min-height: 1.4em; font-size: 12px; }
    [hidden] { display: none !important; }
    @media (max-width: 720px) {
      .grid { grid-template-columns: 1fr; }
      .hero { padding-top: 58px; }
      .search { flex-direction: column; }
      .topbar { padding-inline: 18px; }
      .card p { min-height: auto; }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; }
    }
  </style>
</head>
<body>
  <header class="topbar">
    <a class="logo" href="#" aria-label="AFTERDARK home">AFTER<span>DARK</span></a>
    <button class="btn secondary" id="openAge" type="button">Age information</button>
  </header>

  <section class="hero">
    <div class="eyebrow">Your private digital space</div>
    <h1>Explore the <span>Night.</span></h1>
    <p class="intro">A neon-lit space for stories, community conversations, and creative people. Find a corner that matches your mood.</p>
    <form class="search" id="searchForm" role="search">
      <input id="searchInput" type="search" placeholder="Search categories..." aria-label="Search categories">
      <button class="btn" type="submit">Search</button>
    </form>
  </section>

  <main>
    <div class="section-heading">
      <h2>Explore spaces</h2>
      <span class="eyebrow">Featured</span>
    </div>
    <section class="grid" id="categories" aria-label="Categories">
      <article class="card" data-search="romance stories tình cảm truyện">
        <div class="art" aria-hidden="true">💜</div>
        <div class="card-body">
          <h3>Romance & Stories</h3>
          <p>Discover fictional stories, emotional journeys, and romantic plots.</p>
          <button class="btn" type="button" data-category="Romance & Stories">Explore space</button>
        </div>
      </article>
      <article class="card" data-search="community discussion cộng đồng trò chuyện">
        <div class="art" aria-hidden="true">🌌</div>
        <div class="card-body">
          <h3>Community</h3>
          <p>Find conversations, share ideas, and meet people with similar interests.</p>
          <button class="btn" type="button" data-category="Community">Explore space</button>
        </div>
      </article>
      <article class="card" data-search="creators art creative sáng tạo nghệ thuật">
        <div class="art" aria-hidden="true">✨</div>
        <div class="card-body">
          <h3>Creators</h3>
          <p>Showcase original projects, art, and creative work in one place.</p>
          <button class="btn" type="button" data-category="Creators">Explore space</button>
        </div>
      </article>
    </section>
    <aside class="notice">
      <strong>Privacy first.</strong> This is a front-end starter page. Category buttons are demo interactions; no account data is collected or sent. The age dialog is informational only and does not verify anyone’s age.
    </aside>
  </main>

  <footer>AFTERDARK · Privacy · Terms · Contact</footer>

  <div class="modal" id="ageModal" role="dialog" aria-modal="true" aria-labelledby="ageTitle">
    <div class="modal-box">
      <div class="eyebrow">Welcome</div>
      <h2 id="ageTitle">Before you continue</h2>
      <p>This site is a demo landing page for stories and community. Please use online services responsibly and follow the rules that apply to you.</p>
      <div class="modal-actions">
        <button class="btn" id="confirmAge" type="button">Continue</button>
        <button class="btn secondary" id="leave" type="button">Close</button>
      </div>
      <p id="ageMessage" role="status" aria-live="polite"></p>
    </div>
  </div>

  <script>
    const modal = document.getElementById("ageModal");
    const ageMessage = document.getElementById("ageMessage");
    const openAge = document.getElementById("openAge");
    const confirmAge = document.getElementById("confirmAge");
    const leave = document.getElementById("leave");

    openAge.addEventListener("click", () => {
      modal.hidden = false;
      confirmAge.focus();
    });

    confirmAge.addEventListener("click", () => {
      modal.hidden = true;
      ageMessage.textContent = "";
      openAge.focus();
    });

    leave.addEventListener("click", () => {
      modal.hidden = true;
      openAge.focus();
    });

    modal.addEventListener("click", event => {
      if (event.target === modal) {
        modal.hidden = true;
        openAge.focus();
      }
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !modal.hidden) {
        modal.hidden = true;
        openAge.focus();
      }
    });

    document.getElementById("searchForm").addEventListener("submit", event => {
      event.preventDefault();
      const query = document.getElementById("searchInput").value.trim().toLocaleLowerCase();
      let matches = 0;
      document.querySelectorAll(".card").forEach(card => {
        const text = (card.innerText + " " + card.dataset.search).toLocaleLowerCase();
        const visible = text.includes(query);
        card.hidden = !visible;
        if (visible) matches++;
      });
      if (matches === 0) {
        ageMessage.textContent = "No categories found. Try another search.";
      } else {
        ageMessage.textContent = "";
      }
    });

    document.querySelectorAll("[data-category]").forEach(button => {
      button.addEventListener("click", () => {
        const category = button.dataset.category;
        ageMessage.textContent = category + " is a demo category; connect a route to add a full page.";
        modal.hidden = false;
      });
    });
  </script>
</body>
</html>`;

app.get("/", (req, res) => {
  res.type("html").send(html);
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const server = app.listen(port, () => {
  console.log(`AFTERDARK listening on port ${port}`);
});

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
