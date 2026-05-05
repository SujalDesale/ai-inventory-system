import { Router } from "express";
import { auth } from "../middleware/auth.js";
import {
  productForecast,
  dashboardReorders,
} from "../controllers/aiController.js";
import { chatAssistant } from "../controllers/aiController.js";

import { sendReorder } from "../controllers/aiController.js";


const r = Router();

r.use(auth);

r.get("/product-forecast/:productId", productForecast);

r.get("/dashboard-reorders", dashboardReorders);
r.post("/chat", chatAssistant);

r.post("/send-reorder", sendReorder);


export default r;