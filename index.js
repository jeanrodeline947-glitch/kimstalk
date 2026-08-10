const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   KIMSTALK - SCRAPER
========================= */

async function stalkPlayer(playerTag) {
  const tag = playerTag
    .trim()
    .toUpperCase()
    .replace(/^#/, "");

  if (!/^[A-Z0-9]+$/.test(tag)) {
    throw new Error("Player Tag invalide.");
  }

  const url = `https://brawltime.ninja/profile/${tag}`;

  const response = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36"
    },
    timeout: 15000
  });

  const $ = cheerio.load(response.data);

  const title = $("title").text().trim();

  const description =
    $('meta[name="description"]').attr("content")?.trim() || "";

  const image =
    $('meta[property="og:image"]').attr("content")?.trim() || "";

  return {
    tag: `#${tag}`,
    title: title || "Brawl Stars Player",
    description,
    image,
    url
  };
}

/* =========================
   WEB PAGE
========================= */

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>KimStalk - Brawl Stars</title>

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: Arial, sans-serif;
      min-height: 100vh;
      background:
        radial-gradient(circle at top, #263a70 0%, #10162d 45%, #080b18 100%);
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }

    .container {
      width: 100%;
      max-width: 520px;
      text-align: center;
    }

    .logo {
      font-size: 48px;
      font-weight: 900;
      margin-bottom: 8px;
      letter-spacing: -2px;
    }

    .logo span {
      color: #ffd43b;
    }

    .subtitle {
      color: #b9c1d9;
      margin-bottom: 30px;
      font-size: 16px;
    }

    .card {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      backdrop-filter: blur(15px);
      border-radius: 24px;
      padding: 25px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.35);
    }

    label {
      display: block;
      text-align: left;
      margin-bottom: 10px;
      color: #dfe5ff;
      font-weight: bold;
    }

    .input {
      width: 100%;
      padding: 16px;
      border: none;
      outline: none;
      border-radius: 14px;
      background: rgba(0,0,0,0.3);
      color: white;
      font-size: 17px;
      margin-bottom: 15px;
    }

    .input::placeholder {
      color: #8992ad;
    }

    button {
      width: 100%;
      padding: 16px;
      border: none;
      border-radius: 14px;
      background: #ffd43b;
      color: #111;
      font-size: 17px;
      font-weight: 900;
      cursor: pointer;
    }

    button:hover {
      opacity: 0.9;
    }

    .result {
      display: none;
      margin-top: 20px;
      text-align: left;
      background: rgba(0,0,0,0.25);
      border-radius: 18px;
      padding: 20px;
    }

    .profile {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      object-fit: cover;
      display: block;
      margin: 0 auto 15px;
    }

    .name {
      text-align: center;
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .tag {
      text-align: center;
      color: #ffd43b;
      margin-bottom: 20px;
    }

    .info {
      padding: 12px 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .error {
      display: none;
      margin-top: 15px;
      color: #ff8d8d;
      background: rgba(255,0,0,0.1);
      padding: 12px;
      border-radius: 12px;
    }

    .footer {
      margin-top: 20px;
      color: #707994;
      font-size: 13px;
    }
  </style>
</head>

<body>

  <div class="container">

    <div class="logo">
      KIM<span>STALK</span> 🔎
    </div>

    <div class="subtitle">
      Brawl Stars Player Tracker
    </div>

    <div class="card">

      <label>Player Tag</label>

      <input
        id="tag"
        class="input"
        type="text"
        placeholder="#ABC123"
        autocomplete="off"
      />

      <button onclick="searchPlayer()">
        🔎 SEARCH PLAYER
      </button>

      <div id="error" class="error"></div>

      <div id="result" class="result">

        <img id="image" class="profile" style="display:none;">

        <div id="name" class="name"></div>

        <div id="playerTag" class="tag"></div>

        <div class="info">
          📝 <strong>Info:</strong>
          <span id="description">-</span>
        </div>

        <div class="info">
          🔗 <strong>Profile:</strong>
          <a id="profileUrl"
             href="#"
             target="_blank"
             style="color:#ffd43b;">
             Open
          </a>
        </div>

      </div>

    </div>

    <div class="footer">
      © 2026 KimStalk • Brawl Stars Player Tracker
    </div>

  </div>

<script>

async function searchPlayer() {

  const input = document.getElementById("tag");
  const tag = input.value.trim();

  const result = document.getElementById("result");
  const error = document.getElementById("error");

  result.style.display = "none";
  error.style.display = "none";

  if (!tag) {
    error.textContent = "❌ Entre yon Player Tag.";
    error.style.display = "block";
    return;
  }

  const button = document.querySelector("button");

  button.disabled = true;
  button.textContent = "⏳ SEARCHING...";

  try {

    const response = await fetch(
      "/api/player?tag=" + encodeURIComponent(tag)
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Profil introuvable.");
    }

    document.getElementById("name").textContent =
      data.title;

    document.getElementById("playerTag").textContent =
      data.tag;

    document.getElementById("description").textContent =
      data.description || "Aucune information disponible.";

    document.getElementById("profileUrl").href =
      data.url;

    if (data.image) {
      const image = document.getElementById("image");
      image.src = data.image;
      image.style.display = "block";
    }

    result.style.display = "block";

  } catch (err) {

    error.textContent = "❌ " + err.message;
    error.style.display = "block";

  } finally {

    button.disabled = false;
    button.textContent = "🔎 SEARCH PLAYER";

  }
}

</script>

</body>
</html>
  `);
});


/* =========================
   API
========================= */

app.get("/api/player", async (req, res) => {

  try {

    const tag = req.query.tag;

    if (!tag) {
      return res.status(400).json({
        error: "Player Tag obligatwa."
      });
    }

    const player = await stalkPlayer(tag);

    res.json(player);

  } catch (error) {

    console.error(error.message);

    res.status(500).json({
      error:
        "KimStalk pa kapab jwenn profil sa a. Verifye Player Tag la epi eseye ankò."
    });

  }

});


/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log("");
  console.log("╔════════════════════════════╗");
  console.log("║        KIMSTALK 🔎         ║");
  console.log("╚════════════════════════════╝");
  console.log("");
  console.log(`🚀 Server running on port ${PORT}`);
});
