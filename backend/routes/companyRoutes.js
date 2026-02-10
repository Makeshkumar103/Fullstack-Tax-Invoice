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

module.exports = router;
