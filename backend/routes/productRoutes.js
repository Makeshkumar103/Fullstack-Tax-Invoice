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

module.exports = router;
