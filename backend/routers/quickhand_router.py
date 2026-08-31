"""
Quick Hand — lightweight standalone chatbot endpoint.
No company context required; works on every page.
"""
from fastapi import APIRouter
from pydantic import BaseModel
from ai import _call, _call_new, AI_READY, GENAI_SDK
from config import GEMINI_API_KEY

router = APIRouter(prefix="/api/quickhand", tags=["quickhand"])


class QuickHandRequest(BaseModel):
    message: str
    context: str = ""          # optional: current page name / section


class QuickHandResponse(BaseModel):
    reply: str


SYSTEM_PROMPT = """You are Quick Hand, a razor-sharp AI startup advisor embedded in the VentureIQ platform.

Your job: give fast, actionable, startup-focused answers.

Rules:
- Keep answers SHORT (2-5 sentences max unless truly needed).
- Be direct, confident, practical — no filler, no fluff.
- If asked about anything unrelated to startups/business, gently redirect.
- If the user shares which page/section they're on, tailor the answer to that context.
- Use bullet points only when listing 3+ items.
- Never use markdown headers in your response.
"""


def _quick_gemini(message: str, page_context: str) -> str:
    user_prompt = message
    if page_context:
        user_prompt = f"[User is on the '{page_context}' section]\n\n{message}"

    try:
        if GENAI_SDK == "new":
            from google.genai import types
            from ai import _client
            config = types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                temperature=0.65,
                max_output_tokens=400,
            )
            response = _client.models.generate_content(
                model="gemini-3.6-flash",
                contents=user_prompt,
                config=config,
            )
            return response.text.strip()
        else:
            import google.generativeai as genai
            model = genai.GenerativeModel("gemini-1.5-flash", system_instruction=SYSTEM_PROMPT)
            response = model.generate_content(user_prompt)
            return response.text.strip()
    except Exception as e:
        print(f"Quick Hand Gemini error: {e}")
        return "I ran into a small hiccup. Try again in a moment!"


@router.post("/chat", response_model=QuickHandResponse)
def quickhand_chat(payload: QuickHandRequest):
    if not AI_READY:
        return QuickHandResponse(
            reply="Quick Hand needs a Gemini API key to work. Add GEMINI_API_KEY to backend/.env and restart the server."
        )

    reply = _quick_gemini(payload.message.strip(), payload.context.strip())
    return QuickHandResponse(reply=reply)
