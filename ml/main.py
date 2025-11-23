from explainable.explain_forecast import generate_forecast_explanation
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from forecasting.forecast_model import forecast_next_28_days, train_forecast_model
from segmentation.rfm_model import calculate_rfm
from segmentation.discount_engine import generate_discounts


app = FastAPI()

# Add CORS middleware to allow frontend and backend to access ML server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Frontend
        "http://localhost:5000",  # Backend
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/forecast")
def get_forecast():
    forecast = forecast_next_28_days()
    return {"forecast": forecast}



@app.get("/rfm")
def get_rfm():
    rfm = calculate_rfm()
    return rfm



@app.get("/discounts")
def get_discounts():
    rfm = calculate_rfm()
    discounts = generate_discounts(rfm["segment_summary"])
    return discounts


# ------------------------------
# 4) AGENTIC AI ENDPOINT (Optional)
# ------------------------------
# @app.post("/agent")
# def get_agent_insights():
#     forecast = forecast_next_28_days()
#     rfm = calculate_rfm()
#     discounts = generate_discounts(rfm["segment_summary"])
#
#     insights = generate_agentic_insights(
#         forecast,
#         rfm["segment_summary"],
#         discounts,
#         rfm["top_segment"]
#     )
#
#     return insights



@app.get("/run-all")
def run_all():
    forecast = forecast_next_28_days()
    rfm = calculate_rfm()
    discounts = generate_discounts(rfm["segment_summary"])

    return {
        "forecast": forecast,
        "rfm": rfm,
        "discounts": discounts,
        # "agent": agent_insights  # add later
    }



@app.get("/")
def home():
    return {"message": "Backend running successfully!"}



@app.get("/explain-forecast")
def explain_forecast():
    forecast = forecast_next_28_days()
    rfm = calculate_rfm()

    explanation = generate_forecast_explanation(
        forecast,
        rfm["segment_summary"]
    )

    return {
        "forecast": forecast,
        "rfm_summary": rfm["segment_summary"],
        "explanation": explanation
    }

