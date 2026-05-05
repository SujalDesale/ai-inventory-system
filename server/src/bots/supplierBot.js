import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error("❌ TELEGRAM_BOT_TOKEN missing in .env");
}

const bot = new TelegramBot(token, {
  polling: true,
});

console.log("✅ Supplier Bot Started");

/* ---------------- START COMMAND ---------------- */
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "🤖 Inventory Supplier Bot\n\nWaiting for reorder requests..."
  );
});

/* ---------------- GET CHAT ID ---------------- */
bot.on("message", (msg) => {
  console.log("📌 SUPPLIER_CHAT_ID =", msg.chat.id);
});

/* ---------------- BUTTON HANDLER ---------------- */
bot.on("callback_query", async (query) => {
  const data = query.data;
  const chatId = query.message.chat.id;

  console.log("📩 Button clicked:", data);

  try {
    if (data.startsWith("confirm")) {
      const [_, productId, qty] = data.split("_");

      await bot.sendMessage(
        chatId,
        `✅ Order Confirmed!\n\nProduct ID: ${productId}\nQuantity: ${qty}`
      );

      // 🔥 NEXT STEP: Save in DB
    }

    else if (data.startsWith("negotiate")) {
      await bot.sendMessage(
        chatId,
        "💬 Please type your negotiation message..."
      );
    }

  } catch (err) {
    console.log("Callback error:", err.message);
  }
});

export default bot;