const express = require("express");
const router = express.Router();
const db = require("../db/db");

// Add company
router.post("/", (req, res) => {
  const { name, address } = req.body;

  const sql = "INSERT INTO companies (name, address) VALUES (?, ?)";
  db.query(sql, [name, address], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Company added successfully" });
  });
});

// Get all companies
router.get("/", (req, res) => {
  const sql = "SELECT * FROM companies";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Get company by id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM companies WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ message: "Company not found" });
    res.json(results[0]);
  });
});

module.exports = router;
