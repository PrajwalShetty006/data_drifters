import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
import os

DATA_PATH = "data/online_retail_II.csv"  

def load_data():
    df = pd.read_csv(DATA_PATH)
    df['InvoiceDate'] = pd.to_datetime(df['InvoiceDate'])
    df['Sales'] = df['Quantity'] * df['Price']
    return df

def calculate_rfm():
    df = load_data()

    df = df.dropna(subset=["Customer ID"])

    # Converting to datetime
    df['InvoiceDate'] = pd.to_datetime(df['InvoiceDate'])

    today_date = df['InvoiceDate'].max() + pd.Timedelta(days=1)

    # RFM calculations
    rfm = df.groupby("Customer ID").agg({
        "InvoiceDate": lambda x: (today_date - x.max()).days,
        "Invoice": "count",
        "Sales": "sum"
    }).reset_index()

    rfm.columns = ["CustomerID", "Recency", "Frequency", "Monetary"]

    # Handle zero or negative values
    rfm = rfm[rfm["Monetary"] > 0]

    # Normalize for clustering
    rfm_norm = rfm[['Recency','Frequency','Monetary']].copy()
    rfm_norm = (rfm_norm - rfm_norm.mean()) / rfm_norm.std()

    # KMeans clustering
    kmeans = KMeans(n_clusters=4, random_state=42)
    rfm['Cluster'] = kmeans.fit_predict(rfm_norm)

    # Segment names
    segment_map = {
        0: "VIP Customer",
        1: "Frequent Buyer",
        2: "At Risk Customer",
        3: "New/Low Value Customer"
    }

    rfm['Segment'] = rfm['Cluster'].map(segment_map)

    # Summary count for frontend
    segment_summary = rfm['Segment'].value_counts().to_dict()

    # Send results to frontend
    return {
        "rfm_table": rfm.to_dict(orient="records"),
        "segment_summary": segment_summary,
        "top_segment": max(segment_summary, key=segment_summary.get)
    }
