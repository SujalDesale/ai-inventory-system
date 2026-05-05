import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { list } from "../controllers/invoiceController.js";

const r = Router();
r.use(auth);
r.get("/", list);
export default r;
