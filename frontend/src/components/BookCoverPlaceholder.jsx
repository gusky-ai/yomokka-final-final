export default function BookCoverPlaceholder({ title, author }) {
    return (
        <div className="flex flex-col items-center justify-center w-40 h-56 bg-slate-100 border-2 border-slate-200 rounded-lg shadow-sm">
            <p className="text-xs text-slate-700 text-center px-3 mb-2 font-semibold line-clamp-3">
                {title}
            </p>
            {author && (
                <p className="text-[10px] text-slate-500 text-center px-3 line-clamp-2">
                    {author}
                </p>
            )}
            <p className="text-[9px] text-slate-400 mt-auto mb-3">
                表紙画像なし
            </p>
        </div>
    );
}
