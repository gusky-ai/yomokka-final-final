// Google Books API を使って本の表紙画像を取得する

/**
 * Google Books API から本の表紙画像URLを取得
 * @param {string} title - 本のタイトル
 * @param {string} author - 著者名（オプション）
 * @returns {Promise<string|null>} - 画像URL、または見つからない場合はnull
 */
export async function fetchBookCover(title, author = "") {
    try {
        // 検索クエリを構築
        let query = `intitle:${title}`;
        if (author && author.trim()) {
            query += `+inauthor:${author}`;
        }

        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1`;

        const response = await fetch(url);
        const data = await response.json();

        // 結果が見つかった場合
        if (data.items && data.items.length > 0) {
            const book = data.items[0];
            const imageLinks = book.volumeInfo?.imageLinks;

            // thumbnail があればそれを、なければ smallThumbnail を返す
            if (imageLinks?.thumbnail) {
                return imageLinks.thumbnail;
            } else if (imageLinks?.smallThumbnail) {
                return imageLinks.smallThumbnail;
            }
        }

        // 見つからない場合
        return null;
    } catch (error) {
        console.error("Failed to fetch book cover:", error);
        return null;
    }
}
