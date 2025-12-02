import { useState } from "react";
import Diagnosis from "./components/Diagnosis.jsx";
import ChatRoom from "./components/ChatRoom.jsx";
import BookResult from "./components/BookResult.jsx";
import BookDetail from "./components/BookDetail.jsx";

function Landing({ onEnter }) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-serif flex items-center justify-center px-4">
            <div className="max-w-xl w-full text-center">
                <div className="mb-6 text-xs tracking-[0.25em] text-slate-500">
                    深 夜 封 切
                </div>
                <h1 className="text-3xl sm:text-4xl font-semibold mb-4 text-slate-900">
                    読書処方箋RPG
                    <span className="block text-indigo-600 text-4xl sm:text-5xl mt-2">
                        Yomokka
                    </span>
                </h1>
                <p className="text-sm sm:text-base text-slate-600 mb-8 leading-relaxed">
                    検索では出会えない一冊を、静かな対話と小さな診断から
                    そっと処方する、深夜の隠れ家本屋です。
                </p>
                <button
                    onClick={onEnter}
                    className="px-8 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-semibold shadow-lg hover:bg-indigo-700 transition-colors"
                >
                    入店する
                </button>
            </div>
        </div>
    );
}

export default function App() {
    const [phase, setPhase] = useState("landing");
    const [personality, setPersonality] = useState("");
    const [result, setResult] = useState(null);
    const [detailBook, setDetailBook] = useState(null);

    if (phase === "landing") {
        return <Landing onEnter={() => setPhase("diagnosis")} />;
    }

    if (phase === "diagnosis") {
        return (
            <Diagnosis
                onFinish={(type) => {
                    setPersonality(type);
                    setPhase("chat");
                }}
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

    return (
        <BookResult
            data={result}
            onDetailClick={(bookData) => {
                setDetailBook(bookData);
                setPhase("detail");
            }}
        />
    );
}

