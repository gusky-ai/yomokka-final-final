const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "./Particles.jsx";

export default function ChatRoom({ personality, onFinish, onBack }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [turns, setTurns] = useState(0);
    const [loading, setLoading] = useState(false);
    const [prescriptionLoading, setPrescriptionLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const recognitionRef = useRef(null);

    const MAX_TURNS = 15;
    const canRequestPrescription = turns >= 3;

    // 音声認識の設定
    useEffect(() => {
        if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
            const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.lang = "ja-JP";
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = () => {
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const toggleVoiceInput = () => {
        if (!recognitionRef.current) {
            alert(
                "お使いのブラウザは音声入力に対応していません。Chrome/Edgeをご利用ください。"
            );
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    // 一つ前の質問に戻る
    const handleUndo = () => {
        if (messages.length < 2) return;

        const newMessages = messages.slice(0, -2);
        setMessages(newMessages);
        setTurns((prev) => Math.max(0, prev - 1));
        setErrorMessage(null);
        setSuggestions([]);
    };

    const requestPrescription = async (history = messages, summary = "") => {
        setPrescriptionLoading(true);
        setErrorMessage(null);

        try {
            const prescriptionRes = await fetch(`${API_URL}/api/prescription`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    personality,
                    history,
                }),
            });

            if (!prescriptionRes.ok) {
                const errorData = await prescriptionRes.json();
                throw new Error(
                    errorData.details || errorData.error || "処方エラー"
                );
            }

            const prescription = await prescriptionRes.json();

            onFinish({
                summary,
                personality,
                history,
                book: prescription.book,
                author: prescription.author,
                line: prescription.line,
                reason: prescription.reason,
                imageUrl: prescription.imageUrl,
            });
        } catch (prescriptionError) {
            console.error("Prescription error:", prescriptionError);
            setErrorMessage(`処方エラー: ${prescriptionError.message}`);
            setPrescriptionLoading(false);
        }
    };

    const sendMessage = async (messageText = input) => {
        if (!messageText || loading) return;

        const newTurns = turns + 1;
        const userMessage = { role: "user", content: messageText };
        const newHistory = [...messages, userMessage];

        setMessages(newHistory);
        setInput("");
        setTurns(newTurns);
        setLoading(true);
        setErrorMessage(null);
        setSuggestions([]);

        // 1ターン目だけ history を空で送る（personalityPrompt を効かせる）
        const isFirstTurn = messages.length === 0;
        const apiHistory = isFirstTurn ? [] : newHistory;

        try {
            const res = await fetch(`${API_URL}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: messageText,
                    personality,
                    history: apiHistory,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(
                    errorData.details || errorData.error || "通信エラー"
                );
            }

            const data = await res.json();
            const reply = { role: "assistant", content: data.reply || "" };
            const fullHistory = [...newHistory, reply];
            setMessages(fullHistory);

            // 最大ターン数に達したら自動で処方
            if (newTurns >= MAX_TURNS) {
                await requestPrescription(fullHistory, data.reply);
                return;
            }

            // 2回目以降のチップ候補
            try {
                const sugRes = await fetch(`${API_URL}/api/suggestions`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        personality,
                        history: fullHistory,
                    }),
                });

                if (sugRes.ok) {
                    const sugData = await sugRes.json();
                    if (Array.isArray(sugData.options)) {
                        setSuggestions(sugData.options);
                    }
                }
            } catch (sugError) {
                console.error("Suggestions error:", sugError);
            }
        } catch (e) {
            console.error("Chat error:", e);
            setErrorMessage(`通信エラー: ${e.message}`);
            setMessages(messages);
            setTurns(turns);
        } finally {
            setLoading(false);
        }
    };

    // 途中から何度でも使えるクイック入力
    const quickSelect = (text) => {
        sendMessage(text);
    };

    // 最初だけ使うスタートタグ
    const startQuickSelect = (text) => {
        const startMessage =
            `【スタートタグ】${text}\n` +
            "今の気分を一番よく表していると思ったので、これを選びました。";
        sendMessage(startMessage);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden font-serif flex flex-col">
            {/* ダークグラデーション背景 */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-900 animate-gradient -z-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 -z-10" />
            <Particles />

            {/* ヘッダー */}
            <header className="px-4 pt-4 pb-3 border-b border-white/10 backdrop-blur-md bg-white/5 relative z-10">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1"
                        >
                            <span>←</span> 診断に戻る
                        </button>
                    )}
                    <p className="text-xs tracking-[0.3em] text-white/60 mx-auto uppercase font-sans">
                        💬 Counseling
                    </p>
                    {messages.length >= 2 && (
                        <button
                            onClick={handleUndo}
                            disabled={loading || prescriptionLoading}
                            className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1"
                            title="一つ前の質問に戻る"
                        >
                            <span>↶</span> 戻る
                        </button>
                    )}
                    {messages.length < 2 && <div className="w-20" />}
                </div>
            </header>

            {/* チャット本体 */}
            <main className="flex-1 flex justify-center px-2 sm:px-4 py-6 relative z-10">
                <div className="w-full max-w-2xl rounded-3xl glassmorphism-dark border border-white/10 shadow-2xl flex flex-col overflow-hidden">
                    <div className="flex flex-col h-full">
                        {/* 説明 */}
                        <div className="px-4 pt-4 pb-3 border-b border-white/10">
                            <p className="text-sm text-white/80 font-light">
                                今日のあなたのことを、好きな言葉で話してみてください。
                            </p>
                        </div>

                        {/* メッセージ欄 */}
                        <div className="flex-1 px-4 py-3 space-y-3 overflow-y-auto">
                            <AnimatePresence>
                                {messages.map((m, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`flex ${m.role === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                            }`}
                                    >
                                        <div
                                            className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-lg ${m.role === "user"
                                                ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white"
                                                : "bg-white/10 backdrop-blur-md border border-white/20 text-white/90"
                                                }`}
                                        >
                                            {m.content}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* AI思考中インジケーター */}
                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="max-w-[80%] px-4 py-3 rounded-2xl text-sm bg-white/10 backdrop-blur-md border border-white/20 text-white/70 animate-pulse">
                                        <span className="inline-flex items-center gap-1">
                                            考えています
                                            <span className="inline-flex gap-0.5">
                                                <span className="animate-bounce delay-0">
                                                    .
                                                </span>
                                                <span
                                                    className="animate-bounce delay-100"
                                                    style={{ animationDelay: "0.1s" }}
                                                >
                                                    .
                                                </span>
                                                <span
                                                    className="animate-bounce delay-200"
                                                    style={{ animationDelay: "0.2s" }}
                                                >
                                                    .
                                                </span>
                                            </span>
                                        </span>
                                    </div>
                                </motion.div>
                            )}

                            {/* エラーメッセージ */}
                            {errorMessage && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex justify-center"
                                >
                                    <div className="px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                                        ⚠️ {errorMessage}
                                        <button
                                            onClick={() => setErrorMessage(null)}
                                            className="ml-2 text-red-500 hover:text-red-700"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* スタート用クイック選択肢（最初のみ） */}
                            {messages.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="pt-4"
                                >
                                    <p className="text-xs text-white/60 mb-3 text-center">
                                        よくある気持ちから選ぶ：
                                    </p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {["元気になりたい", "泣きたい", "落ち着きたい", "前に進みたい"].map(
                                            (option) => (
                                                <motion.button
                                                    key={option}
                                                    onClick={() =>
                                                        startQuickSelect(option)
                                                    }
                                                    whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(255, 215, 0, 0.3)" }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="px-4 py-2 text-xs rounded-full border border-white/30 text-white/80 hover:bg-white/10 hover:border-gold transition-all backdrop-blur-sm"
                                                >
                                                    {option}
                                                </motion.button>
                                            )
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* 2回目以降のダイナミック候補 */}
                            {messages.length > 0 &&
                                suggestions.length > 0 &&
                                !loading &&
                                !prescriptionLoading && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="pt-2"
                                    >
                                        <p className="text-xs text-white/60 mb-2 text-center">
                                            つづきの話し方を選ぶ：
                                        </p>
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {suggestions.map((option, idx) => (
                                                <motion.button
                                                    key={idx}
                                                    onClick={() =>
                                                        quickSelect(option)
                                                    }
                                                    whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(255, 215, 0, 0.3)" }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="px-3 py-1.5 text-xs rounded-full border border-white/30 text-white/80 hover:bg-white/10 hover:border-gold transition-all backdrop-blur-sm"
                                                >
                                                    {option}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                            {messages.length === 0 && (
                                <p className="text-xs text-white/50 mt-4">
                                    例）「最近、試合と勉強のバランスがうまくとれない。」<br />
                                    「楽しいけど、時々ふと不安になる夜がある。」
                                </p>
                            )}
                        </div>

                        {/* 処方要求ボタン */}
                        {canRequestPrescription &&
                            turns < MAX_TURNS &&
                            !loading &&
                            !prescriptionLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="px-4 py-3 border-t border-white/10 bg-white/5 backdrop-blur-md flex justify-center"
                                >
                                    <button
                                        onClick={() => requestPrescription()}
                                        className="text-sm text-white/80 hover:text-gold py-2 px-6 rounded-full border border-white/30 hover:border-gold hover:bg-white/10 transition-all backdrop-blur-sm shadow-lg"
                                    >
                                        📚 本を処方してほしい
                                    </button>
                                </motion.div>
                            )}

                        {/* 処方ローディング表示 */}
                        {prescriptionLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="px-4 py-4 border-t border-white/10 bg-gradient-to-r from-gold/10 to-yellow-500/10 backdrop-blur-md flex items-center justify-center gap-3"
                            >
                                <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                                <span className="text-sm text-white font-medium">
                                    運命の一冊を選定中...
                                </span>
                            </motion.div>
                        )}

                        {/* 入力エリア */}
                        <div className="border-t border-white/10 px-4 py-3 flex gap-2 bg-white/5 backdrop-blur-md">
                            <textarea
                                rows={2}
                                className="flex-1 text-sm bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 rounded-2xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-gold/50"
                                placeholder="心の中身を少しだけ置いていく感じで、書いてみてください。"
                                value={input}
                                onChange={(e) =>
                                    setInput(e.target.value)
                                }
                                onKeyDown={handleKeyDown}
                                disabled={loading || prescriptionLoading}
                            />

                            {/* 音声入力ボタン */}
                            <button
                                onClick={toggleVoiceInput}
                                disabled={loading || prescriptionLoading}
                                className={`self-end px-3 py-2 rounded-2xl text-sm transition-all ${isListening
                                        ? "bg-gold text-white animate-pulse shadow-lg shadow-gold/50"
                                        : "bg-white/10 text-white backdrop-blur-md hover:bg-white/20 border border-white/20"
                                    } ${loading || prescriptionLoading
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                                title="音声入力"
                            >
                                🎤
                            </button>

                            <button
                                onClick={() => sendMessage()}
                                disabled={loading || !input || prescriptionLoading}
                                className={`self-end px-5 py-2 rounded-2xl text-sm font-semibold transition-all ${loading || !input || prescriptionLoading
                                        ? "bg-white/10 text-white/30 cursor-not-allowed border border-white/10"
                                        : "bg-gradient-to-r from-gold to-yellow-500 text-purple-900 hover:shadow-lg hover:shadow-gold/50"
                                    }`}
                            >
                                {loading ? "…" : "✨ 送信"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
