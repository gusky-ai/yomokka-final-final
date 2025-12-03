import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Diagnosis from "./components/Diagnosis.jsx";
import ChatRoom from "./components/ChatRoom.jsx";
import BookResult from "./components/BookResult.jsx";
import BookDetail from "./components/BookDetail.jsx";
import History from "./components/History.jsx";
import Profile from "./components/Profile.jsx";

function Landing({ onEnter, onHistoryClick, onProfileClick }) {
    const { scrollY } = useScroll();
    const headerBg = useTransform(
        scrollY,
        [0, 100],
        ["rgba(250, 250, 249, 0)", "rgba(250, 250, 249, 0.95)"]
    );
    const headerShadow = useTransform(
        scrollY,
        [0, 100],
        ["0 0 0 rgba(0,0,0,0)", "0 2px 10px rgba(30, 41, 59, 0.1)"]
    );

    return (
        <div className="min-h-screen bg-cream text-navy font-serif">
            {/* ヘッダー - スクロール追従 */}
            <motion.header
                style={{
                    backgroundColor: headerBg,
                    boxShadow: headerShadow
                }}
                className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
            >
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold tracking-wide">
                        <span className="text-navy">Fateful Book</span>
                    </h1>
                    <div className="flex gap-3">
                        <button
                            onClick={onHistoryClick}
                            className="px-4 py-1.5 text-sm border border-navy/30 rounded-full hover:bg-navy/5 transition-colors"
                        >
                            お薬手帳
                        </button>
                        <button
                            onClick={onProfileClick}
                            className="px-4 py-1.5 text-sm border border-navy/30 rounded-full hover:bg-navy/5 transition-colors"
                        >
                            プロフィール
                        </button>
                        <button className="px-4 py-1.5 text-sm text-xl" title="ホーム">
                            🏠
                        </button>
                        <button className="px-4 py-1.5 text-sm border-2 border-navy rounded-full hover:bg-navy hover:text-cream transition-colors">
                            サインイン
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* ヒーローセクション */}
            <section className="min-h-screen flex items-center justify-center px-6 pt-20 relative overflow-hidden">
                {/* 背景グラデーション */}
                <div className="absolute inset-0 bg-gradient-to-br from-cream via-sage/10 to-gold/5 -z-10" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-3xl text-center"
                >
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-sm tracking-[0.3em] text-navy/60 mb-6 uppercase"
                    >
                        Your Fateful Book
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-5xl sm:text-6xl font-bold mb-6 leading-tight"
                    >
                        運命の一冊、
                        <br />
                        <span className="text-sage">処方します。</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                        className="text-lg sm:text-xl text-navy/80 mb-12 leading-relaxed"
                    >
                        Fateful Bookは、あなたの性格と悩みに寄り添い、
                        <br />
                        今読むべき本を提案する『言葉の薬局』です。
                    </motion.p>

                    <motion.button
                        onClick={onEnter}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-10 py-4 bg-navy text-cream text-lg font-semibold rounded-full shadow-luxury hover:shadow-xl transition-all"
                    >
                        診断を始める
                    </motion.button>
                </motion.div>
            </section>

            {/* コンセプトセクション */}
            <section className="py-24 px-6 bg-white">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <p className="text-3xl sm:text-4xl font-semibold leading-relaxed text-navy mb-6">
                        身体の不調に薬があるように、
                        <br />
                        <span className="text-gold">心の不調には言葉が必要です。</span>
                    </p>
                    <p className="text-base text-navy/70 leading-relaxed">
                        静かな書斎で、あなたに寄り添う一冊を見つけてください。
                    </p>
                </motion.div>
            </section>

            {/* 使い方（3 Steps） */}
            <section className="py-24 px-6 bg-cream">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                    className="max-w-5xl mx-auto"
                >
                    <h3 className="text-3xl font-bold text-center mb-16 text-navy">
                        ご利用の流れ
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "01",
                                title: "問診",
                                description: "あなたの性格（MBTI）と今の悩みを教えてください。",
                                delay: 0.2
                            },
                            {
                                step: "02",
                                title: "処方",
                                description: "AIがあなたに最適な一冊を選書します。",
                                delay: 0.4
                            },
                            {
                                step: "03",
                                title: "服用・記録",
                                description: "お薬手帳に記録して、いつでも振り返れます。",
                                delay: 0.6
                            }
                        ].map((item) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.7, delay: item.delay }}
                                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="text-gold text-5xl font-bold mb-4 opacity-30">
                                    {item.step}
                                </div>
                                <h4 className="text-2xl font-semibold mb-3 text-navy">
                                    {item.title}
                                </h4>
                                <p className="text-navy/70 leading-relaxed">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* フッター */}
            <footer className="py-12 px-6 bg-midnight text-cream/80 text-center text-sm">
                <p>© 2024 Fateful Book. あなたの運命の一冊に出会う旅を。</p>
            </footer>
        </div>
    );
}

export default function App() {
    const [phase, setPhase] = useState("landing");
    const [personality, setPersonality] = useState("");
    const [result, setResult] = useState(null);
    const [detailBook, setDetailBook] = useState(null);

    if (phase === "landing") {
        return (
            <Landing
                onEnter={() => setPhase("diagnosis")}
                onHistoryClick={() => setPhase("history")}
                onProfileClick={() => setPhase("profile")}
            />
        );
    }

    if (phase === "diagnosis") {
        return (
            <Diagnosis
                onFinish={(type) => {
                    setPersonality(type);
                    setPhase("chat");
                }}
                onBack={() => setPhase("landing")}
            />
        );
    }

    if (phase === "chat") {
        return (
            <ChatRoom
                personality={personality}
                onFinish={(data) => {
                    setResult(data);
                    setPhase("result");
                }}
                onBack={() => setPhase("diagnosis")}
            />
        );
    }

    if (phase === "detail") {
        return (
            <BookDetail
                data={detailBook}
                onBack={() => setPhase("result")}
            />
        );
    }

    if (phase === "history") {
        return <History onBack={() => setPhase("landing")} />;
    }

    if (phase === "profile") {
        return <Profile onBack={() => setPhase("landing")} />;
    }

    return (
        <BookResult
            data={result}
            onDetailClick={(bookData) => {
                setDetailBook(bookData);
                setPhase("detail");
            }}
            onBackToHome={() => setPhase("landing")}
        />
    );
}
