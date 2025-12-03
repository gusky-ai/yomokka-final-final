
const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatRoom({ personality, onFinish, onBack }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [turns, setTurns] = useState(0);
    const [loading, setLoading] = useState(false);
    const [prescriptionLoading, setPrescriptionLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const recognitionRef = useRef(null);

    const MAX_TURNS = 15; // 深掘り対応のため増加
    const canRequestPrescription = turns >= 3; // 3ターン以降に変更

    // 音声認識の設定
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.lang = 'ja-JP';
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
            alert('お使いのブラウザは音声入力に対応していません。Chrome/Edgeをご利用ください。');
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

        // 最後のuserとassistantのペアを削除
        const newMessages = messages.slice(0, -2);
        setMessages(newMessages);
        setTurns(Math.max(0, turns - 1));
        setErrorMessage(null);
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
                    history: history
                })
            });

            if (!prescriptionRes.ok) {
                const errorData = await prescriptionRes.json();
                throw new Error(errorData.details || errorData.error || '処方エラー');
            }

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
            setErrorMessage(`処方エラー: ${prescriptionError.message}`);
            setPrescriptionLoading(false);
        }
    };

    const sendMessage = async (messageText = input) => {
        if (!messageText || loading) return;

        const newTurns = turns + 1;
        const newHistory = [...messages, { role: "user", content: messageText }];

        setMessages(newHistory);
        setInput("");
        setTurns(newTurns);
        setLoading(true);
        setErrorMessage(null);

        try {
            const res = await fetch(`${API_URL}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: messageText,
                    personality,
                    history: newHistory
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.details || errorData.error || '通信エラー');
            }

            const data = await res.json();
            const reply = { role: "assistant", content: data.reply || "" };
            const fullHistory = [...newHistory, reply];
            setMessages(fullHistory);

            // 最大ターン数に達したら自動で処方
            if (newTurns >= MAX_TURNS) {
                await requestPrescription(fullHistory, data.reply);
            }
        } catch (e) {
            console.error("Chat error:", e);
            setErrorMessage(`通信エラー: ${e.message}`);
            // エラー時はユーザーメッセージを削除
            setMessages(messages);
            setTurns(turns);
        } finally {
            setLoading(false);
        }
    };

    const quickSelect = (text) => {
        sendMessage(text);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="min-h-screen bg-cream text-navy font-serif flex flex-col">
            {/* ヘッダー */}
            <header className="px-4 pt-4 pb-3 border-b border-sage/20 bg-white">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="text-sm text-navy/60 hover:text-navy transition-colors flex items-center gap-1"
                        >
                            <span>←</span> 診断に戻る
                        </button>
                    )}
                    <p className="text-xs tracking-[0.25em] text-navy/60 mx-auto uppercase">
                        Counseling
                    </p>
                    {messages.length >= 2 && (
                        <button
                            onClick={handleUndo}
                            disabled={loading || prescriptionLoading}
                            className="text-sm text-navy/60 hover:text-navy transition-colors flex items-center gap-1"
                            title="一つ前の質問に戻る"
                        >
                            <span>↶</span> 戻る
                        </button>
                    )}
                    {messages.length < 2 && <div className="w-20" />}
                </div>
            </header>

            {/* チャット本体 */}
            <main className="flex-1 flex justify-center px-2 sm:px-4 py-4">
                <div className="w-full max-w-2xl rounded-3xl bg-white border border-sage/20 shadow-luxury flex flex-col overflow-hidden">
                    <div className="flex flex-col h-full">
                        <div className="px-4 pt-4 pb-2 border-b border-sage/10">
                            <p className="text-sm text-navy/80">
                                今日のあなたのことを、好きな言葉で話してみてください。
                            </p>
                        </div>

                        <div className="flex-1 px-4 py-3 space-y-3 overflow-y-auto">
                            <AnimatePresence>
                                {messages.map((m, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${m.role === "user"
                                                ? "bg-sage/20 text-navy"
                                                : "bg-cream border border-sage/10 text-navy/90"
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
                                    <div className="max-w-[80%] px-3 py-2 rounded-2xl text-sm bg-cream border border-sage/10 text-navy/70 animate-pulse">
                                        <span className="inline-flex items-center gap-1">
                                            考えています
                                            <span className="inline-flex gap-0.5">
                                                <span className="animate-bounce delay-0">.</span>
                                                <span className="animate-bounce delay-100" style={{ animationDelay: '0.1s' }}>.</span>
                                                <span className="animate-bounce delay-200" style={{ animationDelay: '0.2s' }}>.</span>
                                            </span>
                                        </span>
                                    </div>
                                </motion.div>
                            )}

                            {/* エラーメッセージ表示 */}
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

                            {/* クイック選択肢（最初のみ表示） */}
                            {messages.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="pt-4"
                                >
                                    <p className="text-xs text-navy/60 mb-3 text-center">
                                        よくある気持ちから選ぶ：
                                    </p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {["元気になりたい", "泣きたい", "落ち着きたい", "前に進みたい"].map((option) => (
                                            <motion.button
                                                key={option}
                                                onClick={() => quickSelect(option)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-4 py-2 text-xs rounded-full border border-sage/30 text-navy/70 hover:bg-sage/10 hover:border-sage transition-colors"
                                            >
                                                {option}
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {messages.length === 0 && (
                                <p className="text-xs text-navy/50 mt-4">
                                    例）「最近、試合と勉強のバランスがうまくとれない。」<br />
                                    「楽しいけど、時々ふと不安になる夜がある。」
                                </p>
                            )}
                        </div>

                        {/* 処方要求ボタン */}
                        {canRequestPrescription && turns < MAX_TURNS && !loading && !prescriptionLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="px-4 py-2 border-t border-sage/10 bg-cream/50 flex justify-center"
                            >
                                <button
                                    onClick={() => requestPrescription()}
                                    className="text-xs text-navy/70 hover:text-navy py-1 px-4 rounded-full border border-sage/30 hover:border-sage hover:bg-sage/5 transition-colors"
                                >
                                    本を処方してほしい
                                </button>
                            </motion.div>
                        )}

                        {/* 処方ローディング表示 */}
                        {prescriptionLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="px-4 py-3 border-t border-sage/10 bg-gold/5 flex items-center justify-center gap-2"
                            >
                                <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                                <span className="text-sm text-navy/80 font-medium">
                                    運命の一冊を選定中...
                                </span>
                            </motion.div>
                        )}

                        <div className="border-t border-sage/10 px-4 py-3 flex gap-2 bg-cream/30">
                            <textarea
                                rows={2}
                                className="flex-1 text-sm bg-white border border-sage/20 rounded-2xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-sage/50"
                                placeholder="心の中身を少しだけ置いていく感じで、書いてみてください。"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={loading || prescriptionLoading}
                            />

                            {/* 音声入力ボタン */}
                            <button
                                onClick={toggleVoiceInput}
                                disabled={loading || prescriptionLoading}
                                className={`self-end px-3 py-2 rounded-2xl text-sm transition-all ${isListening
                                        ? "bg-gold text-white animate-pulse"
                                        : "bg-sage/20 text-navy hover:bg-sage/30"
                                    } ${loading || prescriptionLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                                title="音声入力"
                            >
                                🎤
                            </button>

                            <button
                                onClick={() => sendMessage()}
                                disabled={loading || !input || prescriptionLoading}
                                className={`self-end px-4 py-2 rounded-2xl text-sm font-semibold transition-colors ${loading || !input || prescriptionLoading
                                    ? "bg-navy/30 text-cream/50 cursor-not-allowed"
                                    : "bg-navy text-cream hover:bg-midnight"
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
