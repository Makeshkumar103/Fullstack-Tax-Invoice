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

    const unitPrice = result[0]?.unit_price;
    const vatRate = result[0]?.vat_rate;

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
      () => {
        res.json({ message: "Order created successfully" });
      }
    );
  });
});

// Get invoices
router.get("/", (req, res) => {
  const sql = `
    SELECT c.name AS company,
           p.name AS product,
           o.quantity,
           o.total_price,
           o.vat_amount
    FROM orders o
    JOIN companies c ON o.company_id = c.id
    JOIN products p ON o.product_id = p.id
  `;
  db.query(sql, (err, results) => {
    res.json(results);
  });
});

module.exports = router;
