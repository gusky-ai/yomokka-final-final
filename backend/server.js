import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getGeminiResponse, getBookPrescription } from "./services/gemini.js";
import { fetchBookCover } from "./services/books.js";

dotenv.config();

const app = express();

// CORS 全許可 & JSON パース
app.use(cors({ origin: "*" }));
app.use(express.json());

const PORT = 3000;

// 履歴を整える関数
// - 先頭が user 以外なら削る
// - 最後の user（今回の発言）は history から外して sendMessage にだけ渡す
function sanitizeHistory(history) {
  const copy = Array.isArray(history) ? [...history] : [];

  // 先頭が user 以外なら削る
  while (copy.length > 0 && copy[0].role !== "user") {
    copy.shift();
  }

  // 最後が user なら、今回の発言なので history から外す
  if (copy.length > 0 && copy[copy.length - 1].role === "user") {
    copy.pop();
  }

  return copy;
}

app.post("/api/chat", async (req, res) => {
  try {
    const { history = [], personality, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const cleanedHistory = sanitizeHistory(history);

    const reply = await getGeminiResponse(
      personality,
      cleanedHistory,
      message
    );

    res.json({ reply });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 選書エンドポイント
app.post("/api/prescription", async (req, res) => {
  try {
    const { personality, history } = req.body;

    if (!personality) {
      return res.status(400).json({ error: "Personality is required" });
    }

    const prescription = await getBookPrescription(personality, history);

    // Google Books API から表紙画像を取得
    const imageUrl = await fetchBookCover(
      prescription.book,
      prescription.author
    );

    res.json({
      ...prescription,
      imageUrl
    });
  } catch (err) {
    console.error("Prescription Error:", err);
    res.status(500).json({ error: "Failed to generate prescription" });
  }
});

app.listen(PORT, () => {
  console.log(`🌙 Backend running on port ${PORT}`);
});

