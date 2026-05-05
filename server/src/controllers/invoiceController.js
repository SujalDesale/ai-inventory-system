import Invoice from "../models/Invoice.js";

export async function list(req, res) {
  try {
    const invoices = await Invoice.find({ owner: req.user.id })
      .populate("product")          // old invoices
      .populate("items.product")    // multi items
      .sort("-createdAt");

    res.json(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
}