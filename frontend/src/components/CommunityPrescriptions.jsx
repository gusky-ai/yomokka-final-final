import { useEffect, useState } from "react";

const MBTI_OPTIONS = [
  "INTJ","INTP","ENTJ","ENTP","INFJ","INFP","ENFJ","ENFP","ISTJ","ISFJ","ESTJ","ESFJ","ISTP","ISFP","ESTP","ESFP"
];

const SYMPTOM_OPTIONS = [
  "不安・孤独感","抑うつ気味","自己肯定感の低下","仕事の悩み","人間関係","睡眠障害","その他"
];

const STORAGE_KEY = "yomokka_prescriptions";

export default function CommunityPrescriptions() {
  const [tab, setTab] = useState("view");
  const [items, setItems] = useState([]);

  // form state
  const [mbti, setMbti] = useState("INFP");
  const [title, setTitle] = useState("");
  const [symptom, setSymptom] = useState(SYMPTOM_OPTIONS[0]);
  const [effect, setEffect] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setItems(JSON.parse(raw));
      } else {
        const seeded = [
          { mbti: "INFP", title: "夜と霧", symptom: "不安・孤独感", effect: "生きる意味について考え直すきっかけになり、孤独感が和らいだ。" },
          { mbti: "ENFJ", title: "夜明け前", symptom: "自己肯定感の低下", effect: "主人公の強さに励まされ、自分を許すことができた。" },
        ];
        setItems(seeded);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  function handleSubmit(e) {
    e.preventDefault();
    const newItem = { mbti, title: title || "タイトル未入力", symptom, effect };
    setItems((s) => [newItem, ...s]);
    setTab("view");
    // reset form
    setTitle("");
    setEffect("");
  }

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-3xl font-bold text-center mb-6 text-navy">みんなの処方箋（コミュニティ）</h3>

        {/* tabs */}
        <div className="flex gap-2 justify-center mb-8">
          <button
            className={`px-4 py-2 rounded-full ${tab === "view" ? "bg-navy text-cream" : "border border-navy/20 text-navy"}`}
            onClick={() => setTab("view")}
          >
            💊 効能を見る
          </button>
          <button
            className={`px-4 py-2 rounded-full ${tab === "write" ? "bg-navy text-cream" : "border border-navy/20 text-navy"}`}
            onClick={() => setTab("write")}
          >
            ✍️ 処方箋を書く
          </button>
        </div>

        {tab === "view" && (
          <div className="space-y-6">
            {items.length === 0 ? (
              <p className="text-center text-navy/70">まだ投稿がありません。処方箋を書いてみましょう。</p>
            ) : (
              items.map((r, i) => (
                <div key={i} className="p-4 rounded-2xl shadow-md bg-cream">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center text-lg font-bold text-navy">
                      {r.mbti}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-4">
                        <h4 className="text-lg font-semibold text-navy">{r.title}</h4>
                        <span className="text-sm text-navy/60">{r.symptom}</span>
                      </div>
                      <p className="mt-2 text-navy/80">{r.effect}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "write" && (
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <div className="text-sm text-navy/70 mb-1">あなたのMBTI</div>
                <select value={mbti} onChange={(e) => setMbti(e.target.value)} className="w-full p-2 rounded-md border">
                  {MBTI_OPTIONS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <div className="text-sm text-navy/70 mb-1">本のタイトル</div>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 rounded-md border" />
              </label>
            </div>

            <div className="mt-4">
              <div className="text-sm text-navy/70 mb-1">症状（悩み）</div>
              <select value={symptom} onChange={(e) => setSymptom(e.target.value)} className="w-full p-2 rounded-md border">
                {SYMPTOM_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <div className="text-sm text-navy/70 mb-1">効能（どう救われたか）</div>
              <textarea value={effect} onChange={(e) => setEffect(e.target.value)} className="w-full p-3 rounded-md border" rows={5} />
            </div>

            <div className="mt-4 text-right">
              <button type="submit" className="px-6 py-2 bg-navy text-cream rounded-full">投稿する</button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
