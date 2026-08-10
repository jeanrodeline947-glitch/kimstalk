const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

const BRAWL_API = "https://api.brawlstars.com/v1";

/* =========================================
   BRAWL STARS OFFICIAL API
========================================= */

async function getPlayer(playerTag) {
  const tag = playerTag
    .trim()
    .toUpperCase()
    .replace(/^#/, "");

  if (!/^[A-Z0-9]+$/.test(tag)) {
    throw new Error("Player Tag invalide.");
  }

  const encodedTag = encodeURIComponent(`#${tag}`);

  const response = await axios.get(
    `${BRAWL_API}/players/${encodedTag}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.BRAWL_STARS_API_KEY}`,
        Accept: "application/json"
      },
      timeout: 15000
    }
  );

  return response.data;
}

/* =========================================
   GET CLUB
========================================= */

async function getClub(clubTag) {
  if (!clubTag) return null;

  try {
    const encodedClubTag = encodeURIComponent(clubTag);

    const response = await axios.get(
      `${BRAWL_API}/clubs/${encodedClubTag}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BRAWL_STARS_API_KEY}`,
          Accept: "application/json"
        },
        timeout: 15000
      }
    );

    return response.data;
  } catch {
    return null;
  }
}

/* =========================================
   HOME PAGE
========================================= */

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
  color: white;
  background:
    radial-gradient(circle at top, #263b76 0%, #10162d 45%, #070a16 100%);
  padding: 30px 15px;
}

.container {
  width: 100%;
  max-width: 900px;
  margin: auto;
}

.header {
  text-align: center;
  margin: 35px 0;
}

.logo {
  font-size: 52px;
  font-weight: 900;
  letter-spacing: -3px;
}

.logo .yellow {
  color: #ffd43b;
}

.subtitle {
  color: #aeb8d6;
  margin-top: 8px;
}

.search-card {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 24px;
  padding: 25px;
  backdrop-filter: blur(15px);
  box-shadow: 0 20px 60px rgba(0,0,0,.35);
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}

.input {
  width: 100%;
  padding: 17px;
  border: 0;
  outline: none;
  border-radius: 14px;
  background: rgba(0,0,0,.3);
  color: white;
  font-size: 18px;
}

.input::placeholder {
  color: #7e87a5;
}

.search-button {
  width: 100%;
  margin-top: 15px;
  padding: 17px;
  border: 0;
  border-radius: 14px;
  background: #ffd43b;
  color: #111;
  font-size: 17px;
  font-weight: 900;
  cursor: pointer;
}

.search-button:disabled {
  opacity: .6;
}

.error {
  display: none;
  margin-top: 15px;
  padding: 14px;
  border-radius: 12px;
  background: rgba(255,50,50,.15);
  color: #ff9b9b;
  text-align: center;
}

.profile {
  display: none;
  margin-top: 25px;
}

.player-header {
  text-align: center;
  padding: 25px;
  background: rgba(255,255,255,.07);
  border-radius: 22px;
}

.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: #ffd43b;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  font-size: 42px;
}

.player-name {
  margin-top: 15px;
  font-size: 27px;
  font-weight: 900;
}

.player-tag {
  color: #ffd43b;
  margin-top: 5px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 15px;
}

.stat {
  background: rgba(255,255,255,.07);
  border-radius: 17px;
  padding: 18px;
}

.stat-title {
  color: #8e99b8;
  font-size: 13px;
}

.stat-value {
  font-size: 22px;
  font-weight: 900;
  margin-top: 5px;
}

.club {
  margin-top: 15px;
  background: rgba(255,255,255,.07);
  border-radius: 17px;
  padding: 18px;
}

.brawlers {
  margin-top: 15px;
  background: rgba(255,255,255,.07);
  border-radius: 20px;
  padding: 20px;
}

.brawlers h2 {
  margin-bottom: 15px;
}

.brawler {
  display: flex;
  justify-content: space-between;
  padding: 13px 0;
  border-bottom: 1px solid rgba(255,255,255,.08);
}

.brawler:last-child {
  border-bottom: 0;
}

.footer {
  text-align: center;
  color: #66708e;
  margin: 30px 0 10px;
  font-size: 13px;
}

@media(max-width:600px) {

  .logo {
    font-size: 42px;
  }

  .stats {
    grid-template-columns: 1fr 1fr;
  }

  .stat-value {
    font-size: 18px;
  }

}

</style>
</head>

<body>

<div class="container">

  <div class="header">
    <div class="logo">
      KIM<span class="yellow">STALK</span> 🔎
    </div>

    <div class="subtitle">
      Brawl Stars Player Tracker
    </div>
  </div>

  <div class="search-card">

    <label>Player Tag</label>

    <input
      id="tag"
      class="input"
      placeholder="#ABC123"
      autocomplete="off"
    >

    <button
      id="searchButton"
      class="search-button"
      onclick="searchPlayer()"
    >
      🔎 SEARCH PLAYER
    </button>

    <div id="error" class="error"></div>

  </div>

  <div id="profile" class="profile">

    <div class="player-header">

      <div class="avatar">
        ⭐
      </div>

      <div id="name" class="player-name">
        -
      </div>

      <div id="playerTag" class="player-tag">
        -
      </div>

    </div>

    <div class="stats">

      <div class="stat">
        <div class="stat-title">🏆 Trophies</div>
        <div id="trophies" class="stat-value">-</div>
      </div>

      <div class="stat">
        <div class="stat-title">🏆 Highest Trophies</div>
        <div id="highestTrophies" class="stat-value">-</div>
      </div>

      <div class="stat">
        <div class="stat-title">⭐ EXP Level</div>
        <div id="expLevel" class="stat-value">-</div>
      </div>

      <div class="stat">
        <div class="stat-title">⚔️ 3v3 Victories</div>
        <div id="threeVsThree" class="stat-value">-</div>
      </div>

      <div class="stat">
        <div class="stat-title">🎯 Solo Victories</div>
        <div id="solo" class="stat-value">-</div>
      </div>

      <div class="stat">
        <div class="stat-title">👥 Duo Victories</div>
        <div id="duo" class="stat-value">-</div>
      </div>

    </div>

    <div id="club" class="club">
      🏠 Club: -
    </div>

    <div class="brawlers">

      <h2>⚡ Brawlers</h2>

      <div id="brawlersList">
        -
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
  const button = document.getElementById("searchButton");
  const error = document.getElementById("error");
  const profile = document.getElementById("profile");

  const tag = input.value.trim();

  error.style.display = "none";
  profile.style.display = "none";

  if (!tag) {

    error.textContent = "❌ Antre yon Player Tag.";
    error.style.display = "block";

    return;
  }

  button.disabled = true;
  button.textContent = "⏳ SEARCHING...";

  try {

    const response = await fetch(
      "/api/player?tag=" +
      encodeURIComponent(tag)
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Player pa jwenn."
      );
    }

    document.getElementById("name").textContent =
      data.name || "-";

    document.getElementById("playerTag").textContent =
      data.tag || "-";

    document.getElementById("trophies").textContent =
      Number(data.trophies || 0).toLocaleString();

    document.getElementById("highestTrophies").textContent =
      Number(data.highestTrophies || 0).toLocaleString();

    document.getElementById("expLevel").textContent =
      data.expLevel ?? "-";

    document.getElementById("threeVsThree").textContent =
      Number(data["3vs3Victories"] || 0).toLocaleString();

    document.getElementById("solo").textContent =
      Number(data.soloVictories || 0).toLocaleString();

    document.getElementById("duo").textContent =
      Number(data.duoVictories || 0).toLocaleString();

    if (data.club) {

      document.getElementById("club").textContent =
        "🏠 Club: " +
        data.club.name +
        " " +
        data.club.tag;

    } else {

      document.getElementById("club").textContent =
        "🏠 Club: No Club";

    }

    const list =
      document.getElementById("brawlersList");

    list.innerHTML = "";

    if (
      Array.isArray(data.brawlers) &&
      data.brawlers.length > 0
    ) {

      const sorted =
        [...data.brawlers]
        .sort(
          (a,b) =>
            (b.trophies || 0) -
            (a.trophies || 0)
        )
        .slice(0, 20);

      sorted.forEach(brawler => {

        const item =
          document.createElement("div");

        item.className = "brawler";

        item.innerHTML = `
          <span>
            ⚡ ${escapeHtml(brawler.name || "Unknown")}
          </span>

          <strong>
            🏆 ${Number(
              brawler.trophies || 0
            ).toLocaleString()}
          </strong>
        `;

        list.appendChild(item);

      });

    } else {

      list.textContent =
        "Pa gen done brawler disponib.";

    }

    profile.style.display = "block";

  } catch (err) {

    error.textContent =
      "❌ " + err.message;

    error.style.display = "block";

  } finally {

    button.disabled = false;
    button.textContent =
      "🔎 SEARCH PLAYER";

  }

}

function escapeHtml(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}

document
  .getElementById("tag")
  .addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
      searchPlayer();
    }

  });

</script>

</body>
</html>
  `);
});

/* =========================================
   PLAYER API
========================================= */

app.get("/api/player", async (req, res) => {

  try {

    if (!process.env.BRAWL_STARS_API_KEY) {

      return res.status(500).json({
        error:
          "Brawl Stars API Key pa configure sou server la."
      });

    }

    const tag = req.query.tag;

    if (!tag) {

      return res.status(400).json({
        error: "Player Tag obligatwa."
      });

    }

    const player = await getPlayer(tag);

    res.json(player);

  } catch (error) {

    console.error(
      "Brawl Stars API Error:",
      error.response?.data || error.message
    );

    const status =
      error.response?.status || 500;

    if (status === 403) {

      return res.status(403).json({
        error:
          "API Key la pa aksepte. Verifye API Key la ak IP whitelist Render la."
      });

    }

    if (status === 404) {

      return res.status(404).json({
        error:
          "Player Tag sa a pa jwenn."
      });

    }

    res.status(500).json({
      error:
        "Server la pa kapab jwenn done Brawl Stars yo kounye a."
    });

  }

});

/* =========================================
   START
========================================= */

app.listen(PORT, () => {

  console.log("");
  console.log("╔════════════════════════════╗");
  console.log("║        KIMSTALK 🔎         ║");
  console.log("╚════════════════════════════╝");
  console.log("");
  console.log(
    `🚀 Server running on port ${PORT}`
  );

});
