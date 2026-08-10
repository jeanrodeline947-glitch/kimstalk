const axios = require("axios");
const cheerio = require("cheerio");

async function stalkPlayer(playerTag) {
  try {
    // Nettoyage du tag
    const tag = playerTag
      .trim()
      .toUpperCase()
      .replace(/^#/, "");

    if (!tag) {
      throw new Error("Tag Brawl Stars invalide.");
    }

    const url = `https://brawltime.ninja/profile/${tag}`;

    console.log(`🔎 Recherche du joueur #${tag}...`);

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Android 13; Mobile) AppleWebKit/537.36 Chrome/120 Safari/537.36"
      },
      timeout: 15000
    });

    const $ = cheerio.load(response.data);

    const title = $("title").text().trim();

    console.log("\n╔════════════════════════════╗");
    console.log("║        KIMSTALK 🔎         ║");
    console.log("╚════════════════════════════╝");

    console.log(`🏷️ Tag: #${tag}`);
    console.log(`📄 Page: ${title || "Profil trouvé"}`);
    console.log(`🔗 URL: ${url}`);

    return {
      tag: `#${tag}`,
      title,
      url
    };

  } catch (error) {
    console.error("❌ Impossible de récupérer le profil.");

    if (error.response) {
      console.error(`HTTP: ${error.response.status}`);
    } else {
      console.error(error.message);
    }

    return null;
  }
}

// Exemple
stalkPlayer("#ABC123");
