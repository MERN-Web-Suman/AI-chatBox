import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

// ⚠️ Replace with your actual API key
const API_KEY = "AIzaSyAWqc2ETdqVK2ga8ejpOE3wNsr_hItNkno";

// ✅ use a valid Gemini model
const MODEL_ID = "gemini-2.5-flash"; // or "gemini-2.5-pro" / "gemini-1.5-pro"

app.post("/api/ask", async (req, res) => {
  try {
    const { prompt } = req.body;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${API_KEY}`;

    const response = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    const text =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No response from AI";

    res.json({ reply: text });
  } catch (err) {
    console.error("Gemini API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "AI request failed" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
