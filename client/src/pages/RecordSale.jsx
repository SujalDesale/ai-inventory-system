import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Search } from "lucide-react";

export default function RecordSale() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [cart, setCart] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [bill, setBill] = useState({
    subtotal: 0,
    tax: 0,
    discount: 5,
    total: 0,
  });

  /* ---------------- LOAD PRODUCTS ---------------- */
  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  /* ---------------- SEARCH ---------------- */
  useEffect(() => {
    if (search) {
      setFilteredProducts(
        products.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredProducts([]);
    }
  }, [search, products]);

  /* ---------------- ADD TO CART ---------------- */
  const addToCart = (product) => {
    const isExpired =
      product.expiry && new Date(product.expiry) < new Date();

    if (isExpired) return alert("❌ Product expired");

    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);

      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });

    setSearch("");
    setFilteredProducts([]);
  };

  /* ---------------- REMOVE ---------------- */
  const removeItem = (id) => {
    setCart(cart.filter((i) => i._id !== id));
  };

  /* ---------------- UPDATE QUANTITY ---------------- */
  const updateQty = (id, change) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  /* ---------------- BILL ---------------- */
  useEffect(() => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.sellPrice * item.quantity,
      0
    );

    const tax = subtotal * 0.05;
    const discount = 5;
    const total = subtotal + tax - discount;

    setBill({ subtotal, tax, discount, total });
  }, [cart]);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (cart.length === 0) return alert("Add products first");

    try {
      await api.post("/sales/multi", {
        items: cart.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
        customerName,
        customerEmail,
        paymentMethod,
        discount: bill.discount,
        tax: 5,
      });

      alert("Invoice generated!");

      setCart([]);
      setCustomerName("");
      setCustomerEmail("");
      setPaymentMethod("");

    } catch (err) {
      console.error(err);
      alert("Failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 glass rounded-2xl">
      <h2 className="text-2xl font-semibold mb-8">Record Sale</h2>

      {/* SEARCH */}
      <div className="mb-6 relative">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products"
            className="w-full p-3 pl-10 rounded-xl bg-white/5 border border-white/10"
          />
        </div>

        {/* DROPDOWN */}
        {filteredProducts.length > 0 && (
          <ul className="absolute bg-white mt-1 rounded-xl shadow-lg w-full max-h-52 overflow-y-auto z-10">
            {filteredProducts.map((p) => {
              const expired =
                p.expiry && new Date(p.expiry) < new Date();

              return (
                <li
                  key={p._id}
                  className={`px-4 py-2 flex justify-between ${
                    expired
                      ? "text-red-500 bg-gray-100"
                      : "hover:bg-white"
                  }`}
                >
                  <span>
                    {p.name} {expired && "❌"}
                  </span>

                  <button
                    disabled={expired}
                    onClick={() => addToCart(p)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    + Add
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* CART */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">🛒 Cart</h3>

        {cart.length === 0 ? (
          <p>No items added</p>
        ) : (
          cart.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center p-3 border-b border-white/10"
            >
              <span className="font-medium">{item.name}</span>

              {/* QUANTITY CONTROLS */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQty(item._id, -1)}
                  className="px-2 bg-gray-600 text-white rounded"
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() => updateQty(item._id, 1)}
                  className="px-2 bg-green-600 text-white rounded"
                >
                  +
                </button>
              </div>

              <span>
                ₹{(item.sellPrice * item.quantity).toFixed(2)}
              </span>

              <button
                onClick={() => removeItem(item._id)}
                className="text-red-500"
              >
                ❌
              </button>
            </div>
          ))
        )}
      </div>

      {/* BILL */}
      <div className="mt-8 p-6 bg-white/5 rounded-xl">
        <h3 className="font-semibold mb-4">Bill Preview</h3>
        <p>Subtotal: ₹{bill.subtotal.toFixed(2)}</p>
        <p>Tax: ₹{bill.tax.toFixed(2)}</p>
        <p>Discount: ₹{bill.discount}</p>
        <p className="font-bold">Total: ₹{bill.total.toFixed(2)}</p>
      </div>

      {/* CUSTOMER */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="p-3 rounded-xl bg-white/5 border border-white/10"
        />

        {/* <input
          type="email"
          placeholder="Customer Email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          className="p-3 rounded-xl bg-white/5 border border-white/10"
        /> */}

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="p-3 rounded-xl bg-white/5 border border-white/10"
        >
          <option value="">Select payment</option>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="UPI">UPI</option>
        </select>
      </div>

      {/* BUTTON */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 rounded-xl text-white bg-indigo-600 hover:bg-indigo-500"
        >
          Generate Invoice
        </button>
      </div>
    </div>
  );
}