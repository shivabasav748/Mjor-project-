"""
Gemini AI helper — uses the new google-genai SDK (google.genai).
Install: pip install google-genai
"""
import json
import re

try:
    from google import genai
    from google.genai import types
    GENAI_SDK = "new"
except ImportError:
    import google.generativeai as genai
    GENAI_SDK = "old"

from config import GEMINI_API_KEY

# ── SDK setup ──────────────────────────────────────────────────────────────────
AI_READY = bool(GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here")

if AI_READY:
    if GENAI_SDK == "new":
        _client = genai.Client(api_key=GEMINI_API_KEY)
    else:
        genai.configure(api_key=GEMINI_API_KEY)
        _model_obj = genai.GenerativeModel("gemini-1.5-flash")
else:
    _client = None


def _call_new(prompt: str, system: str = "") -> str:
    """Call using new google.genai SDK."""
    config = types.GenerateContentConfig(
        system_instruction=system if system else None,
        temperature=0.7,
    )
    response = _client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config=config,
    )
    return response.text


def _call_old(prompt: str) -> str:
    """Call using legacy google.generativeai SDK."""
    response = _model_obj.generate_content(prompt)
    return response.text


def _call(prompt: str, system: str = "") -> str:
    if GENAI_SDK == "new":
        return _call_new(prompt, system)
    return _call_old(prompt)


def _parse_json(text: str) -> dict | list:
    """Strip markdown fences and parse JSON from Gemini response."""
    cleaned = re.sub(r"```(?:json)?\s*", "", text).strip().rstrip("`").strip()
    return json.loads(cleaned)


# ── Market Research ───────────────────────────────────────────────────────────

def analyze_market(company_name: str, industry: str, stage: str, description: str) -> dict:
    if not AI_READY:
        return _fallback_market(company_name, industry)

    prompt = f"""You are an expert startup market analyst. Provide a detailed, insightful market analysis.

Company: {company_name}
Industry: {industry or 'General'}
Stage: {stage or 'Early stage'}
Description: {description or 'No description provided'}

Return ONLY valid JSON (no markdown, no explanation) with this exact structure:
{{
  "summary": "A 2-3 sentence executive summary of the market landscape and where this company fits",
  "competitors": [
    {{"name": "Competitor name", "notes": "Key differentiators, market position, strengths/weaknesses"}},
    {{"name": "Competitor name", "notes": "..."}},
    {{"name": "Competitor name", "notes": "..."}},
    {{"name": "Competitor name", "notes": "..."}}
  ],
  "trends": [
    "Specific market trend relevant to this industry with context",
    "Another trend",
    "Third trend",
    "Fourth trend"
  ],
  "opportunities": [
    "Specific white-space opportunity this company could capture",
    "Another strategic opportunity",
    "Third opportunity"
  ]
}}

Be specific to the {industry} industry. Name real competitors. Make trends concrete."""

    try:
        raw = _call(prompt)
        data = _parse_json(raw)
        return {
            "company": company_name,
            "industry": industry,
            "summary": data.get("summary", ""),
            "competitors": data.get("competitors", []),
            "trends": data.get("trends", []),
            "opportunities": data.get("opportunities", []),
        }
    except Exception as e:
        print(f"Gemini market error: {e}")
        return _fallback_market(company_name, industry)


def _fallback_market(company_name: str, industry: str) -> dict:
    return {
        "company": company_name,
        "industry": industry or "your industry",
        "summary": f"Add your GEMINI_API_KEY in backend/.env to get a real AI-powered market analysis for {company_name}.",
        "competitors": [
            {"name": "Competitor A", "notes": "Add your Gemini API key to see real competitor analysis"},
            {"name": "Competitor B", "notes": "AI-powered analysis available once key is configured"},
        ],
        "trends": ["Configure GEMINI_API_KEY in backend/.env for real market trends"],
        "opportunities": ["Add your API key to unlock personalized opportunity analysis"],
    }


# ── Growth Suggestions ────────────────────────────────────────────────────────

def get_growth_suggestions(
    company_name: str, industry: str, stage: str, description: str,
    has_data: bool, has_docs: bool, chat_summary: str = ""
) -> list:
    if not AI_READY:
        return _fallback_growth(has_data, has_docs)

    context_parts = []
    if has_data:
        context_parts.append("- Founder has uploaded business metrics/data")
    if has_docs:
        context_parts.append("- Founder has uploaded documents to knowledge base")
    if chat_summary:
        context_parts.append(f"- Recent context: {chat_summary[:300]}")
    context = "\n".join(context_parts) or "- No data or documents uploaded yet"

    prompt = f"""You are a senior startup growth advisor. Generate prioritized, actionable growth suggestions.

Company: {company_name}
Industry: {industry or 'General'}
Stage: {stage or 'Early stage'}
Description: {description or 'No description'}
Context:
{context}

Return ONLY a valid JSON array with 5-7 items:
[
  {{
    "title": "Short, action-oriented title (max 8 words)",
    "detail": "1-2 sentences explaining WHY this matters and HOW to do it for this specific company",
    "priority": "high"
  }}
]

Priority must be exactly "high", "medium", or "low". Order by priority. Be specific to {industry} at {stage} stage."""

    try:
        raw = _call(prompt)
        suggestions = _parse_json(raw)
        if not isinstance(suggestions, list):
            raise ValueError("Expected list")
        result = []
        for s in suggestions:
            if isinstance(s, dict) and "title" in s and "detail" in s:
                p = s.get("priority", "medium")
                result.append({
                    "title": str(s["title"]),
                    "detail": str(s["detail"]),
                    "priority": p if p in ("high", "medium", "low") else "medium",
                })
        return result
    except Exception as e:
        print(f"Gemini growth error: {e}")
        return _fallback_growth(has_data, has_docs)


def _fallback_growth(has_data: bool, has_docs: bool) -> list:
    out = []
    if not has_data:
        out.append({"title": "Upload your sales or usage metrics", "detail": "Add data so AI suggestions are grounded in real numbers.", "priority": "high"})
    if not has_docs:
        out.append({"title": "Add your business plan to knowledge base", "detail": "More context gives your AI co-founder sharper suggestions.", "priority": "high"})
    out.append({"title": "Run a market analysis", "detail": "Understand your competitive landscape and differentiation.", "priority": "medium"})
    out.append({"title": "Configure Gemini AI", "detail": "Add your GEMINI_API_KEY to backend/.env to unlock AI growth insights.", "priority": "high"})
    return out


# ── Chat Co-founder ───────────────────────────────────────────────────────────

def chat_reply(
    company_name: str, industry: str, stage: str, description: str,
    document_texts: list, history: list, user_message: str
) -> str:
    if not AI_READY:
        return (
            f"AI not configured. Add your GEMINI_API_KEY in backend/.env to enable real responses. "
            f"You asked: \"{user_message}\""
        )

    doc_context = ""
    if document_texts:
        combined = "\n\n---\n\n".join(document_texts[:5])
        doc_context = f"\n\nKnowledge base documents:\n{combined[:4000]}"

    system = f"""You are the AI co-founder for {company_name}, an expert startup advisor
with deep knowledge of {industry or 'startup'} best practices.

Company: {company_name} | Industry: {industry or 'N/A'} | Stage: {stage or 'Early'} | Description: {description or 'N/A'}
{doc_context}

Give sharp, direct, founder-focused advice. Reference the company context when relevant. Be concise but substantive."""

    try:
        if GENAI_SDK == "new":
            # Build conversation contents
            contents = []
            for msg in history[:-1]:
                role = "user" if msg.get("role") == "user" else "model"
                contents.append(types.Content(role=role, parts=[types.Part(text=msg.get("content", ""))]))
            contents.append(types.Content(role="user", parts=[types.Part(text=user_message)]))

            config = types.GenerateContentConfig(
                system_instruction=system,
                temperature=0.7,
            )
            response = _client.models.generate_content(
                model="gemini-3.6-flash",
                contents=contents,
                config=config,
            )
            return response.text
        else:
            model_with_sys = genai.GenerativeModel("gemini-1.5-flash", system_instruction=system)
            gemini_history = []
            for msg in history[:-1]:
                role = "user" if msg.get("role") == "user" else "model"
                gemini_history.append({"role": role, "parts": [msg.get("content", "")]})
            chat = model_with_sys.start_chat(history=gemini_history)
            response = chat.send_message(user_message)
            return response.text
    except Exception as e:
        print(f"Gemini chat error: {e}")
        return f"I encountered an issue generating a response. Please try again."
