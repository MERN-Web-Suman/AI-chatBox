import axios from "axios";

export async function runGemini(prompt) {
  try {
    const res = await axios.post("http://localhost:5000/api/ask", { prompt });
    return res.data.reply;
  } catch (err) {
    console.error("Frontend Gemini Error:", err);
    return "⚠️ AI request failed (frontend).";
  }
}
