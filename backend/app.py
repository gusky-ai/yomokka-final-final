
import streamlit as st
from groq import Groq
import plotly.graph_objects as go
import datetime
import os
from dotenv import load_dotenv

# 環境変数を読み込む
load_dotenv()

# --- ページ設定 ---
st.set_page_config(page_title="Shadow Books AI", layout="wide", page_icon="🌓")

# --- API設定 ---
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

# --- システムプロンプト ---
SYSTEM_PROMPT = """
あなたは「熟練の選書カウンセラー（Book Therapist）」です。
ユーザーのMBTI（性格）と真逆の性質を持つ本（Shadow Book）を提案し、
なぜその本がユーザーの「影」を補い、成長させるのかを解説してください。
"""

# --- データ定義: MBTIとShadow ---
mbti_shadow_map = {
    "INTJ": "ESFP", "INTP": "ESFJ", "ENTJ": "ISFP", "ENTP": "ISFJ",
    "INFJ": "ESTP", "INFP": "ESTJ", "ENFJ": "ISTP", "ENFP": "ISTJ",
    "ISTJ": "ENFP", "ISFJ": "ENTP", "ESTJ": "INFP", "ESFJ": "INTP",
    "ISTP": "ENFJ", "ISFP": "ENTJ", "ESTP": "INFJ", "ESFP": "INTJ"
}


# --- 仮ユーザー管理・セッション初期化 ---
if 'users' not in st.session_state:
    st.session_state['users'] = {
        'testuser': {'password': 'testpass', 'mbti': 'INFP'}
    }
if 'user' not in st.session_state:
    st.session_state['user'] = None  # None=ゲスト, dict={'username':..., 'mbti':...}
if 'login_error' not in st.session_state:
    st.session_state['login_error'] = ''
if 'reviews' not in st.session_state:
    st.session_state['reviews'] = [
        {"user_mbti": "INFP", "book": "『夜と霧』", "symptom": "将来への不安", "efficacy": "どんな絶望でも精神の自由は奪えないと知り、呼吸が楽になった。", "date": "2024-03-10"},
        {"user_mbti": "ENTJ", "book": "『HARD THINGS』", "symptom": "孤独な意思決定", "efficacy": "答えのない恐怖に耐えるのがリーダーだと肯定され、迷いが消えた。", "date": "2024-03-12"}
    ]

# --- サイドバー: 仮ログイン/新規登録フォーム ---
with st.sidebar:
    st.markdown('### 👤 ログイン / 新規登録')
    if st.session_state['user'] is None:
        tab_login, tab_signup = st.tabs(["ログイン", "新規登録"])
        with tab_login:
            login_username = st.text_input("ユーザー名", key="login_username")
            login_password = st.text_input("パスワード", type="password", key="login_password")
            if st.button("ログイン", key="login_btn"):
                users = st.session_state['users']
                if login_username in users and users[login_username]['password'] == login_password:
                    st.session_state['user'] = {
                        'username': login_username,
                        'mbti': users[login_username]['mbti']
                    }
                    st.session_state['login_error'] = ''
                    st.success('ログインしました！')
                else:
                    st.session_state['login_error'] = 'ユーザー名またはパスワードが違います'
            if st.session_state['login_error']:
                st.error(st.session_state['login_error'])
        with tab_signup:
            signup_username = st.text_input("新しいユーザー名", key="signup_username")
            signup_password = st.text_input("新しいパスワード", type="password", key="signup_password")
            signup_mbti = st.selectbox("あなたのMBTI", list(mbti_shadow_map.keys()), key="signup_mbti")
            if st.button("新規登録", key="signup_btn"):
                users = st.session_state['users']
                if signup_username in users:
                    st.error("このユーザー名は既に使われています")
                elif not signup_username or not signup_password:
                    st.error("ユーザー名とパスワードを入力してください")
                else:
                    users[signup_username] = {
                        'password': signup_password,
                        'mbti': signup_mbti
                    }
                    st.success("登録完了！ログインしてください")
    else:
        st.success(f"ログイン中: {st.session_state['user']['username']}")
        if st.button("ログアウト"):
            st.session_state['user'] = None
            st.session_state['login_error'] = ''

# ==========================================
# メインコンテンツ: 選書機能
# ==========================================

st.title("🌓 Shadow Books")
st.markdown("あなたの「影（Shadow）」を補う一冊を処方します。")
st.divider()

col1, col2 = st.columns([1, 1.5], gap="large")

with col1:
    st.subheader("👤 Profile Diagnosis")
    my_mbti = st.selectbox("あなたのMBTIタイプを選択", list(mbti_shadow_map.keys()))
    shadow_mbti = mbti_shadow_map[my_mbti]
    
    st.info(f"あなたのShadow（影）は... **【 {shadow_mbti} 】** です。")
    
    if st.button("Shadow Bookを処方する", type="primary", use_container_width=True):
        with st.spinner("AIが選書中..."):
            try:
                # Groq APIへのリクエスト
                chat_completion = client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": f"私のMBTIは{my_mbti}です。真逆の{shadow_mbti}的な視点を得られる本を1冊紹介してください。"}
                    ],
                    model="llama-3.3-70b-versatile",
                    temperature=0.7,
                )
                suggestion = chat_completion.choices[0].message.content
                
                # 結果を保存
                st.session_state['result'] = {
                    "content": suggestion,
                    "shadow_type": shadow_mbti
                }
            except Exception as e:
                st.error(f"エラーが発生しました: {e}")

with col2:
    if 'result' in st.session_state:
        res = st.session_state['result']
        st.success("処方が完了しました")
        with st.container(border=True):
            st.markdown(f"### 📖 {res['shadow_type']}的視点の獲得")
            st.markdown(res['content'])
        
        # 脳内ステータス (レーダーチャート)
        categories = ['論理', '共感', '想像', '行動', '規律']
        fig = go.Figure()
        fig.add_trace(go.Scatterpolar(r=[3, 2, 3, 1, 4], theta=categories, fill='toself', name='現在のあなた'))
        fig.add_trace(go.Scatterpolar(r=[4, 5, 4, 4, 4], theta=categories, fill='toself', name='読書後の拡張', line_color='pink'))
        fig.update_layout(polar=dict(radialaxis=dict(visible=True, range=[0, 5])), showlegend=True, height=300)
        st.plotly_chart(fig, use_container_width=True)

st.divider()

# ==========================================
# 下部コンテンツ: 処方箋レビュー
# ==========================================
st.divider()
st.header("みんなの処方箋（コミュニティ）")

# セッションステート初期化（既存の 'reviews' があれば流用、なければダミーを用意）
if "prescriptions" not in st.session_state:
    st.session_state["prescriptions"] = st.session_state.get("reviews", [
        {
            "mbti": "INFP",
            "title": "夜と霧",
            "symptom": "不安・孤独感",
            "effect": "生きる意味について考え直すきっかけになり、孤独感が和らいだ。"
        },
        {
            "mbti": "ENFJ",
            "title": "夜明け前",
            "symptom": "自己肯定感の低下",
            "effect": "主人公の強さに励まされ、自分を許すことができた。"
        },
        {
            "mbti": "INTP",
            "title": "ファクトフルネス",
            "symptom": "世の中への不安",
            "effect": "データで世界を見られるようになり、不安が少し減った。"
        },
    ])

# 選択肢定義
mbti_options = ["INTJ","INTP","ENTJ","ENTP","INFJ","INFP","ENFJ","ENFP","ISTJ","ISFJ","ESTJ","ESFJ","ISTP","ISFP","ESTP","ESFP"]
symptom_options = ["不安・孤独感","抑うつ気味","自己肯定感の低下","仕事の悩み","人間関係","睡眠障害","その他"]

# タブ構成
tab_view, tab_write = st.tabs(["💊 効能を見る", "✍️ 処方箋を書く"])

# 「効能を見る」タブ
with tab_view:
    reviews = st.session_state.get("prescriptions", [])
    if not reviews:
        st.info("まだ投稿がありません。あなたの処方箋をシェアしてみましょう。")
    else:
        for i, r in enumerate(reviews):
            with st.container():
                cols = st.columns([1, 4])
                cols[0].markdown(f"**{r.get('mbti','')}**")
                cols[1].markdown(
                    f"**{r.get('title','タイトル未設定')}**  \n\n"
                    f"**症状:** {r.get('symptom','')}  \n\n"
                    f"**効能:** {r.get('effect','')}"
                )
            if i != len(reviews) - 1:
                st.markdown("---")

# 「処方箋を書く」タブ
with tab_write:
    with st.form("write_prescription_form"):
        mbti = st.selectbox("あなたのMBTI", mbti_options, index=mbti_options.index("INFP") if "INFP" in mbti_options else 0)
        title = st.text_input("本のタイトル", "")
        symptom = st.selectbox("症状（悩み）", symptom_options)
        effect = st.text_area("効能（どう救われたか）", "")
        submitted = st.form_submit_button("投稿する")
        if submitted:
            new_review = {
                "mbti": mbti,
                "title": title or "タイトル未入力",
                "symptom": symptom,
                "effect": effect or ""
            }
            # 新しい投稿を先頭に追加して即時反映
            st.session_state["prescriptions"].insert(0, new_review)
            st.success("投稿しました。みんなの処方箋で確認できます。")
            