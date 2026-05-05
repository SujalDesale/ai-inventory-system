import Invoice from "../models/Invoice.js";

export async function salesSummary(req, res) {
  try {
    const invoices = await Invoice.find({ owner: req.user.id })
      .populate("product");

    let totalRevenue = 0;
    const productMap = {};
    const categoryMap = {};
    const dailyMap = {};

    invoices.forEach(inv => {
      totalRevenue += inv.total;

      const name = inv.product?.name || "Unknown";
      const category = inv.product?.category || "Other";
      const day = new Date(inv.date).toISOString().split("T")[0];

      // Top selling items
      productMap[name] = (productMap[name] || 0) + inv.quantity;

      // Sales by category
      categoryMap[category] = (categoryMap[category] || 0) + inv.total;

      // Daily sales trend
      dailyMap[day] = (dailyMap[day] || 0) + inv.total;
    });

    // 🤖 Simple AI Forecast (avg of last 7 days)
    const dailyValues = Object.values(dailyMap);
    const avgDailySales =
      dailyValues.reduce((a, b) => a + b, 0) / (dailyValues.length || 1);

    const forecastNextDay = avgDailySales * 1.05; // +5% growth assumption

    res.json({
      totalRevenue,
      totalInvoices: invoices.length,
      topItems: productMap,
      salesByCategory: categoryMap,
      dailySales: dailyMap,
      aiForecast: {
        avgDailySales,
        forecastNextDay,
        confidence: "Medium"
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate sales report" });
  }
}
