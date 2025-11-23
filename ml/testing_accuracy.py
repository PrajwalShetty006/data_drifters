import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
import math

# LOAD DATA
df = pd.read_csv("data/online_retail_II.csv")  

df['InvoiceDate'] = pd.to_datetime(df['InvoiceDate'])
df['Sales'] = df['Quantity'] * df['Price']

df_daily = df.groupby(df['InvoiceDate'].dt.date)['Sales'].sum().reset_index()
df_daily.columns = ['ds', 'y']

# CREATE LAG FEATURES
def create_lags(df, n_lags=7):
    df_lag = df.copy()
    for lag in range(1, n_lags+1):
        df_lag[f"lag_{lag}"] = df_lag['y'].shift(lag)
    return df_lag.dropna()

df_lag = create_lags(df_daily, 7)

# TRAIN-TEST SPLIT
train_size = int(len(df_lag) * 0.8)
train, test = df_lag[:train_size], df_lag[train_size:]

X_train = train.drop(columns=['ds', 'y'])
y_train = train['y']

X_test = test.drop(columns=['ds', 'y'])
y_test = test['y']

# TRAIN MODEL
model = RandomForestRegressor(n_estimators=300, random_state=42)
model.fit(X_train, y_train)

# PREDICT
preds = model.predict(X_test)

# METRICS
mae = mean_absolute_error(y_test, preds)
rmse = math.sqrt(mean_squared_error(y_test, preds))

print("Forecast Model Accuracy:")
print("MAE:", mae)
print("RMSE:", rmse)
