const express = require("express");
const router = express.Router();
const db = require("../db/db");

// Create order & calculate VAT
router.post("/", (req, res) => {
  const { company_id, product_id, quantity } = req.body;

  const productQuery =
    "SELECT unit_price, vat_rate FROM products WHERE id = ?";

  db.query(productQuery, [product_id], (err, result) => {
    if (err) return res.status(500).json(err);
    const unitPrice = parseFloat(result[0]?.unit_price) || 0;
    const vatRate = parseFloat(result[0]?.vat_rate) || 0;

    const totalPrice = unitPrice * quantity;
    const vatAmount = totalPrice * (vatRate / 100);

    const orderQuery = `
      INSERT INTO orders 
      (company_id, product_id, quantity, total_price, vat_amount)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      orderQuery,
      [company_id, product_id, quantity, totalPrice, vatAmount],
      (err2, result2) => {
        if (err2) return res.status(500).json(err2);
        const insertedId = result2.insertId;
        res.json({ message: "Order created successfully", id: insertedId });
      }
    );
  });
});

// Get invoices
router.get("/", (req, res) => {
  const sql = `
    SELECT o.id,
           o.company_id,
           o.product_id,
           c.name AS company_name,
           c.address AS company_address,
           p.name AS product_name,
           p.unit_price,
           p.vat_rate,
           o.quantity,
           o.total_price,
           o.vat_amount
    FROM orders o
    JOIN companies c ON o.company_id = c.id
    JOIN products p ON o.product_id = p.id
    ORDER BY o.id DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router;
