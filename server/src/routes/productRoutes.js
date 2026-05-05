import { Router } from "express";
import { auth } from "../middleware/auth.js";
import multer from "multer";

import {
  list,
  create,
  update,
  remove,
  uploadPreview,
  checkDuplicates,
  bulkSave
} from "../controllers/productController.js";

const upload = multer({ dest: "uploads/" });

const r = Router();

r.use(auth);

// Basic CRUD
r.get("/", list);
r.post("/", create);
r.put("/:id", update);
r.delete("/:id", remove);

// Bulk Upload Routes
r.post("/upload-preview", upload.single("file"), uploadPreview);
r.post("/check-duplicates", checkDuplicates);
r.post("/bulk-save", bulkSave);

export default r;