import dotenv from "dotenv";
dotenv.config();

import "./bots/supplierBot.js";
import app from "./app.js";
import connect from "./config/db.js";
import logger from "./utils/logger.js";
import saleRoutes from "./routes/saleRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";


// API Routes
app.use("/api/sales", saleRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;

(async function () {
  try {
    await connect();
    app.listen(PORT, () =>
      logger.info(`API running at http://localhost:${PORT}`)
    );
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
})();
