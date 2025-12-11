import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

API_KEY = os.environ.get("GROQ_API_KEY")
if not API_KEY:
    print("GROQ_API_KEY not set in environment or .env")
    exit(1)

client = Groq(api_key=API_KEY)

candidates = [
    "llama3-70b-8192",
    "llama3-70b",
    "llama3-70b-instruct",
    "llama3-70b-v2",
    "llama3-13b",
    "llama3-13b-instruct",
    "llama3-70b-2048",
]

system = {"role": "system", "content": "あなたはテスト用の簡易アシスタントです。短く挨拶してください。"}
user = {"role": "user", "content": "こんにちは"}

for model in candidates:
    try:
        print(f"\nTrying model: {model}")
        completion = client.chat.completions.create(
            model=model,
            messages=[system, user],
            temperature=0.0,
            max_tokens=50,
        )
        # Access response depending on client
        try:
            text = completion.choices[0].message.content
        except Exception:
            # fallback: whole object
            text = str(completion)
        print("SUCCESS:\n", text)
        break
    except Exception as e:
        print("ERROR:", e)
