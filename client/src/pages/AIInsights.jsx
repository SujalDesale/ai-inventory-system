import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function AIInsights() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState("");
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    api.get("/products").then(res => {
      setProducts(res.data);
      if (res.data.length) setSelected(res.data[0]._id);
    });
  }, []);

  /* ---------------- FETCH FORECAST ---------------- */
  const getForecast = async () => {
    if (!selected) return;

    setLoading(true);
    try {
      const { data } = await api.get(`/ai/product-forecast/${selected}`);
      setForecast(data);
    } catch (err) {
      console.error(err);
      setForecast({ error: "Forecast failed" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selected) getForecast();
  }, [selected]);

  return (
    <div className="max-w-7xl mx-auto p-8 glass rounded-2xl">
      <h2 className="text-2xl font-semibold mb-6">AI Insights</h2>

      {/* ---------------- PRODUCT SELECTOR ---------------- */}
      <div className="mb-6">
        <label className="block text-sm mb-2">Select Product</label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="p-3 rounded-xl bg-white/5 border border-white/10"
        >
          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* ---------------- LOADING ---------------- */}
      {loading && <p>🤖 Analyzing with AI...</p>}

      {/* ---------------- ERROR ---------------- */}
      {forecast?.error && (
        <div className="p-4 bg-red-500/20 border border-red-400 rounded-xl">
          ❌ {forecast.error}
        </div>
      )}

      {/* ---------------- LOW DATA MESSAGE ---------------- */}
      {forecast?.message && (
        <div className="p-4 bg-yellow-500/20 border border-yellow-400 rounded-xl mb-6">
          ⚠ {forecast.message}
        </div>
      )}

      {/* ---------------- MAIN DATA ---------------- */}
      {forecast && !forecast.error && (
        <div className="grid grid-cols-3 gap-6">

          {/* Weekly Prediction */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">Next 7 Days</h3>
            <p className="text-2xl font-bold">
              {forecast.weekly_total?.toFixed(2)}
            </p>
          </div>

          {/* Monthly Estimate */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">Monthly Estimate</h3>
            <p className="text-2xl font-bold">
              {forecast.monthly_estimate?.toFixed(2)}
            </p>
          </div>

          {/* Trend */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">Trend</h3>
            <p
              className={`text-2xl font-bold ${
                forecast.trend?.includes("Increasing")
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {forecast.trend}
            </p>
          </div>

          {/* Daily Breakdown */}
          <div className="col-span-3 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">
              Daily Forecast Breakdown
            </h3>

            <div className="grid grid-cols-7 gap-4">
              {forecast.next_7_days?.map((value, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-indigo-600/30 text-center"
                >
                  <p className="text-sm">Day {i + 1}</p>
                  <p className="font-bold">{value.toFixed(1)}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}