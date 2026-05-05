import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("single"); // single | bulk
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState([]);

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // -------------------------
  // SINGLE PRODUCT SUBMIT
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/products", form);
      navigate("/products");
    } catch (err) {
      console.error(err);
      alert("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // BULK FILE UPLOAD
  // -------------------------
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await api.post("/products/upload-preview", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Check duplicates
      const check = await api.post("/products/check-duplicates", {
        rows: data.rows,
      });

      setPreviewData(check.data);
      setMode("preview");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  // -------------------------
  // CONFIRM BULK SAVE
  // -------------------------
  const handleBulkSave = async () => {
    try {
      await api.post("/products/bulk-save", { rows: previewData });
      alert("Bulk upload completed!");
      navigate("/products");
    } catch (err) {
      console.error(err);
      alert("Bulk save failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto glass p-8">
      <h2 className="text-2xl font-semibold mb-6">Add Product</h2>

      {/* Mode Switch */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setMode("single")}
          className={`px-4 py-2 rounded ${
            mode === "single" ? "bg-indigo-600 text-white" : "bg-white/10"
          }`}
        >
          Single Product
        </button>

        <button
          onClick={() => setMode("bulk")}
          className={`px-4 py-2 rounded ${
            mode === "bulk" ? "bg-indigo-600 text-white" : "bg-white/10"
          }`}
        >
          Bulk Upload
        </button>
      </div>

      {/* SINGLE PRODUCT FORM */}
      {mode === "single" && (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {Object.keys(form).map((key) => (
            <div key={key} className={key === "supplier" ? "col-span-2" : ""}>
              <label className="block text-sm mb-1 capitalize">{key}</label>
              {key === "supplier" ? (
                <textarea
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-white/5"
                />
              ) : (
                <input
                  type={key === "expiry" ? "date" : "text"}
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-white/5"
                />
              )}
            </div>
          ))}

          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white"
            >
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      )}

      {/* BULK UPLOAD MODE */}
      {mode === "bulk" && (
        <div className="p-6 bg-white/5 rounded-xl">
          <input type="file" accept=".csv,.xlsx" onChange={handleFileUpload} />
          <p className="text-sm mt-2 text-gray-400">
            Upload CSV or Excel file
          </p>
        </div>
      )}

      {/* PREVIEW MODE */}
      {mode === "preview" && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Preview Before Save</h3>

          <div className="overflow-auto max-h-96">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Quantity</th>
                  <th className="p-2 text-left">Cost</th>
                  <th className="p-2 text-left">Sell</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, i) => (
                  <tr key={i} className="border-b border-white/10">
                    <td className="p-2">{row.name}</td>
                    <td className="p-2">{row.quantity}</td>
                    <td className="p-2">{row.costPrice}</td>
                    <td className="p-2">{row.sellPrice}</td>
                    <td
                      className={`p-2 font-semibold ${
                        row.status === "Update"
                          ? "text-yellow-400"
                          : "text-green-400"
                      }`}
                    >
                      {row.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleBulkSave}
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white"
            >
              Confirm & Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}