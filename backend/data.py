"""Auto-generated master data for the intuitive book-picker app.

Lists included:
- diagnostic_questions
- character_types
- worry_scenarios

Paste this file into the backend and import as needed.
"""

diagnostic_questions = [
    {
        "id": "Q1",
        "type": "image_select",
        "question": "どちらの絵が直感的に惹かれる？",
        "asset_prompt": "Left: abstract expressionist painting, vibrant brush strokes, dreamlike textures, soft gradients, high detail --v 5. Right: realistic architectural photograph, modern building, sharp lines, natural light, high detail --v 5",
        "choices": [
            {
                "key": "A",
                "label": "抽象画（Abstract）",
                "asset_prompt": "Abstract expressionist painting, vibrant colors, textured brush strokes, dreamlike atmosphere --v 5",
                "scores": {"axis_1": 0, "axis_2": 0, "axis_3": 1, "axis_4": 0}
            },
            {
                "key": "B",
                "label": "リアルな建築写真（Concrete）",
                "asset_prompt": "Realistic architectural photograph, modern urban building, sharp perspective, natural lighting --v 5",
                "scores": {"axis_1": 0, "axis_2": 0, "axis_3": -1, "axis_4": 0}
            }
        ]
    },
    {
        "id": "Q2",
        "type": "scenario_word",
        "question": "落ち込んだとき、どちらを望む？",
        "asset_prompt": "Left: empathetic phrase, warm supportive tone, cozy scene. Right: solution-oriented phrase, clear steps, neutral background.",
        "choices": [
            {
                "key": "A",
                "label": "共感してほしい（Emotional）",
                "asset_prompt": "Warm, empathetic vignette illustration, soft lighting, gentle expressions --v 5",
                "scores": {"axis_1": 1, "axis_2": 0, "axis_3": 0, "axis_4": 0}
            },
            {
                "key": "B",
                "label": "解決策がほしい（Logical）",
                "asset_prompt": "Clean infographic style, step-by-step layout, neutral colors --v 5",
                "scores": {"axis_1": -1, "axis_2": 0, "axis_3": 0, "axis_4": 0}
            }
        ]
    },
    {
        "id": "Q3",
        "type": "color_select",
        "question": "惹かれる色はどっち？",
        "asset_prompt": "Left: energetic red-orange gradient, glowing vibrance. Right: deep blue, calm, almost black-blue with subtle texture.",
        "choices": [
            {
                "key": "A",
                "label": "赤・オレンジ（Action）",
                "asset_prompt": "Vibrant red and orange gradient, energetic glow, high saturation --v 5",
                "scores": {"axis_1": 0, "axis_2": 0, "axis_3": 0, "axis_4": 1}
            },
            {
                "key": "B",
                "label": "ディープブルー（Reflection）",
                "asset_prompt": "Deep navy blue, serene texture, low saturation, contemplative mood --v 5",
                "scores": {"axis_1": 0, "axis_2": 0, "axis_3": 0, "axis_4": -1}
            }
        ]
    },
    {
        "id": "Q4",
        "type": "image_select",
        "question": "どちらのビジュアルが好き？",
        "asset_prompt": "Left: minimalist typographic poster, bold sans-serif, clear hierarchy. Right: hand-drawn fantasy map, intricate details, handwritten labels.",
        "choices": [
            {
                "key": "A",
                "label": "シンプルなタイポグラフィ（Tempo）",
                "asset_prompt": "Minimal typographic poster, bold type, negative space, clean layout --v 5",
                "scores": {"axis_1": 0, "axis_2": 1, "axis_3": 0, "axis_4": 0}
            },
            {
                "key": "B",
                "label": "書き込まれたファンタジー地図（Story）",
                "asset_prompt": "Antique fantasy map, hand-drawn details, ink texture, whimsical style --v 5",
                "scores": {"axis_1": 0, "axis_2": -1, "axis_3": 0, "axis_4": 0}
            }
        ]
    },
    {
        "id": "Q5",
        "type": "scenario_word",
        "question": "読書の目的はどちらに近い？",
        "asset_prompt": "Left: evocative phrase about discovery and imagination. Right: practical phrase about acquiring skills and tools.",
        "choices": [
            {
                "key": "A",
                "label": "未知の世界へ（Abstract）",
                "asset_prompt": "Dreamy book cover concept, stars and open pages, surreal composition --v 5",
                "scores": {"axis_1": 0, "axis_2": 0, "axis_3": 1, "axis_4": 0}
            },
            {
                "key": "B",
                "label": "使えるスキル（Concrete）",
                "asset_prompt": "Practical manual-style cover, clear icons, step-by-step vibe --v 5",
                "scores": {"axis_1": 0, "axis_2": 0, "axis_3": -1, "axis_4": 0}
            }
        ]
    },
    {
        "id": "Q6",
        "type": "image_select",
        "question": "どちらの風景に惹かれる？",
        "asset_prompt": "Left: sunlit boulevard with people, dynamic perspective. Right: forest path with dappled sunlight, quiet and intimate.",
        "choices": [
            {
                "key": "A",
                "label": "大通り（Action）",
                "asset_prompt": "Sunlit city boulevard, bustling, high contrast, dynamic composition --v 5",
                "scores": {"axis_1": 0, "axis_2": 0, "axis_3": 0, "axis_4": 1}
            },
            {
                "key": "B",
                "label": "森の小道（Reflection）",
                "asset_prompt": "Forest path with dappled sunlight, quiet atmosphere, soft focus --v 5",
                "scores": {"axis_1": 0, "axis_2": 0, "axis_3": 0, "axis_4": -1}
            }
        ]
    },
    {
        "id": "Q7",
        "type": "color_select",
        "question": "色の好みはどれ？",
        "asset_prompt": "Left: warm pastel palette, gentle and cozy. Right: high-contrast black and white, stark and clear.",
        "choices": [
            {
                "key": "A",
                "label": "暖かいパステル（Emotional）",
                "asset_prompt": "Soft pastel palette, warm tones, cozy textures --v 5",
                "scores": {"axis_1": 1, "axis_2": 0, "axis_3": 0, "axis_4": 0}
            },
            {
                "key": "B",
                "label": "白黒ハイコントラスト（Logical）",
                "asset_prompt": "Monochrome high-contrast composition, graphic clarity --v 5",
                "scores": {"axis_1": -1, "axis_2": 0, "axis_3": 0, "axis_4": 0}
            }
        ]
    },
    {
        "id": "Q8",
        "type": "scenario_word",
        "question": "会話で嫌なのはどっち？",
        "asset_prompt": "Left: blunt phrase emphasizing ending and punchline. Right: phrase valuing lingering aftertaste and resonance.",
        "choices": [
            {
                "key": "A",
                "label": "オチがない（Tempo）",
                "asset_prompt": "Minimal speech bubble icon, abrupt ending motif --v 5",
                "scores": {"axis_1": 0, "axis_2": 1, "axis_3": 0, "axis_4": 0}
            },
            {
                "key": "B",
                "label": "余韻がない（Story）",
                "asset_prompt": "Soft lingering tone illustration, echoing shapes --v 5",
                "scores": {"axis_1": 0, "axis_2": -1, "axis_3": 0, "axis_4": 0}
            }
        ]
    },
    {
        "id": "Q9",
        "type": "image_select",
        "question": "どちらのアイコンが好き？",
        "asset_prompt": "Left: fluffy cloud icon, soft edges, pastel. Right: geometric shapes, precise edges, modernist.",
        "choices": [
            {
                "key": "A",
                "label": "ふわふわした雲（Abstract）",
                "asset_prompt": "Soft fluffy cloud icon, pastel tones, friendly shape --v 5",
                "scores": {"axis_1": 0, "axis_2": 0, "axis_3": 1, "axis_4": 0}
            },
            {
                "key": "B",
                "label": "幾何学的な図形（Concrete）",
                "asset_prompt": "Geometric shape composition, precise angles, modernist colors --v 5",
                "scores": {"axis_1": 0, "axis_2": 0, "axis_3": -1, "axis_4": 0}
            }
        ]
    },
    {
        "id": "Q10",
        "type": "scenario_word",
        "question": "長期休暇の過ごし方は？",
        "asset_prompt": "Left: adventurous phrase with open road imagery. Right: cozy home phrase with stacks of books and tea.",
        "choices": [
            {
                "key": "A",
                "label": "冒険に出る（Action）",
                "asset_prompt": "Open road, travel poster style, dynamic illustration --v 5",
                "scores": {"axis_1": 0, "axis_2": 0, "axis_3": 0, "axis_4": 1}
            },
            {
                "key": "B",
                "label": "家で積読消化（Reflection）",
                "asset_prompt": "Cozy reading nook, stacks of books, warm light --v 5",
                "scores": {"axis_1": 0, "axis_2": 0, "axis_3": 0, "axis_4": -1}
            }
        ]
    }
]

character_types = [
    {
        "id": "CT01",
        "name": "夢見る語り部",
        "catchphrase": "君の物語を紡ごう。",
        "image_prompt": "Fantasy portrait, soft painterly style, glowing particles, whimsical costume, warm color palette --v 5",
        "matching_logic": {"axis_1": "emotional", "axis_3": "abstract"},
        "chat_config": {
            "first_person": "私",
            "tone": "優しく包み込む、詩的",
            "opening_line": "よく来たね。君の物語を聞かせて？"
        }
    },
    {
        "id": "CT02",
        "name": "冷徹な戦略家",
        "catchphrase": "事実を整理しよう。",
        "image_prompt": "Cyberpunk strategist portrait, neon lighting, sharp features, high-contrast, futuristic city background --v 5",
        "matching_logic": {"axis_1": "logical", "axis_3": "concrete"},
        "chat_config": {
            "first_person": "俺",
            "tone": "論理的で簡潔、ややクール",
            "opening_line": "現状の課題を定義しよう。具体的に教えてくれ。"
        }
    },
    {
        "id": "CT03",
        "name": "情熱の冒険家",
        "catchphrase": "さあ、行こう！",
        "image_prompt": "Energetic oil painting portrait, bold brush strokes, warm reds and oranges, dynamic pose --v 5",
        "matching_logic": {"axis_1": "emotional", "axis_4": "action"},
        "chat_config": {
            "first_person": "僕",
            "tone": "熱血で背中を押す、陽気",
            "opening_line": "おっしゃ！どこへ冒険に出ようか？遠慮せず言ってみて。"
        }
    },
    {
        "id": "CT04",
        "name": "静寂の賢者",
        "catchphrase": "まずは深呼吸を。",
        "image_prompt": "Monochrome photographic portrait, soft grain, contemplative expression, minimal composition --v 5",
        "matching_logic": {"axis_1": "logical", "axis_4": "reflection"},
        "chat_config": {
            "first_person": "私",
            "tone": "落ち着いた、丁寧で分析的",
            "opening_line": "…静かな時間は好きかい？ゆっくり話してみよう。"
        }
    },
    {
        "id": "CT05",
        "name": "癒やしのヒーラー",
        "catchphrase": "あなたの心に寄り添うよ。",
        "image_prompt": "Soothing healer portrait, watercolor style, soft pastels, comforting aura, gentle smile --v 5",
        "matching_logic": {"axis_1": "emotional", "axis_2": "story"},
        "chat_config": {
            "first_person": "私",
            "tone": "優しく包み込む、共感的",
            "opening_line": "よく来てくれたね。今の気持ちを教えてくれる？"
        }
    },
    {
        "id": "CT06",
        "name": "日常の整え屋",
        "catchphrase": "小さな習慣で整えよう。",
        "image_prompt": "Clean lifestyle illustration, minimal colors, organized objects, warm neutrals --v 5",
        "matching_logic": {"axis_2": "tempo", "axis_3": "concrete"},
        "chat_config": {
            "first_person": "僕",
            "tone": "実用的で親しみやすい、段取り上手",
            "opening_line": "気になることを一つずつ整理していこう。まずは何が一番気になる？"
        }
    },
    {
        "id": "CT07",
        "name": "未来の建築家",
        "catchphrase": "理想を設計しよう。",
        "image_prompt": "Futuristic architect portrait, clean lines, geometric composition, soft futuristic lighting --v 5",
        "matching_logic": {"axis_3": "concrete", "axis_4": "action"},
        "chat_config": {
            "first_person": "私",
            "tone": "構築的でビジョン志向、冷静な熱意",
            "opening_line": "どんな未来を設計したい？一緒にプランを組もう。"
        }
    },
    {
        "id": "CT08",
        "name": "物語る仲介者",
        "catchphrase": "言葉の余韻を大切に。",
        "image_prompt": "Narrative illustrator portrait, warm lamplight, textured paper look, storybook vibes --v 5",
        "matching_logic": {"axis_2": "story", "axis_1": "emotional"},
        "chat_config": {
            "first_person": "私",
            "tone": "穏やかで物語的、共感を引き出す",
            "opening_line": "よかったら、最近あったことを一つ、物語のように聞かせてくれる？"
        }
    }
]

worry_scenarios = [
    {
        "id": "W01",
        "category": "Job",
        "button_text": "仕事でミスして落ち込んだ",
        "search_keywords": "仕事 ミス 立ち直り コミュニケーション"
    },
    {
        "id": "W02",
        "category": "Job",
        "button_text": "キャリアの方向に迷っている",
        "search_keywords": "キャリア 方向性 転職 選択"
    },
    {
        "id": "W03",
        "category": "Heart",
        "button_text": "恋愛で傷ついた",
        "search_keywords": "恋愛 失恋 立ち直り 心のケア"
    },
    {
        "id": "W04",
        "category": "Heart",
        "button_text": "人間関係が疲れる",
        "search_keywords": "人間関係 ストレス 対処法 職場 人付き合い"
    },
    {
        "id": "W05",
        "category": "Life",
        "button_text": "将来が不安だ",
        "search_keywords": "将来 不安 目標設定 自己分析"
    },
    {
        "id": "W06",
        "category": "Life",
        "button_text": "趣味・生きがいを見つけたい",
        "search_keywords": "趣味 見つける 生きがい ワークショップ"
    },
    {
        "id": "W07",
        "category": "Rest",
        "button_text": "休み方がわからない",
        "search_keywords": "休み 方 休息 リラックス 方法"
    },
    {
        "id": "W08",
        "category": "Rest",
        "button_text": "眠れない・疲れが取れない",
        "search_keywords": "睡眠 改善 休息 疲労回復"
    },
    {
        "id": "W09",
        "category": "Job",
        "button_text": "職場で評価されない",
        "search_keywords": "評価 仕事 モチベーション 昇進"
    },
    {
        "id": "W10",
        "category": "Heart",
        "button_text": "相手との距離感に悩む",
        "search_keywords": "距離感 対人 関係 コミュニケーション"
    },
    {
        "id": "W11",
        "category": "Life",
        "button_text": "生活習慣を整えたい",
        "search_keywords": "生活習慣 改善 ルーティン 時間管理"
    },
    {
        "id": "W12",
        "category": "Rest",
        "button_text": "ゆったり過ごせる本を探したい",
        "search_keywords": "癒し エッセイ 旅 日常 ほっこり"
    }
]
