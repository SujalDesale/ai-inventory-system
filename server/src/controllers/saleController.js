import Product from "../models/Product.js";
import Invoice from "../models/Invoice.js";

/* ---------------- SINGLE SALE ---------------- */
export async function recordSale(req, res) {
  try {
    const {
      productId,
      quantity,
      customerName,
      customerEmail,
      paymentMethod,
      discount = 0,
      tax = 0,
    } = req.body;

    /* 🔍 VALIDATION */
    if (!productId || !quantity) {
      return res.status(400).json({
        message: "Product and quantity required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    /* ❌ EXPIRED CHECK */
    if (product.expiry && new Date(product.expiry) < new Date()) {
      return res.status(400).json({
        message: `❌ ${product.name} is expired`,
      });
    }

    /* ❌ STOCK CHECK */
    if (product.quantity < quantity) {
      return res.status(400).json({
        message: "Insufficient stock",
      });
    }

    /* 💰 CALCULATIONS */
    const subtotal = product.sellPrice * quantity;
    const taxAmount = (tax / 100) * subtotal;
    const discountAmount = discount; // flat ₹
    const total = subtotal + taxAmount - discountAmount;

    /* 🧾 SAVE (WITH items ALSO for consistency) */
    const invoice = await Invoice.create({
      owner: req.user.id,

      product: product._id,
      quantity,

      // ✅ ALSO SAVE IN ITEMS (IMPORTANT FOR UI)
      items: [
        {
          product: product._id,
          quantity,
          price: product.sellPrice,
        },
      ],

      subtotal,
      tax: taxAmount,
      discount: discountAmount,
      total,
      paymentMethod,
      customerName,
      customerEmail,
    });

    /* 📉 UPDATE STOCK */
    product.quantity -= quantity;
    await product.save();

    res.status(201).json(invoice);

  } catch (err) {
    console.error("❌ SINGLE SALE ERROR:", err);
    res.status(500).json({
      message: err.message || "Failed to record sale",
    });
  }
}

/* ---------------- MULTI PRODUCT SALE ---------------- */
export async function recordMultiSale(req, res) {
  try {
    const {
      items,
      customerName,
      customerEmail,
      paymentMethod,
      discount = 0,
      tax = 0,
    } = req.body;

    /* 🔍 VALIDATION */
    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "No items provided",
      });
    }

    let subtotal = 0;
    let invoiceItems = [];

    /* 🔄 PROCESS ITEMS */
    for (let item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          message: "Invalid item data",
        });
      }

      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: `Product not found (${item.productId})`,
        });
      }

      /* ❌ EXPIRED */
      if (product.expiry && new Date(product.expiry) < new Date()) {
        return res.status(400).json({
          message: `❌ ${product.name} is expired`,
        });
      }

      /* ❌ STOCK */
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      const price = product.sellPrice;

      subtotal += price * item.quantity;

      invoiceItems.push({
        product: product._id,
        quantity: item.quantity,
        price: price, // ✅ FIX
      });
    }

    /* 💰 CALCULATIONS */
    const taxAmount = (tax / 100) * subtotal;
    const discountAmount = discount;
    const total = subtotal + taxAmount - discountAmount;

    /* 🧾 CREATE INVOICE */
    const invoice = await Invoice.create({
      owner: req.user.id,
      items: invoiceItems,
      subtotal,
      tax: taxAmount,
      discount: discountAmount,
      total,
      paymentMethod,
      customerName,
      customerEmail,
    });

    /* 📉 UPDATE STOCK (OPTIMIZED) */
    for (let item of invoiceItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.quantity },
      });
    }

    res.status(201).json(invoice);

  } catch (err) {
    console.error("❌ MULTI SALE ERROR:", err);
    res.status(500).json({
      message: err.message || "Multi sale failed",
    });
  }
}