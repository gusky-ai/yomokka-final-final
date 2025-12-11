import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Diagnosis from "./components/Diagnosis.jsx";
import ChatRoom from "./components/ChatRoom.jsx";
import BookResult from "./components/BookResult.jsx";
import BookDetail from "./components/BookDetail.jsx";
import History from "./components/History.jsx";
import Profile from "./components/Profile.jsx";
import CommunityPrescriptions from "./components/CommunityPrescriptions.jsx";
import Particles from "./components/Particles.jsx";

function LoginModal({ open, onClose, onLogin, loginError }) {
    const [mode, setMode] = useState("signin"); // signin | signup
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    if (!open) return null;

    const handleRegister = () => {
        if (!username || !password) {
            alert("ユーザー名とパスワードを入力してください");
            return;
        }
        const raw = localStorage.getItem("fateful_users");
        const users = raw ? JSON.parse(raw) : {};
        if (users[username]) {
            alert("このユーザー名は既に使われています");
            return;
        }
        // signup: do not ask MBTI here. leave empty; will be set after diagnosis.
        users[username] = { password, mbti: "" };
        localStorage.setItem("fateful_users", JSON.stringify(users));
        // 自動ログイン
        onLogin(username, password);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm relative">
                <button className="absolute top-2 right-3 text-xl" onClick={onClose}>×</button>
                <div className="flex gap-2 mb-4">
                    <button
                        className={`px-3 py-1 rounded ${mode === 'signin' ? 'bg-navy text-cream' : 'bg-gray-100'}`}
                        onClick={() => setMode('signin')}
                    >ログイン</button>
                    <button
                        className={`px-3 py-1 rounded ${mode === 'signup' ? 'bg-navy text-cream' : 'bg-gray-100'}`}
                        onClick={() => setMode('signup')}
                    >新規登録</button>
                </div>

                <h2 className="text-xl font-bold mb-2 text-navy">{mode === 'signin' ? 'ログイン' : '新規登録'}</h2>
                <input
                    className="w-full mb-3 px-3 py-2 border rounded"
                    placeholder="ユーザー名"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    className="w-full mb-3 px-3 py-2 border rounded"
                    placeholder="パスワード"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                {/* no MBTI asked at signup; MBTI assigned during diagnosis */}

                {loginError && mode === 'signin' && <div className="text-red-500 text-sm mb-2">{loginError}</div>}

                {mode === 'signin' ? (
                    <button
                        className="w-full bg-navy text-cream py-2 rounded font-bold hover:bg-sage transition"
                        onClick={() => onLogin(username, password)}
                    >
                        ログイン
                    </button>
                ) : (
                    <button
                        className="w-full bg-navy text-cream py-2 rounded font-bold hover:bg-sage transition"
                        onClick={handleRegister}
                    >
                        新規登録してログイン
                    </button>
                )}
            </div>
        </div>
    );
}

function Landing({ onEnter, onHistoryClick, onProfileClick, onSigninClick, isLoggedIn, onLogout }) {
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
        <div className="min-h-screen relative overflow-hidden font-serif">
            {/* アニメーションするグラデーション背景 */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 animate-gradient -z-20" />

            {/* オーバーレイで少し明るく */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 -z-10" />

            {/* パーティクルエフェクト */}
            <Particles />

            {/* ヘッダー - グラスモーフィズム */}
            <motion.header
                style={{
                    backgroundColor: headerBg,
                    boxShadow: headerShadow
                }}
                className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10"
            >
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold tracking-wide">
                        <span className="bg-gradient-to-r from-white to-gold bg-clip-text text-transparent">Fateful Book</span>
                    </h1>
                    <div className="flex gap-3">
                        <button
                            onClick={onHistoryClick}
                            className="px-4 py-1.5 text-sm border border-white/30 text-white/90 rounded-full hover:bg-white/10 backdrop-blur-sm transition-all"
                        >
                            📖 お薬手帳
                        </button>
                        <button
                            onClick={onProfileClick}
                            className="px-4 py-1.5 text-sm border border-white/30 text-white/90 rounded-full hover:bg-white/10 backdrop-blur-sm transition-all"
                        >
                            👤 プロフィール
                        </button>
                        {isLoggedIn ? (
                            <button
                                className="px-4 py-1.5 text-sm border-2 border-white/50 text-white rounded-full hover:bg-white hover:text-purple-900 transition-all backdrop-blur-sm"
                                onClick={onLogout}
                            >
                                ログアウト
                            </button>
                        ) : (
                            <button
                                className="px-4 py-1.5 text-sm border-2 border-white/50 text-white rounded-full hover:bg-white hover:text-purple-900 transition-all backdrop-blur-sm"
                                onClick={onSigninClick}
                            >
                                ログイン
                            </button>
                        )}
                    </div>
                </div>
            </motion.header>

            {/* ヒーローセクション */}
            <section className="min-h-screen flex items-center justify-center px-6 pt-20 relative">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                    className="max-w-4xl text-center relative z-10"
                >
                    {/* グラスモーフィズムカード */}
                    <motion.div
                        whileHover={{ scale: 1.02, rotateY: 2 }}
                        transition={{ duration: 0.6 }}
                        className="glassmorphism-dark rounded-3xl p-12 shadow-2xl"
                    >
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 1 }}
                            className="text-sm tracking-[0.4em] text-white/70 mb-8 uppercase font-sans"
                        >
                            A Journey to Your Fateful Book
                        </motion.p>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 1 }}
                            className="text-5xl sm:text-7xl font-bold mb-8 leading-tight"
                        >
                            <span className="bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent">
                                心に響く、
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-gold via-yellow-200 to-white bg-clip-text text-transparent">
                                運命の一冊を。
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9, duration: 1 }}
                            className="text-lg sm:text-2xl text-white/90 mb-12 leading-relaxed font-light"
                        >
                            あなたの内面を深く理解し、<br className="hidden sm:block" />
                            今この瞬間に必要な言葉を処方する。<br />
                            <span className="text-gold/90">深夜の本屋</span>へようこそ。
                        </motion.p>

                        <motion.button
                            onClick={onEnter}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.2, duration: 0.8, type: "spring" }}
                            whileHover={{
                                scale: 1.08,
                                boxShadow: "0 20px 60px rgba(255, 215, 0, 0.4)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative px-12 py-5 bg-gradient-to-r from-gold via-yellow-500 to-gold text-purple-900 text-xl font-bold rounded-full shadow-2xl overflow-hidden transition-all"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                ✨ 診断を始める
                                <motion.span
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    →
                                </motion.span>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.button>

                        {/* 装飾的な要素 */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-2xl"
                        />
                    </motion.div>

                    {/* サブテキスト */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="mt-12 text-white/60 text-sm"
                    >
                        🌙 静寂の中で、あなただけの物語が始まる
                    </motion.p>
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
            {/* コミュニティ処方箋（トップページ最下部） */}
            <CommunityPrescriptions />

            <footer className="py-12 px-6 bg-midnight text-cream/80 text-center text-sm">
                <p>© 2024 Fateful Book. あなたの運命の一冊に出会う旅を。</p>
            </footer>
        </div>
    );
}


export default function App() {
    const [phase, setPhase] = useState("landing");
    // personality: { characterType, scores: {...}, mbti }
    const [personality, setPersonality] = useState(null);
    const [result, setResult] = useState(null);
    const [detailBook, setDetailBook] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [redirectPhase, setRedirectPhase] = useState(null);
    const [user, setUser] = useState(() => {
        // localStorageから取得（永続化したい場合）
        const u = localStorage.getItem("fateful_user");
        return u ? JSON.parse(u) : null;
    });

    // 仮ユーザー（デフォルト）
    const defaultUsers = {
        testuser: { password: "testpass", mbti: "INFP" },
    };

    const handleLogin = (username, password) => {
        const raw = localStorage.getItem("fateful_users");
        const stored = raw ? JSON.parse(raw) : {};
        const users = { ...defaultUsers, ...stored };
        if (users[username] && users[username].password === password) {
            setUser({ username, mbti: users[username].mbti });
            localStorage.setItem("fateful_user", JSON.stringify({ username, mbti: users[username].mbti }));
            setShowLogin(false);
            setLoginError("");
            if (redirectPhase) {
                setPhase(redirectPhase);
                setRedirectPhase(null);
            }
        } else {
            setLoginError("ユーザー名またはパスワードが違います");
        }
    };
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("fateful_user");
    };

    if (phase === "landing") {
        return (
            <>
                <Landing
                    onEnter={() => setPhase("diagnosis")}
                    onHistoryClick={() => {
                        if (user) {
                            setPhase("history");
                        } else {
                            // prompt login and redirect to history after successful login
                            setShowLogin(true);
                            setLoginError("");
                            setRedirectPhase("history");
                        }
                    }}
                    onProfileClick={() => {
                        if (user) {
                            setPhase("profile");
                        } else {
                            setShowLogin(true);
                            setLoginError("");
                            setRedirectPhase("profile");
                        }
                    }}
                    onSigninClick={() => { setShowLogin(true); setLoginError(""); }}
                    isLoggedIn={!!user}
                    onLogout={handleLogout}
                />
                <LoginModal
                    open={showLogin}
                    onClose={() => setShowLogin(false)}
                    onLogin={handleLogin}
                    loginError={loginError}
                />
            </>
        );
    }

    if (phase === "diagnosis") {
        return (
            <Diagnosis
                onFinish={(personalityData) => {
                    // personalityData: { characterType, scores: {...}, mbti }
                    setPersonality(personalityData);

                    // if user is logged in and has no MBTI yet, persist it
                    if (user && (!user.mbti || user.mbti === "")) {
                        // update localStorage fateful_users
                        const raw = localStorage.getItem("fateful_users");
                        const users = raw ? JSON.parse(raw) : {};
                        users[user.username] = users[user.username] || { password: "", mbti: "" };
                        users[user.username].mbti = personalityData.mbti;
                        localStorage.setItem("fateful_users", JSON.stringify(users));
                        // update fateful_user (current session)
                        setUser({ username: user.username, mbti: personalityData.mbti });
                        localStorage.setItem("fateful_user", JSON.stringify({ username: user.username, mbti: personalityData.mbti }));
                    }
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
