const axios = require("axios");
const cheerio = require("cheerio");

/**
 * KIMSTALK
 * Brawl Stars Player Profile Scraper
 */

async function stalkPlayer(playerTag) {
  try {
    if (!playerTag) {
      throw new Error("Tanpri bay yon Player Tag.");
    }

    // Netwaye Player Tag la
    const tag = playerTag
      .trim()
      .toUpperCase()
      .replace(/^#/, "");

    if (!/^[A-Z0-9]+$/.test(tag)) {
      throw new Error("Player Tag la pa valid.");
    }

    const url = `https://brawltime.ninja/profile/${tag}`;

    console.log("🔎 KIMSTALK");
    console.log("━━━━━━━━━━━━━━━━━━━━");
    console.log(`🔍 Recherche: #${tag}`);
    console.log("⏳ Tanpri tann...");

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36",
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
      timeout: 15000
    });

    const $ = cheerio.load(response.data);

    const title = $("title").text().trim();

    // Eseye jwenn description paj la
    const description =
      $('meta[name="description"]').attr("content")?.trim() || "";

    // Eseye jwenn Open Graph title
    const ogTitle =
      $('meta[property="og:title"]').attr("content")?.trim() || "";

    // Eseye jwenn Open Graph image
    const ogImage =
      $('meta[property="og:image"]').attr("content")?.trim() || "";

    const result = {
      success: true,
      tag: `#${tag}`,
      name: ogTitle || title || "Profil Brawl Stars",
      description,
      image: ogImage,
      url
    };

    console.log("\n╔════════════════════════════╗");
    console.log("║        KIMSTALK 🔎         ║");
    console.log("╚════════════════════════════╝");

    console.log(`👤 Jouè: ${result.name}`);
    console.log(`🏷️ Tag: ${result.tag}`);

    if (result.description) {
      console.log(`📝 Info: ${result.description}`);
    }

    if (result.image) {
      console.log(`🖼️ Image: ${result.image}`);
    }

    console.log(`🔗 Profil: ${result.url}`);
    console.log("━━━━━━━━━━━━━━━━━━━━");

    return result;

  } catch (error) {
    console.log("\n❌ KIMSTALK pa kapab jwenn profil la.");

    if (error.response) {
      console.log(`HTTP Error: ${error.response.status}`);
    } else {
      console.log(`Erreur: ${error.message}`);
    }

    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Si ou lanse:
 *
 * node index.js #PLAYER_TAG
 *
 * li ap itilize tag ou bay la.
 */

const playerTag = process.argv[2];

if (!playerTag) {
  console.log("╔════════════════════════════╗");
  console.log("║        KIMSTALK 🔎         ║");
  console.log("╚════════════════════════════╝");
  console.log("");
  console.log("Usage:");
  console.log("node index.js #PLAYER_TAG");
  console.log("");
  console.log("Egzanp:");
  console.log("node index.js #ABC123");
  process.exit(0);
}

stalkPlayer(playerTag);
