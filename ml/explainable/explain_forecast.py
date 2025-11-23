import openai

openai.api_base = "https://api.deepseek.com/v1"
openai.api_key = "sk-9dfdc395477541bfa13392f803a4e73a"

def generate_forecast_explanation(forecast, rfm_summary):
    """
    forecast = list of {date, prediction}
    rfm_summary = {segment_name: count}
    """

    prompt = f"""
    You are an expert AI analyst for a retail company.

    Sales Forecast for next 28 days:
    {forecast}

    Customer Segmentation Summary:
    {rfm_summary}

    Generate a clear, easy-to-understand explanation including:

    - Key patterns in the forecast
    - Why some days have high/low sales
    - Which customer segment impacts sales most
    - Any risks (slow days or falling trends)
    - 2 actionable recommendations (inventory, marketing, offers)

    Keep the explanation simple and business-oriented.
    Return only the explanation text.
    """

    response = openai.ChatCompletion.create(
        model="deepseek-chat",
        messages=[{"role": "user", "content": prompt}]
    )

    return response["choices"][0]["message"]["content"]
