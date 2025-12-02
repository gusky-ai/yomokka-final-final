export default function BookDetail({ data, onBack }) {
    const book = data?.book || "タイトル不明";
    const author = data?.author || "";
    const line = data?.line || "";
    const reason = data?.reason || "";
    const imageUrl = data?.imageUrl || null;

    return (
        <div className="min-h-screen bg-slate-50 font-serif p-6">
            <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-lg">
                {/* 戻るボタン */}
                <button
                    onClick={onBack}
                    className="text-sm text-slate-600 hover:text-indigo-600 mb-6 flex items-center gap-1"
                >
                    ← 戻る
                </button>

                {/* 表紙画像 */}
                {imageUrl && (
                    <div className="flex justify-center mb-6">
                        <img
                            src={imageUrl}
                            alt={`${book}の表紙`}
                            className="h-64 object-contain rounded shadow-md"
                        />
                    </div>
                )}

                {/* タイトル */}
                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2 text-center">
                    『{book}』
                </h1>

                {/* 著者 */}
                {author && (
                    <p className="text-sm text-slate-600 mb-6 text-center">
                        著：{author}
                    </p>
                )}

                {/* 一文引用 */}
                {line && (
                    <p className="text-sm sm:text-base italic text-slate-700 mb-8 text-center leading-relaxed">
                        「{line}」
                    </p>
                )}

                {/* 処方理由 */}
                <div className="border-t border-slate-200 pt-6">
                    <h2 className="text-sm font-semibold text-slate-900 mb-3">
                        この本を選んだ理由
                    </h2>
                    <p className="text-sm text-slate-800 leading-relaxed">
                        {reason}
                    </p>
                </div>
            </div>
        </div>
    );
}
