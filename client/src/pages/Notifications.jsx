import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ NEW
import api from "../services/api";

export default function Notifications() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [reorders, setReorders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readIds, setReadIds] = useState([]); // ✅ mark as read

  useEffect(() => {
    async function load() {
      try {
        const [pRes, reorderRes] = await Promise.all([
          api.get("/products"),
          api.get("/ai/dashboard-reorders").catch(() => ({ data: [] })),
        ]);

        setProducts(pRes.data || []);
        setReorders(reorderRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  /* ---------------- FILTERS ---------------- */

  const lowStock = products.filter(
    (p) => p.threshold && p.quantity <= p.threshold
  );

  const expiring = products.filter(
    (p) =>
      p.expiry &&
      new Date(p.expiry) - Date.now() <=
        5 * 24 * 3600 * 1000
  );

  const totalNotifications =
    lowStock.length + expiring.length + reorders.length;

  /* ---------------- MARK AS READ ---------------- */
  const markRead = (id) => {
    setReadIds((prev) => [...prev, id]);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold">
        🔔 Notifications ({totalNotifications})
      </h1>

      {/* LOW STOCK */}
      <div className="glass p-4 rounded-xl">
        <h2 className="text-lg font-semibold mb-3 text-red-400">
          ⚠ Low Stock Alerts
        </h2>

        {lowStock.length === 0 ? (
          <p>No low stock items</p>
        ) : (
          lowStock.map((p) => (
            <div
              key={p._id}
              onClick={() => {
                markRead(p._id);
                navigate("/products?filter=low");
              }}
              className={`p-3 border-b border-white/10 cursor-pointer hover:bg-red-500/10 ${
                readIds.includes(p._id) ? "opacity-50" : ""
              }`}
            >
              📦 <b>{p.name}</b> — Only {p.quantity} left
            </div>
          ))
        )}
      </div>

      {/* EXPIRING */}
      <div className="glass p-4 rounded-xl">
        <h2 className="text-lg font-semibold mb-3 text-yellow-400">
          ⏳ Expiring Soon (5 days)
        </h2>

        {expiring.length === 0 ? (
          <p>No expiring items</p>
        ) : (
          expiring.map((p) => (
            <div
              key={p._id}
              onClick={() => {
                markRead(p._id);
                navigate("/products?filter=expiring");
              }}
              className={`p-3 border-b border-white/10 cursor-pointer hover:bg-yellow-500/10 ${
                readIds.includes(p._id) ? "opacity-50" : ""
              }`}
            >
              📅 <b>{p.name}</b> expires on{" "}
              {new Date(p.expiry).toLocaleDateString()}
            </div>
          ))
        )}
      </div>

      {/* AI REORDER */}
      <div className="glass p-4 rounded-xl">
        <h2 className="text-lg font-semibold mb-3 text-indigo-400">
          🤖 AI Reorder Suggestions
        </h2>

        {reorders.length === 0 ? (
          <p>No reorder suggestions</p>
        ) : (
          reorders.map((r) => (
            <div
              key={r.productId}
              onClick={() => {
                markRead(r.productId);
                navigate("/dashboard");
              }}
              className={`p-3 border-b border-white/10 cursor-pointer hover:bg-indigo-500/10 ${
                readIds.includes(r.productId) ? "opacity-50" : ""
              }`}
            >
              🛒 <b>{r.name}</b> → Order {r.recommended} units
            </div>
          ))
        )}
      </div>

    </div>
  );
}