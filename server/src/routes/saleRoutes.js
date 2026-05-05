import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { recordSale, recordMultiSale } from "../controllers/saleController.js";

const r = Router();

/* 🔐 PROTECT ALL ROUTES */
r.use(auth);

/* ✅ ROUTES */
r.post("/", recordSale);        // single sale
r.post("/multi", recordMultiSale); // multi sale

export default r;