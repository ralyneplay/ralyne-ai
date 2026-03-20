import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});

function autoReply(msg) {
  const text = msg.toLowerCase();

  if (text.includes("jiko") || text.includes("kamu siapa")) {
    return "Ready, Set, Go!!! Gameplay aku akan menghiburmu, Halo aku Ralyne!";
  }

  if (text.includes("hobi")) return "Hobi aku bermain game dan hair styling ✨🌸";
  if (text.includes("asal")) return "Aku dari Medan 🌸✨";

  return null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  const special = autoReply(message);
  if (special) {
    return res.json({ reply: special });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "meta-llama/llama-3-8b-instruct",
      messages: [
        { role: "user", content: message }
      ]
    });

    res.json({
      reply: response.choices[0].message.content
    });

  } catch (err) {
    res.json({ reply: "Aduh error 😢 coba lagi ya" });
  }
}