import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// AI返信を短縮する関数（2文以内、100文字以内に拡張）
function shortenForChat(text) {
    if (!text) return "";

    // 句点で分割して2文まで取得
    const sentences = text.split(/[。！？]/).filter(s => s.trim());
    let shortened = sentences.slice(0, 2).join('。');
    if (shortened && !shortened.match(/[。！？]$/)) {
        shortened += '。';
    }

    // 100文字でカット（深掘り質問のため少し長めに）
    if (shortened.length > 100) {
        return shortened.substring(0, 100) + '...';
    }

    return shortened;
}

// AI 人格の分岐プロンプト（深掘りモードに更新）
function personalityPrompt(type) {
    const tone =
        type && type.includes("T")
            ? "あなたは静かで理性的な壁打ちパートナーです。感情ではなく、思考の整理を手伝います。"
            : "あなたは柔らかく寄り添うカウンセラーです。温かく、静かに心を受け止めます。";

    return `
あなたは深夜の言葉の薬局「Fateful Book」の薬剤師です。
話し方は落ち着いていて、静かな夜の空気のように穏やかです。

【重要なルール】
- 最初の1~2ターンは本を提案しないでください
- まずユーザーの気持ちを深く理解するための質問をしてください
- 例: 「なぜそう感じるのですか？」「どんな気持ちになりたいですか？」「その感情の根っこには何がありそうですか？」
- ユーザーの核心に触れたと感じるまで、深掘りを続けてください
- 本の提案や書籍名は、明示的に求められるまで控えてください
- 返答は必ず2文以内、100文字以内で簡潔にしてください

${tone}
`;
}

export async function getGeminiResponse(type, history, message) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
        });

        // frontend から来た履歴を SDK 形式に変換
        // assistant → model に変換して、Gemini のロール仕様に合わせる
        const safeHistory = (history || []).map((h) => ({
            role: h.role === "assistant" ? "model" : "user",
            parts: [{ text: h.content }],
        }));

        console.log(`🤖 Starting chat with ${safeHistory.length} history items`);

        // ここまでの会話だけを渡してチャット開始
        const chat = model.startChat({
            history: safeHistory,
        });

        // 1ターン目だけは性格プロンプトをメッセージに混ぜる
        const isFirstTurn = safeHistory.length === 0;
        const userMessageText = isFirstTurn
            ? personalityPrompt(type) + "\n\n" + message
            : message;

        const result = await chat.sendMessage(userMessageText);
        const responseText = result.response.text();

        console.log(`📝 Raw response: "${responseText.substring(0, 100)}..."`);

        // 強制短縮
        const shortened = shortenForChat(responseText);
        console.log(`✂️ Shortened to: "${shortened}"`);

        return shortened;
    } catch (error) {
        console.error("❌ Error in getGeminiResponse:", error);
        throw new Error(`Gemini API call failed: ${error.message}`);
    }
}

// Gemini による選書機能
export async function getBookPrescription(personality, history) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
        });

        // チャット履歴を要約
        const conversationSummary = (history || [])
            .map((h) => `${h.role === "user" ? "ユーザー" : "薬剤師"}: ${h.content}`)
            .join("\n");

        console.log(`📖 Generating prescription with ${history?.length || 0} conversation turns`);

        const prompt = `
あなたは深夜の言葉の薬局「Fateful Book」の薬剤師です。
以下のユーザー情報から、今のこの人に最も心に効く本を世界中の実在する本から1冊だけ選んでください。

【診断結果】
${personality || "不明"}

【カウンセリング記録】
${conversationSummary}

以下の点を重視してください：
- 実在する本であること（架空の本は絶対に避けてください）
- 著者名も正確に含めること
- その人の今の心の状態に深く寄り添う本であること
- 小説、哲学書、エッセイ、詩集など幅広いジャンルから選んでください
- 会話の中で見えた「核心」に響く本を選んでください

必ず以下のJSON形式「のみ」で返してください（他の文章は一切不要）：
{
  "book": "本のタイトル",
  "author": "著者名",
  "line": "その本から心に刺さる一文、または本の雰囲気を表す短い言葉",
  "reason": "なぜこの本が今のこの人に効くのか。こころの状態とどう響き合うのか、2-3文で説明"
}
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        console.log(`📚 Prescription response received`);

        try {
            // JSONのみを抽出（マークダウンのコードブロックなどを除去）
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const prescription = JSON.parse(jsonMatch[0]);
                console.log(`✅ Prescription parsed: "${prescription.book}" by ${prescription.author}`);
                return prescription;
            }
            throw new Error("JSON not found in response");
        } catch (parseError) {
            console.error("❌ Failed to parse prescription response:", text);
            console.error("Parse error:", parseError);
            // フォールバック：デフォルトの本を返す
            return {
                book: "世界の終りとハードボイルド・ワンダーランド",
                author: "村上春樹",
                line: "現実と非現実のあいだで、そっと頭を冷やしたい夜に。",
                reason: "あなたの言葉の温度や揺らぎから、静かに思考を整理できる物語が必要だと感じました。村上春樹の独特な世界観は、論理と感情の狭間で揺れるあなたの心に、穏やかな着地点を与えてくれるはずです。"
            };
        }
    } catch (error) {
        console.error("❌ Error in getBookPrescription:", error);
        throw new Error(`Book prescription failed: ${error.message}`);
    }
}
