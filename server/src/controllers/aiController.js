import axios from "axios";
import Product from "../models/Product.js";
import Invoice from "../models/Invoice.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import bot from "../bots/supplierBot.js";

/* ---------------- HELPER FUNCTION ---------------- */
function aggregateDailySales(invoices) {
  const salesByDate = {};

  invoices.forEach((inv) => {
    const date = new Date(inv.date).toISOString().split("T")[0];
    salesByDate[date] = (salesByDate[date] || 0) + inv.quantity;
  });

  return Object.values(salesByDate);
}

/* ---------------- PRODUCT FORECAST ---------------- */
export async function productForecast(req, res) {
  try {
    const { productId } = req.params;

    const invoices = await Invoice.find({
      product: productId,
      owner: req.user.id,
    }).sort("date");

    /* -------- NO DATA -------- */
    if (!invoices.length) {
      return res.json({
        weekly_total: 0,
        monthly_estimate: 0,
        trend: "No Data",
        next_7_days: Array(7).fill(0),
        message: "No sales data available",
      });
    }

    const dailySales = aggregateDailySales(invoices);

    /* -------- LOW DATA FALLBACK -------- */
    if (dailySales.length < 7) {
      const avg =
        dailySales.reduce((a, b) => a + b, 0) / dailySales.length;

      const estimatedDaily = avg || 1;

      return res.json({
        weekly_total: estimatedDaily * 7,
        monthly_estimate: estimatedDaily * 30,
        trend: "Stable",
        next_7_days: Array(7).fill(estimatedDaily),
        message: "Using limited data",
      });
    }

    /* -------- ML FORECAST -------- */
    const forecastResponse = await axios.post(
      "http://localhost:8000/forecast",
      { daily_sales: dailySales }
    );

    return res.json(forecastResponse.data);

  } catch (error) {
    console.error("Forecast Error:", error.message);

    res.status(500).json({
      error: "AI Forecast failed",
    });
  }
}

/* ---------------- DASHBOARD REORDER (NO TELEGRAM HERE) ---------------- */
export async function dashboardReorders(req, res) {
  try {
    const products = await Product.find({
      owner: req.user.id,
    });

    const reorderList = [];

    for (let product of products) {

      const invoices = await Invoice.find({
        product: product._id,
        owner: req.user.id,
      }).sort("date");

      let dailyDemand = 0;

      /* -------- ML FORECAST -------- */
      if (invoices.length >= 7) {
        try {
          const dailySales = aggregateDailySales(invoices);

          const forecastResponse = await axios.post(
            "http://localhost:8000/forecast",
            { daily_sales: dailySales }
          );

          const forecast = forecastResponse.data;

          if (forecast.weekly_total) {
            dailyDemand = forecast.weekly_total / 7;
          }

        } catch {
          console.log("⚠️ ML failed → fallback used");
        }
      }

      /* -------- FALLBACK -------- */
      if (dailyDemand === 0) {
        dailyDemand = (product.threshold || 5) / 3;
      }

      const leadTime = product.leadTime || 3;
      const safetyStock = product.safetyStock || 5;

      const reorderQty =
        dailyDemand * leadTime -
        product.quantity +
        safetyStock;

      if (reorderQty > 0 && product.quantity < product.threshold) {

        const recommendedQty = Math.ceil(reorderQty);

        reorderList.push({
          productId: product._id,
          name: product.name,
          currentStock: product.quantity,
          predictedDailyDemand: dailyDemand.toFixed(2),
          recommended: recommendedQty,
          status: "Reorder Required",
        });
      }
    }

    res.json(reorderList);

  } catch (error) {
    console.error("Dashboard Error:", error.message);
    res.status(500).json({
      message: "Dashboard reorder check failed",
    });
  }
}

/* ---------------- 🔥 MANUAL REORDER (TELEGRAM TRIGGER) ---------------- */
export async function sendReorder(req, res) {
  try {
    const { productId, qty } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await bot.sendMessage(
      process.env.SUPPLIER_CHAT_ID,
      `🛒 *New Order Request*

📦 Product: ${product.name}
📉 Current Stock: ${product.quantity}
📊 Recommended Order: ${qty}

Confirm order?`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "✅ Confirm",
                callback_data: `confirm_${productId}_${qty}`,
              },
            ],
            [
              {
                text: "💬 Negotiate",
                callback_data: `negotiate_${productId}_${qty}`,
              },
            ],
          ],
        },
      }
    );

    res.json({
      message: "Order sent to supplier successfully 🚀",
    });

  } catch (error) {
    console.error("Reorder Error:", error.message);

    res.status(500).json({
      message: "Failed to send reorder",
    });
  }
}

/* ---------------- AI CHAT ---------------- */
export async function chatAssistant(req, res) {
  try {
    const { message } = req.body;

    const products = await Product.find({ owner: req.user.id });

    const inventoryData = products.map((p) => ({
      name: p.name,
      stock: p.quantity,
      threshold: p.threshold,
    }));

    const prompt = `
You are an AI inventory assistant.

Inventory:
${JSON.stringify(inventoryData)}

User:
${message}
`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt);

    res.json({ reply: result.response.text() });

  } catch (error) {
    console.error("AI Error:", error.message);

    res.status(500).json({
      reply: "AI assistant failed",
    });
  }
}