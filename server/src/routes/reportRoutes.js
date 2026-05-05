import express from "express";
import Invoice from "../models/Invoice.js";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/full", async (req, res) => {
  try {

    const invoices = await Invoice.find().lean();
    const products = await Product.find().lean();

    // 🔥 CREATE PRODUCT MAP
    const productMap = {};
    products.forEach(p => {
      productMap[p._id.toString()] = p;
    });

    let topItems = {};
    let categoryMap = {};
    let dailySales = {};

    invoices.forEach(inv => {

      const date = inv.createdAt
        ? new Date(inv.createdAt).toISOString().split("T")[0]
        : "Unknown";

      dailySales[date] = (dailySales[date] || 0) + (inv.total || 0);

      // 🔥 GET PRODUCT SAFELY
      const product = productMap[inv.product?.toString()];

      const name = product?.name || "Unknown";
      const category = product?.category || "Unknown";

      topItems[name] = (topItems[name] || 0) + (inv.quantity || 0);

      categoryMap[category] =
        (categoryMap[category] || 0) + (inv.total || 0);
    });

    // ================= EXPIRY =================
    const today = new Date();

    const expiredProducts = products.filter(p =>
      p.expiry && new Date(p.expiry) < today
    );

    console.log("TopItems:", topItems);
    console.log("Category:", categoryMap);
    console.log("Trend:", dailySales);

    res.json({
      topItems,
      salesByCategory: categoryMap,
      dailySales,
      products,
      expiredProducts
    });

  } catch (err) {
    console.error("REPORT ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;