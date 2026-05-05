from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
from sklearn.linear_model import LinearRegression

app = FastAPI()

class ForecastInput(BaseModel):
    daily_sales: list


@app.post("/forecast")
def forecast(data: ForecastInput):

    sales = np.array(data.daily_sales)

    if len(sales) < 7:
        return {"error": "Not enough data for forecasting"}

    # time index
    X = np.arange(len(sales)).reshape(-1,1)
    y = sales

    model = LinearRegression()
    model.fit(X, y)

    # predict next 7 days
    future_days = np.arange(len(sales), len(sales)+7).reshape(-1,1)
    predictions = model.predict(future_days)

    predictions = np.maximum(predictions, 0)

    weekly_total = float(np.sum(predictions))

    # trend detection
    if predictions[-1] > sales[-1]:
        trend = "increasing"
    elif predictions[-1] < sales[-1]:
        trend = "decreasing"
    else:
        trend = "stable"

    return {
        "weekly_total": weekly_total,
        "daily_forecast": predictions.tolist(),
        "trend": trend
    }