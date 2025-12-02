// MBTI反転ユーティリティ

/**
 * MBTIタイプを真逆に反転する
 * 例: INTJ → ESFP, ENFP → ISTJ
 * @param {string} personality - MBTIタイプ (例: "INTJ")
 * @returns {string} - 反転されたMBTIタイプ
 */
export function invertMBTI(personality) {
    if (!personality || typeof personality !== 'string') {
        return personality;
    }

    const inversions = {
        'E': 'I', 'I': 'E',
        'S': 'N', 'N': 'S',
        'T': 'F', 'F': 'T',
        'J': 'P', 'P': 'J'
    };

    return personality
        .split('')
        .map(char => inversions[char] || char)
        .join('');
}
