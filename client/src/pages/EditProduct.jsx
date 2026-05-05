import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    category: "",
    unit: "",
    quantity: "",
    costPrice: "",
    sellPrice: "",
    threshold: "",
    expiry: "",
    supplier: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load product
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await api.get("/products");
        const product = res.data.find((p) => p._id === id);
        if (product) {
          setForm({
            name: product.name || "",
            category: product.category || "",
            unit: product.unit || "",
            quantity: product.quantity || "",
            costPrice: product.costPrice || "",
            sellPrice: product.sellPrice || "",
            threshold: product.threshold || "",
            expiry: product.expiry ? product.expiry.split("T")[0] : "",
            supplier: product.supplier || "",
          });
        } else {
          alert("Product not found");
          navigate("/products");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load product");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id, navigate]);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/products/${id}`, form);
      navigate("/products");
    } catch (err) {
      console.error(err);
      alert("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading product...</div>;

  return (
    <div className="max-w-5xl mx-auto glass p-8">
      <h2 className="text-2xl font-semibold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 rounded bg-white/5"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-3 rounded bg-white/5"
          />
        </div>

        {/* Unit */}
        <div>
          <label className="block text-sm mb-1">Unit</label>
          <input
            type="text"
            name="unit"
            value={form.unit}
            onChange={handleChange}
            className="w-full p-3 rounded bg-white/5"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            className="w-full p-3 rounded bg-white/5"
          />
        </div>

        {/* Cost Price */}
        <div>
          <label className="block text-sm mb-1">Cost Price</label>
          <input
            type="number"
            name="costPrice"
            value={form.costPrice}
            onChange={handleChange}
            className="w-full p-3 rounded bg-white/5"
          />
        </div>

        {/* Sell Price */}
        <div>
          <label className="block text-sm mb-1">Sell Price</label>
          <input
            type="number"
            name="sellPrice"
            value={form.sellPrice}
            onChange={handleChange}
            className="w-full p-3 rounded bg-white/5"
          />
        </div>

        {/* Threshold */}
        <div>
          <label className="block text-sm mb-1">Threshold</label>
          <input
            type="number"
            name="threshold"
            value={form.threshold}
            onChange={handleChange}
            className="w-full p-3 rounded bg-white/5"
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block text-sm mb-1">Expiry Date</label>
          <input
            type="date"
            name="expiry"
            value={form.expiry}
            onChange={handleChange}
            className="w-full p-3 rounded bg-white/5"
          />
        </div>

        {/* Supplier */}
        <div className="col-span-2">
          <label className="block text-sm mb-1">Supplier</label>
          <textarea
            name="supplier"
            value={form.supplier}
            onChange={handleChange}
            className="w-full p-3 rounded bg-white/5 h-20"
          />
        </div>

        {/* Save */}
        <div className="col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
          >
            {saving ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
