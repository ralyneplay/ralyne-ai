import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});

function autoReply(msg) {
  const text = msg.toLowerCase();

  if (text.includes("kamu siapa")) {
    return "Ready, Set, Go!!! Halo aku Ralyne 💙✨";
  }

  if (text.includes("hobi")) return "Hobi aku main game ✨🌸";
  if (text.includes("asal")) return "Aku dari Medan 🌸✨";

  return null;
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  const { message } = JSON.parse(event.body);

  const special = autoReply(message);
  if (special) {
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: special })
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "meta-llama/llama-3-8b-instruct",
      messages: [
        { role: "user", content: message }
      ]
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: response.choices[0].message.content
      })
    };

  } catch (err) {
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: "Error 😢" })
    };
  }
}