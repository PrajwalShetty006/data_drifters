import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

MODEL_PATH = "models/forecast_model.pkl"
DATA_PATH = "data/online_retail_II.csv"  

# Loading data and preprocessing
def load_and_prepare_data():
    df = pd.read_csv(DATA_PATH)

    df['InvoiceDate'] = pd.to_datetime(df['InvoiceDate'])

    df['Sales'] = df['Quantity'] * df['Price']

    df_daily = df.groupby(df['InvoiceDate'].dt.date)['Sales'].sum().reset_index()
    df_daily.columns = ['ds', 'y']

    return df_daily

# Creating lag features

def create_lags(df, n_lags=7):
    df_lag = df.copy()
    for lag in range(1, n_lags+1):
        df_lag[f"lag_{lag}"] = df_lag['y'].shift(lag)

    df_lag = df_lag.dropna()
    return df_lag

# Creating Forecast model

def train_forecast_model():
    df = load_and_prepare_data()
    df_lag = create_lags(df)

    X = df_lag.drop(columns=['ds', 'y'])
    y = df_lag['y']

    model = RandomForestRegressor(n_estimators=300, random_state=42)
    model.fit(X, y)

    joblib.dump(model, MODEL_PATH)

    return {"message": "Forecast model trained and saved."}

# forecasting next 28 days

def forecast_next_28_days():
    if not os.path.exists(MODEL_PATH):
        return {"error": "Model not trained yet!"}

    df = load_and_prepare_data()
    model = joblib.load(MODEL_PATH)

    last_week = list(df['y'].values[-7:])
    forecasts = []

    for _ in range(28):
        input_features = np.array(last_week[-7:]).reshape(1, -1)
        pred = model.predict(input_features)[0]

        forecasts.append(float(pred))
        last_week.append(pred)

    last_date = pd.to_datetime(df['ds'].iloc[-1])
    future_dates = [last_date + pd.Timedelta(days=i+1) for i in range(28)]

    return [
        {"date": str(future_dates[i].date()), "prediction": forecasts[i]}
        for i in range(28)
    ]
