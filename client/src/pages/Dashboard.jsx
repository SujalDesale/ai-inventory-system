// client/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

export default function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [reorders, setReorders] = useState([]);
  const [sendingId, setSendingId] = useState(null);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    async function load() {
      try {
        const [pRes, invRes, reorderRes] = await Promise.all([
          api.get("/products"),
          api.get("/invoices").catch(() => ({ data: [] })),
          api.get("/ai/dashboard-reorders").catch(() => ({ data: [] })),
        ]);

        setProducts(pRes.data || []);
        setInvoices(invRes.data || []);
        setReorders(reorderRes.data || []);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  /* ---------------- CALCULATIONS ---------------- */
  const totalItems = products.length;

  const lowStockCount = products.filter((p) =>
    p.threshold ? p.quantity <= p.threshold : false
  ).length;

  const expiringSoonCount = products.filter(
    (p) =>
      p.expiry &&
      new Date(p.expiry) - Date.now() <= 5 * 24 * 3600 * 1000
  ).length;

  // 💰 TOTAL SALES
  const totalSales = invoices.reduce(
    (sum, inv) => sum + (inv.total || 0),
    0
  );

  // 📊 STOCK HEALTH
  const healthScore =
    products.length === 0
      ? 100
      : 100 - (lowStockCount / products.length) * 100;

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {/* ---------- TOP STATS ---------- */}
      <div className="grid grid-cols-4 gap-6">

        {/* Total Items */}
        <div
          onClick={() => navigate("/products")}
          className="glass p-4 rounded-xl cursor-pointer hover:scale-105 transition"
        >
          <h3 className="text-sm opacity-90">Total Items</h3>
          <div className="text-3xl font-bold mt-2">{totalItems}</div>
          <div className="text-sm mt-1 opacity-80">
            Distinct products
          </div>
        </div>

        {/* 💰 Total Sales */}
        <div className="glass p-4 rounded-xl">
          <h3 className="text-sm opacity-90">Total Sales</h3>
          <div className="text-3xl font-bold mt-2 text-green-400">
            ₹{totalSales.toLocaleString()}
          </div>
          <div className="text-sm mt-1 opacity-80">
            Revenue generated
          </div>
        </div>

        {/* 📊 Stock Health */}
        <div className="glass p-4 rounded-xl">
          <h3 className="text-sm opacity-90">Stock Health</h3>
          <div className="text-3xl font-bold mt-2 text-blue-400">
            {healthScore.toFixed(0)}%
          </div>
          <div className="text-sm mt-1 opacity-80">
            Inventory efficiency
          </div>
        </div>

        {/* Low Stock */}
        <div
          onClick={() => navigate("/products?filter=low")}
          className="glass p-4 rounded-xl cursor-pointer hover:scale-105 transition"
        >
          <h3 className="text-sm opacity-90">Low Stock</h3>
          <div className="text-3xl font-bold mt-2">
            {lowStockCount}
          </div>
          <div className="text-sm mt-1 opacity-80">
            Items below threshold
          </div>
        </div>

        {/* Expiring Soon */}
        <div
          onClick={() => navigate("/products?filter=expiring")}
          className="glass p-4 rounded-xl cursor-pointer hover:scale-105 transition"
        >
          <h3 className="text-sm opacity-90">Expiring Soon</h3>
          <div className="text-3xl font-bold mt-2">
            {expiringSoonCount}
          </div>
          <div className="text-sm mt-1 opacity-80">
            Expiring within 5 days
          </div>
        </div>

      </div>

      {/* ---------- AI REORDER ---------- */}
      <div className="glass p-4 rounded-xl">
        <h2 className="text-xl font-semibold mb-3">
          AI Reorder Suggestions
        </h2>

        {reorders.length === 0 ? (
          <p className="opacity-80">
            No reorder required right now.
          </p>
        ) : (
          <div className="space-y-3">
            {reorders.map((item) => (
              <div
                key={item.productId}
                className="p-4 rounded-xl bg-red-50 flex justify-between items-center"
              >
                <div>
                  <div className="font-medium text-red-700">
                    ⚠ Reorder {item.name}
                  </div>
                  <div className="text-sm opacity-80">
                    Current Stock: {item.currentStock}
                  </div>
                  <div className="text-xs text-gray-500">
                    Demand: {item.predictedDailyDemand}/day
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="font-bold text-red-600">
                    {item.recommended} units
                  </div>

                  <button
                    disabled={sendingId === item.productId}
                    onClick={async () => {
                      setSendingId(item.productId);

                      try {
                        await api.post("/ai/send-reorder", {
                          productId: item.productId,
                          qty: item.recommended,
                        });

                        alert("✅ Order sent!");

                        setReorders((prev) =>
                          prev.filter(
                            (p) => p.productId !== item.productId
                          )
                        );

                      } catch (err) {
                        console.error(err);
                        alert("❌ Failed");
                      } finally {
                        setSendingId(null);
                      }
                    }}
                    className={`px-4 py-2 rounded-lg text-white ${
                      sendingId === item.productId
                        ? "bg-gray-400"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {sendingId === item.productId
                      ? "Sending..."
                      : "Reorder"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------- RECENT INVOICES ---------- */}
      <div className="bg-white/5 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">
          Recent Invoices
        </h2>

        {invoices.length === 0 ? (
          <p className="opacity-80">No invoices yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left opacity-80">
              <tr>
                <th className="p-2">Invoice</th>
                <th className="p-2">Date</th>
                <th className="p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoices.slice(0, 6).map((inv) => (
                <tr key={inv._id} className="hover:bg-white/3">
                  <td className="p-2">
                    {inv.number || inv._id}
                  </td>
                  <td className="p-2">
                    {new Date(
                      inv.createdAt ||
                        inv.date ||
                        Date.now()
                    ).toLocaleString()}
                  </td>
                  <td className="p-2">
                    ₹{inv.total || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}