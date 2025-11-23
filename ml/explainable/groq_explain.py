import os
from dotenv import load_dotenv
import groq
from groq import Groq

load_dotenv()  # Load environment variables from .env file

# Read API key from environment for safety. Set `GROQ_API_KEY` before running.
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise RuntimeError("Environment variable GROQ_API_KEY is not set. Please set it and retry.")

client = Groq(api_key=GROQ_API_KEY)

def generate_forecast_explanation(forecast, rfm_summary):
    """
    Creates a clear business explanation using Groq LLM
    """

    prompt = f"""
    You are a retail analytics expert.

    --- 28-Day Forecast ---
    {forecast}

    --- Customer Segments (RFM) ---
    {rfm_summary}

    Create a simple, clear explanation covering:
    • Key forecast patterns (highs/lows)
    • Reasons for high or low days
    • Which customer segments impact sales most
    • Any risks or declining trends
    • Two actionable recommendations

    Keep it short and business-friendly.
    """
    # Try a list of candidate models and fall back if a model is not available for the account.
    candidate_models = [
        "llama-3.3-70b-versatile",
        "llama3-groq-70b-8192",
        "llama-3.3-70b",
    ]

    last_exc = None
    for model_name in candidate_models:
        try:
            response = client.chat.completions.create(
                model=model_name,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                max_tokens=400,
            )
            return response.choices[0].message.content
        except groq.NotFoundError as e:
            # Model not available for this account; try next candidate
            last_exc = e
            continue
        except Exception:
            # Re-raise other errors immediately
            raise

    # If we exhausted candidates, re-raise with helpful info.
    raise RuntimeError(
        "No available Groq model succeeded. Tried models: {}. Last error: {}".format(
            candidate_models, getattr(last_exc, "response", str(last_exc))
        )
    )
