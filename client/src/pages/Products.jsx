import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // ✅ added useLocation
import api from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const location = useLocation(); // ✅ NEW

  // 🔥 GET FILTER FROM URL
  const queryParams = new URLSearchParams(location.search);
  const filter = queryParams.get("filter");

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/products");
        setProducts(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* ---------------- DELETE PRODUCT ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  /* ---------------- FILTER LOGIC ---------------- */
  const filtered = products.filter((p) => {
    const query = search.toLowerCase();

    const matchesSearch =
      p.name?.toLowerCase().includes(query) ||
      p.category?.toLowerCase().includes(query) ||
      p.supplier?.toLowerCase().includes(query);

    // 🔴 LOW STOCK FILTER
    if (filter === "low") {
      return (
        matchesSearch &&
        p.threshold &&
        p.quantity <= p.threshold
      );
    }

    // 🟡 EXPIRING FILTER (5 DAYS)
    if (filter === "expiring") {
      return (
        matchesSearch &&
        p.expiry &&
        new Date(p.expiry) - Date.now() <=
          5 * 24 * 3600 * 1000
      );
    }

    return matchesSearch;
  });

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Products</h2>
        <Link
          to="/products/add"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          + Add Product
        </Link>
      </div>

      {/* 🔥 FILTER MESSAGE */}
      {filter === "low" && (
        <div className="p-3 bg-red-500/20 border border-red-400 rounded-lg text-red-400">
          ⚠ Showing Low Stock Products
        </div>
      )}

      {filter === "expiring" && (
        <div className="p-3 bg-yellow-500/20 border border-yellow-400 rounded-lg text-yellow-400">
          ⏳ Showing Products Expiring in 5 Days
        </div>
      )}

      {/* Search bar */}
      <div className="glass p-3">
        <input
          type="text"
          placeholder="Search by name, category, or supplier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded bg-white/5"
        />
      </div>

      {/* Products Table */}
      <div className="glass overflow-x-auto">
        {loading ? (
          <p className="p-4">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="p-4 opacity-70">No products found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left opacity-80 border-b border-white/10">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Unit</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Cost Price</th>
                <th className="p-3">Sell Price</th>
                <th className="p-3">Threshold</th>
                <th className="p-3">Expiry</th>
                <th className="p-3">Supplier</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p._id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">{p.unit}</td>

                  {/* 🔥 Highlight low stock */}
                  <td
                    className={`p-3 ${
                      p.threshold && p.quantity <= p.threshold
                        ? "text-red-400 font-semibold"
                        : ""
                    }`}
                  >
                    {p.quantity}
                  </td>

                  <td className="p-3">₹{p.costPrice}</td>
                  <td className="p-3">₹{p.sellPrice}</td>
                  <td className="p-3">{p.threshold}</td>

                  {/* 🔥 Highlight expiry */}
                  <td
                    className={`p-3 ${
                      p.expiry &&
                      new Date(p.expiry) - Date.now() <=
                        5 * 24 * 3600 * 1000
                        ? "text-yellow-400 font-semibold"
                        : ""
                    }`}
                  >
                    {p.expiry
                      ? new Date(p.expiry).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-3">{p.supplier}</td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => navigate(`/products/edit/${p._id}`)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-xs mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p._id)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-white text-xs"
                    >
                      Delete
                    </button>
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