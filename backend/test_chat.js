import { personalityPrompt } from "./services/gemini.js";

// Simple simulated Book Therapist that follows the new rules for testing purposes.
class SimulatedBookTherapist {
  constructor(type) {
    this.type = type;
    this.deepCount = 0; // how many deep-dive questions we've asked
    this.notes = [];
    this.history = [];
    this.questions = [
      "どんな場面でその気持ちになりますか？",
      "その感情はいつごろから続いていますか？",
      "その気持ちになると、具体的にどんな行動や考えが出ますか？",
    ];
    this.followUps = [
      "仕事のことについてもう少し教えてもらえますか？",
      "人間関係で何かきっかけがありましたか？",
      "身体的な症状（睡眠、食欲など）は変化しましたか？",
    ];
    this.sampleBooks = [
      {
        book: "深夜の図書館",
        author: "マット・ヘイグ",
        line: "もしも別の人生を試せたなら。",
        reason:
          "選択や後悔に悩む人に寄り添う穏やかな物語です。あなたが人生の重さに押しつぶされそうなとき、別の視点を与え、心を軽くしてくれるでしょう。",
      },
      {
        book: "嫌われる勇気",
        author: "岸見一郎、古賀史健",
        line: "他人の期待に振り回されない生き方を学ぶ。",
        reason:
          "対人関係の不安や自己肯定感の揺らぎに効く実践的な対話集です。行動の選択肢を増やし、今の関係性を見直すきっかけになります。",
      },
      {
        book: "ノルウェイの森",
        author: "村上春樹",
        line: "喪失と向き合う静かな物語。",
        reason:
          "孤独や喪失感が強いときに寄り添う小説です。情緒の揺れを丁寧に扱う表現が、感情の整理に役立つでしょう。",
      },
    ];
  }

  record(userMessage) {
    this.history.push({ role: "user", content: userMessage });
    // simple keyword extraction
    const kws = userMessage.match(/仕事|人間関係|眠|孤独|不安|焦り|疲れ/g);
    if (kws) this.notes.push(...kws);
  }

  nextResponse(userMessage) {
    if (userMessage) this.record(userMessage);

    // Determine whether we should ask another deep question
    if (this.deepCount < 3) {
      const empathy = this.simpleEmpathy(userMessage);
      const question = this.questions[this.deepCount] || this.followUps[0];
      this.deepCount += 1;
      const resp = `${empathy} ${question}`;
      this.history.push({ role: "assistant", content: resp });
      return resp;
    }

    // After 3 deep digs, synthesize and recommend a book
    const empathy = this.simpleEmpathy(userMessage);
    const prescription = this.chooseBook();
    const resp = `${empathy} 私が今おすすめしたい本は「${prescription.book}」（${prescription.author}）です。${prescription.reason}`;
    this.history.push({ role: "assistant", content: resp });
    return resp;
  }

  simpleEmpathy(userMessage) {
    // Very short empathy based on detected keywords
    if (!userMessage) return "よく話してくれました。";
    if (userMessage.match(/眠|寝/)) return "それはお辛いですね。";
    if (userMessage.match(/仕事/)) return "仕事でお疲れなのですね。";
    if (userMessage.match(/孤独|さみ/)) return "孤独を感じているのですね。";
    return "お話ありがとうございます。";
  }

  chooseBook() {
    // naive selection based on notes
    if (this.notes.find((k) => k === "仕事")) return this.sampleBooks[0];
    if (this.notes.find((k) => k === "孤独")) return this.sampleBooks[2];
    return this.sampleBooks[1];
  }
}

// Simulate a short conversation
function runSimulation() {
  console.log("=== Simulated Book Therapist Conversation ===\n");

  const type = "A"; // arbitrary
  console.log("[System Prompt Preview]\n");
  console.log(personalityPrompt(type).slice(0, 800) + "\n---\n\n");

  const bot = new SimulatedBookTherapist(type);

  // Sample user messages (you can change these to test other flows)
  const userMessages = [
    "最近、仕事に行くのがつらくて…",
    "会議のあと、誰とも話したくなくなります。",
    "夜も眠れなくて、朝起きるのが苦痛です。",
    "（追加の補足）職場の評価が下がっている気がして不安です。",
  ];

  for (let i = 0; i < userMessages.length; i++) {
    const user = userMessages[i];
    console.log(`User: ${user}`);
    const reply = bot.nextResponse(user);
    console.log(`Assistant: ${reply}\n`);
  }

  console.log("=== End of Simulation ===");
}

runSimulation();
