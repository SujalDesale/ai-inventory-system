import Product from "../models/Product.js";
import fs from "fs";
import csv from "csv-parser";
import XLSX from "xlsx";

/* =========================================
   BASIC CRUD
========================================= */

export async function list(req, res) {
  try {
    const products = await Product.find({ owner: req.user.id }).sort("-updatedAt");
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
}

export async function create(req, res) {
  try {
    const product = await Product.create({
      ...req.body,
      owner: req.user.id,
    });
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create product" });
  }
}

export async function update(req, res) {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update product" });
  }
}

export async function remove(req, res) {
  try {
    await Product.deleteOne({ _id: req.params.id, owner: req.user.id });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete product" });
  }
}

/* =========================================
   AI SMART COLUMN MAPPING
========================================= */

function mapColumns(row) {
  const lower = {};
  Object.keys(row).forEach((key) => {
    lower[key.toLowerCase()] = row[key];
  });

  return {
    name: lower["name"] || lower["item"] || lower["product name"] || "",
    category: lower["category"] || lower["type"] || "",
    unit: lower["unit"] || "",
    quantity: Number(lower["quantity"] || lower["qty"] || 0),
    costPrice: Number(lower["costprice"] || lower["cp"] || 0),
    sellPrice: Number(lower["sellprice"] || lower["sp"] || 0),
    threshold: Number(lower["threshold"] || lower["min stock"] || 0),
    expiry: lower["expiry"] || lower["expirydate"] || "",
    supplier: lower["supplier"] || ""
  };
}

/* =========================================
   UPLOAD PREVIEW (CSV / XLSX)
========================================= */

export async function uploadPreview(req, res) {
  try {
    const filePath = req.file.path;
    const ext = req.file.originalname.split(".").pop().toLowerCase();

    let rows = [];

    if (ext === "csv") {
      rows = await new Promise((resolve) => {
        const results = [];
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", (data) => results.push(data))
          .on("end", () => resolve(results));
      });
    }

    if (ext === "xlsx") {
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(sheet);
    }

    const mapped = rows.map(mapColumns);

    res.json({ rows: mapped });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
}

/* =========================================
   CHECK DUPLICATES
========================================= */

export async function checkDuplicates(req, res) {
  try {
    const rows = req.body.rows;
    const results = [];

    for (const row of rows) {
      const existing = await Product.findOne({
        name: row.name,
        owner: req.user.id,
      });

      results.push({
        ...row,
        status: existing ? "Update" : "Insert",
      });
    }

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Duplicate check failed" });
  }
}

/* =========================================
   BULK SAVE (UPSERT LOGIC)
========================================= */

export async function bulkSave(req, res) {
  try {
    const rows = req.body.rows;

    let inserted = 0;
    let updated = 0;

    for (const row of rows) {
      const existing = await Product.findOne({
        name: row.name,
        owner: req.user.id,
      });

      if (existing) {
        await Product.updateOne(
          { _id: existing._id },
          { ...row, owner: req.user.id }
        );
        updated++;
      } else {
        await Product.create({
          ...row,
          owner: req.user.id,
        });
        inserted++;
      }
    }

    res.json({
      message: "Bulk upload completed",
      inserted,
      updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Bulk save failed" });
  }
}