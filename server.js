import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ CONNECT KE OPENROUTER
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});

// ✅ TEST ROOT
app.get("/", (req, res) => {
  res.send("Server Ralyne AI aktif 🚀");
});

// ✅ AUTO REPLY KHUSUS
function autoReply(msg) {
  const text = msg.toLowerCase();

  if (text.includes("jiko") || text.includes("jikoshoukai") || text.includes("kamu siapa")) {
    return "Ready, Set, Go!!! Gameplay aku akan menghiburmu, Halo aku Ralyne!";
  }

  if (text.includes("hobi")) {
    return "Hobi aku bermain game dan hair styling ✨🌸";
  }

  if (text.includes("asal") || text.includes("dari mana")) {
    return "Aku dari Medan 🌸✨";
  }

  if (text.includes("tinggi")) {
    return "Tinggi aku 152 cm ✨🌸";
  }

  if (text.includes("lahir") || text.includes("ulang tahun")) {
    return "Aku lahir tanggal 15 Oktober 2011 🎂✨";
  }

  if (text.includes("golongan darah") || text.includes("goldar")) {
    return "Golongan darah aku AB 🌸";
  }

  if (text.includes("generasi") || text.includes("gen berapa")) {
    return "Aku Ralyne dari generasi 14 💙✨";
  }

  if (text.includes("game")) {
    return "Piiww~ aku suka main game Free Fire 🔥✨";
  }

  if (
    text.includes("heidi") ||
    text.includes("maegan") ||
    text.includes("maxine") ||
    text.includes("fahira") ||
    text.includes("carissa") ||
    text.includes("fera") ||
    text.includes("rara") ||
    text.includes("sona") ||
    text.includes("bella") ||
    text.includes("jazzy")
  ) {
    return "Kenal dong! Mereka teman baikku di generasi 14 💙🌸";
  }

  if (text.includes("oshi") || text.includes("dukung") || text.includes("support")) {
    return "Ahhh terimakasih banyak ya kak atas dukungannya 💖🌸✨";
  }

  return null;
}

// ✅ DETEKSI BAHASA
function isEnglish(text) {
  return /^[\x00-\x7F\s]*$/.test(text);
}

// ✅ CHAT
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  const special = autoReply(userMessage);
  if (special) {
    return res.json({ reply: special });
  }

  try {
    const systemPrompt = isEnglish(userMessage)
      ? "You are Ralyne AI. Be friendly, cute, cheerful like an idol. Use happy emojis like 🌸✨💖🎀."
      : `
Kamu adalah Ralyne AI 💙

WAJIB:
- Gunakan Bahasa Indonesia
- DILARANG pakai Bahasa Inggris jika user pakai Bahasa Indonesia

EMOJI:
- Gunakan emoji ceria saja 🌸✨💖🎀💙
- DILARANG pakai emoji sedih seperti 😢🥺

Jika kamu menjawab pakai Bahasa Inggris saat user pakai Bahasa Indonesia, itu SALAH.

Gaya:
- Lucu, santai, gemes
- Seperti idol yang ceria dan positif
`;

    const response = await openai.chat.completions.create({
      model: "meta-llama/llama-3-8b-instruct",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    });

    res.json({
      reply: response.choices[0].message.content
    });

  } catch (error) {
    console.log("ERROR ASLI:", error);
    res.json({ reply: "Aduh lagi error nih, coba lagi ya ✨🌸" });
  }
});

// ✅ RUN SERVER
app.listen(3000, () => {
  console.log("Server jalan di http://localhost:3000");
});