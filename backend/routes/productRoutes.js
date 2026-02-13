const express = require("express");
const router = express.Router();
const db = require("../db/db");

// Add product
router.post("/", (req, res) => {
  const { name, unit_price, vat_rate } = req.body;

  const sql =
    "INSERT INTO products (name, unit_price, vat_rate) VALUES (?, ?, ?)";
  db.query(sql, [name, unit_price, vat_rate], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Product added successfully" });
  });
});

// Get all products
router.get("/", (req, res) => {
  const sql = "SELECT * FROM products";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Get product by id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM products WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ message: "Product not found" });
    res.json(results[0]);
  });
});

module.exports = router;
