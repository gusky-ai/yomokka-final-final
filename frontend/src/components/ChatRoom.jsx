
const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

import { useState } from "react";

export default function ChatRoom({ personality, onFinish }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [turns, setTurns] = useState(0);
    const [loading, setLoading] = useState(false);

    const MAX_TURNS = 10;
    const canRequestPrescription = turns >= 1;

    const requestPrescription = async (history = messages, summary = "") => {
        try {
            const prescriptionRes = await fetch(`${API_URL}/api/prescription`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    personality,
                    history: history
                })
            });
            const prescription = await prescriptionRes.json();

            onFinish({
                summary: summary,
                personality,
                history: history,
                book: prescription.book,
                author: prescription.author,
                line: prescription.line,
                reason: prescription.reason,
                imageUrl: prescription.imageUrl
            });
        } catch (prescriptionError) {
            console.error("Prescription error:", prescriptionError);
            onFinish({
                summary: summary,
                personality,
                history: history
            });
        }
    };

    const sendMessage = async () => {
        if (!input || loading) return;

        const newTurns = turns + 1;
        const newHistory = [...messages, { role: "user", content: input }];

        setMessages(newHistory);
        setInput("");
        setTurns(newTurns);
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: input,
                    personality,
                    history: newHistory
                })
            });

            const data = await res.json();
            const reply = { role: "assistant", content: data.reply || "" };
            const fullHistory = [...newHistory, reply];
            setMessages(fullHistory);

            // 最大ターン数に達したら自動で処方
            if (newTurns >= MAX_TURNS) {
                await requestPrescription(fullHistory, data.reply);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-serif flex flex-col">
            {/* 上部：シンプルなヘッダー */}
            <header className="px-4 pt-4 pb-3 border-b border-slate-200">
                <p className="text-xs tracking-[0.25em] text-slate-500 text-center">
                    N I G H T &nbsp; T A L K
                </p>
            </header>

            {/* チャット本体 */}
            <main className="flex-1 flex justify-center px-2 sm:px-4 py-4">
                <div className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-lg flex flex-col overflow-hidden">
                    <div className="flex flex-col h-full">
                        <div className="px-4 pt-4 pb-2 border-b border-slate-200">
                            <p className="text-sm text-slate-700">
                                今日のあなたのことを、好きな言葉で話してみてください。
                            </p>
                        </div>

                        <div className="flex-1 px-4 py-3 space-y-3 overflow-y-auto">
                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${m.role === "user"
                                                ? "bg-indigo-100 text-slate-900"
                                                : "bg-slate-100 border border-slate-200 text-slate-800"
                                            }`}
                                    >
                                        {m.content}
                                    </div>
                                </div>
                            ))}

                            {/* AI思考中インジケーター */}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="max-w-[80%] px-3 py-2 rounded-2xl text-sm bg-slate-100 border border-slate-200 text-slate-700 animate-pulse">
                                        <span className="inline-flex items-center gap-1">
                                            店主が本棚のどこかで考えています
                                            <span className="inline-flex gap-0.5">
                                                <span className="animate-bounce delay-0">.</span>
                                                <span className="animate-bounce delay-100" style={{ animationDelay: '0.1s' }}>.</span>
                                                <span className="animate-bounce delay-200" style={{ animationDelay: '0.2s' }}>.</span>
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            )}

                            {messages.length === 0 && (
                                <p className="text-xs text-slate-500 mt-4">
                                    例）「最近、試合と勉強のバランスがうまくとれない。」<br />
                                    「楽しいけど、時々ふと不安になる夜がある。」
                                </p>
                            )}
                        </div>

                        {/* 処方要求ボタン */}
                        {canRequestPrescription && turns < MAX_TURNS && !loading && (
                            <div className="px-4 py-2 border-t border-slate-200 bg-slate-50 flex justify-center">
                                <button
                                    onClick={() => requestPrescription()}
                                    className="text-xs text-slate-600 hover:text-indigo-600 py-1 px-4 rounded-full border border-slate-300 hover:border-indigo-400 transition-colors"
                                >
                                    そろそろ本を処方してほしい
                                </button>
                            </div>
                        )}

                        <div className="border-t border-slate-200 px-4 py-3 flex gap-2 bg-slate-50">
                            <textarea
                                rows={2}
                                className="flex-1 text-sm bg-white border border-slate-300 rounded-2xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="心の中身を少しだけ置いていく感じで、書いてみてください。"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading || !input}
                                className={`self-end px-4 py-2 rounded-2xl text-sm font-semibold transition-colors ${loading || !input
                                        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                                    }`}
                            >
                                {loading ? "…" : "送信"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
