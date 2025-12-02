import { useState } from "react";
import { invertMBTI } from "../utils/mbti";
import BookCoverPlaceholder from "./BookCoverPlaceholder";

export default function BookResult({ data, onDetailClick }) {
    const [shadow, setShadow] = useState(false);
    const [shadowBook, setShadowBook] = useState(null);
    const [loadingShadow, setLoadingShadow] = useState(false);
    const [imageError, setImageError] = useState(false);

    // 通常モードの本データ
    const normalBook = {
        book: data?.book || "世界の終りとハードボイルド・ワンダーランド",
        author: data?.author || "村上春樹",
        line: data?.line || "現実と非現実のあいだで、そっと頭を冷やしたい夜に。",
        reason: data?.reason || "あなたの言葉の温度や揺らぎから、静かに思考を整理できる物語が必要だと感じました。村上春樹の独特な世界観は、論理と感情の狭間で揺れるあなたの心に、穏やかな着地点を与えてくれるはずです。",
        imageUrl: data?.imageUrl || null
    };

    // Shadowボタン押下時の処理
    const toggleShadow = async () => {
        if (!shadow && !shadowBook) {
            // Shadow用の本を取得
            setLoadingShadow(true);
            try {
                const invertedPersonality = invertMBTI(data?.personality);
                const res = await fetch('http://localhost:3000/api/prescription', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        personality: invertedPersonality,
                        history: data?.history || []
                    })
                });
                const shadowData = await res.json();
                setShadowBook(shadowData);
            } catch (error) {
                console.error("Failed to fetch shadow book:", error);
            } finally {
                setLoadingShadow(false);
            }
        }
        setShadow(!shadow);
        setImageError(false); // Reset image error when switching modes
    };

    // 表示する本データ
    const displayBook = shadow && shadowBook ? shadowBook : normalBook;

    return (
        <div
            className={`min-h-screen font-serif flex items-center justify-center px-4 py-8 transition-colors duration-700 ${shadow ? "bg-night text-slate-50" : "bg-slate-50 text-slate-900"
                }`}
        >
            <div
                className={`w-full max-w-xl rounded-3xl border shadow-lg overflow-hidden relative ${shadow
                        ? "bg-slate-950/90 border-slate-700/80"
                        : "bg-white border-slate-200"
                    }`}
            >
                {/* 光のにじみ */}
                <div className="pointer-events-none absolute inset-0 opacity-40">
                    <div
                        className={`absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl ${shadow ? "bg-indigo-500/30" : "bg-slate-300/30"
                            }`}
                    />
                    <div
                        className={`absolute bottom-0 right-0 w-56 h-56 rounded-full blur-3xl ${shadow ? "bg-slate-700/40" : "bg-slate-200/30"
                            }`}
                    />
                </div>

                <div className="relative z-10 p-6 sm:p-8">
                    <p className={`text-[11px] tracking-[0.28em] uppercase mb-2 ${shadow ? "text-slate-400" : "text-slate-500"}`}>
                        B O O K &nbsp; P R E S C R I P T I O N
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-semibold mb-3">
                        {shadow ? "もう1つの処方箋" : "今夜の処方箋"}
                    </h1>
                    <p className={`text-xs sm:text-sm mb-6 ${shadow ? "text-slate-300" : "text-slate-600"}`}>
                        {shadow
                            ? "あなたの真逆の性質に効く、もう1冊の処方箋です。"
                            : "あなたの言葉の温度や揺らぎから見立てた、本の処方箋です。"}
                    </p>

                    {/* 1冊の本 */}
                    {loadingShadow ? (
                        <div className="flex justify-center items-center py-12">
                            <p className={`text-sm ${shadow ? "text-slate-400" : "text-slate-600"}`}>
                                別の本を探しています...
                            </p>
                        </div>
                    ) : (
                        <div
                            className={`rounded-2xl overflow-hidden border ${shadow
                                    ? "bg-slate-900/60 border-slate-700/80"
                                    : "bg-slate-50 border-slate-200"
                                }`}
                        >
                            {/* 表紙画像 or プレースホルダー */}
                            <div className="w-full flex justify-center py-6 px-4">
                                {displayBook.imageUrl && !imageError ? (
                                    <img
                                        src={displayBook.imageUrl}
                                        alt={`${displayBook.book}の表紙`}
                                        onError={() => setImageError(true)}
                                        className="h-56 object-contain rounded shadow-md"
                                    />
                                ) : (
                                    <BookCoverPlaceholder
                                        title={displayBook.book}
                                        author={displayBook.author}
                                    />
                                )}
                            </div>

                            <div className="px-4 pb-4">
                                <p className={`text-lg font-semibold mb-1 ${shadow ? "text-slate-50" : "text-slate-900"}`}>
                                    『{displayBook.book}』
                                </p>
                                {displayBook.author && (
                                    <p className={`text-xs mb-3 ${shadow ? "text-slate-400" : "text-slate-600"}`}>
                                        著：{displayBook.author}
                                    </p>
                                )}
                                <p className={`text-sm sm:text-base mb-4 italic leading-relaxed ${shadow ? "text-slate-200" : "text-slate-700"}`}>
                                    「{displayBook.line}」
                                </p>

                                {/* 続きを読むボタン */}
                                <button
                                    onClick={() => onDetailClick && onDetailClick(displayBook)}
                                    className={`text-sm font-semibold transition-colors ${shadow
                                            ? "text-indigo-400 hover:text-indigo-300"
                                            : "text-indigo-600 hover:text-indigo-800"
                                        }`}
                                >
                                    続きを読む →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Shadowボタン（控えめ） */}
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={toggleShadow}
                            disabled={loadingShadow}
                            className={`text-xs px-3 py-1.5 rounded-full transition-all ${shadow
                                    ? "bg-white/10 backdrop-blur-sm border border-slate-600/60 text-slate-300 hover:bg-white/20"
                                    : "border border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-800"
                                } ${loadingShadow ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {loadingShadow ? "読み込み中..." : shadow ? "通常に戻る" : "Shadow"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
