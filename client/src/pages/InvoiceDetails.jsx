import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Search, FileText, FileDown, Send } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";

export default function InvoiceDetails() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    api.get("/invoices").then((res) => setInvoices(res.data));
  }, []);

  /* ---------------- FILTER ---------------- */
  const filtered = invoices.filter((inv) => {
    return (
      inv.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      inv.date?.toLowerCase().includes(search.toLowerCase())
    );
  });

  /* ---------------- PDF ---------------- */
  const handlePDF = (invoice) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Invoice #${invoice._id.slice(-6).toUpperCase()}`, 14, 20);

    doc.setFontSize(11);
    doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 14, 30);
    doc.text(`Customer: ${invoice.customerName || "N/A"}`, 14, 38);
    doc.text(`Payment: ${invoice.paymentMethod || "N/A"}`, 14, 46);
    doc.text(`Total: ₹${invoice.total}`, 14, 54);

    let rows = [];

    if (invoice.items && invoice.items.length > 0) {
      rows = invoice.items.map((item) => [
        item.product?.name || "N/A",
        item.quantity,
        `₹${item.price}`,
      ]);
    } else {
      rows = [[
        invoice.product?.name || "N/A",
        invoice.quantity,
        `₹${invoice.total}`,
      ]];
    }

    doc.autoTable({
      startY: 65,
      head: [["Product", "Qty", "Price"]],
      body: rows,
    });

    doc.save(`Invoice_${invoice._id.slice(-6)}.pdf`);
  };

  /* ---------------- CSV ---------------- */
  const handleCSV = (invoice) => {
    let data = [];

    if (invoice.items && invoice.items.length > 0) {
      data = invoice.items.map((item) => [
        item.product?.name,
        item.quantity,
        item.price,
        invoice.customerName,
        invoice.paymentMethod,
        invoice.total,
      ]);
    } else {
      data = [[
        invoice.product?.name,
        invoice.quantity,
        invoice.total,
        invoice.customerName,
        invoice.paymentMethod,
        invoice.total,
      ]];
    }

    const csv = Papa.unparse({
      fields: [
        "Product",
        "Quantity",
        "Price",
        "Customer",
        "Payment Method",
        "Total",
      ],
      data,
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Invoice_${invoice._id.slice(-6)}.csv`;
    link.click();
  };

  /* ---------------- RESEND ---------------- */
  const handleResend = (invoice) => {
    alert(`Invoice sent to ${invoice.customerEmail || "Customer"}`);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-6xl mx-auto p-8 glass rounded-2xl">
      <h2 className="text-2xl font-semibold mb-6">Invoice Details</h2>

      {/* SEARCH */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search invoices by date, customer..."
          className="w-full p-3 pl-10 rounded-xl bg-white/5 border border-white/10"
        />
      </div>

      {/* LIST */}
      <div className="space-y-6">
        {filtered.map((inv) => (
          <div
            key={inv._id}
            className="p-6 bg-white/5 border border-white/10 rounded-2xl"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Invoice #{inv._id.slice(-6).toUpperCase()}
              </h3>

              <div className="flex gap-2">
                <button
                  onClick={() => handlePDF(inv)}
                  className="p-2 bg-indigo-600 text-white rounded"
                >
                  <FileText size={16} />
                </button>

                <button
                  onClick={() => handleCSV(inv)}
                  className="p-2 bg-indigo-600 text-white rounded"
                >
                  <FileDown size={16} />
                </button>

                <button
                  onClick={() => handleResend(inv)}
                  className="p-2 bg-indigo-600 text-white rounded"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>

            {/* DETAILS */}
            <div className="grid grid-cols-2 text-sm text-black/80">
              <div>
                <p><strong>Date:</strong> {inv.date?.split("T")[0]}</p>
                <p><strong>Customer:</strong> {inv.customerName || "N/A"}</p>
                <p><strong>Payment:</strong> {inv.paymentMethod}</p>
              </div>

              <div className="text-right">
                <p>Subtotal: ₹{inv.subtotal.toFixed(2)}</p>
                <p>Tax: ₹{inv.tax.toFixed(2)}</p>
                <p>Discount: ₹{inv.discount.toFixed(2)}</p>
                <p className="font-bold text-lg">
                  Total: ₹{inv.total.toFixed(2)}
                </p>
              </div>
            </div>

            {/* ITEMS */}
            <div className="mt-4 border-t pt-3 text-sm">
              <strong>Items:</strong>

              {inv.items && inv.items.length > 0 ? (
                inv.items.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{item.product?.name}</span>
                    <span>
                      {item.quantity} × ₹{item.price || 0}
                    </span>
                  </div>
                ))
              ) : inv.product ? (
                <div className="flex justify-between">
                  <span>{inv.product?.name}</span>
                  <span>{inv.quantity} units</span>
                </div>
              ) : (
                <span className="text-gray-400 ml-2">No items</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center mt-10">No invoices found</p>
      )}
    </div>
  );
}