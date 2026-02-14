const express = require("express");
const router = express.Router();
const db = require("../db/db");

console.log("✓ seedRoutes.js loaded");

// Debug endpoint to verify route is loaded
router.get("/", (req, res) => {
  res.json({ message: "Seed endpoint is available. Use POST /seed to seed database." });
});

// Seed database with sample companies, products and orders
router.post("/", (req, res) => {
  // Clear existing data
  db.query("DELETE FROM orders", (err) => {
    if (err) return res.status(500).json(err);

    db.query("DELETE FROM products", (err2) => {
      if (err2) return res.status(500).json(err2);

      db.query("DELETE FROM companies", (err3) => {
        if (err3) return res.status(500).json(err3);

        // Insert sample companies
        const companies = [
          ["Acme Corporation", "123 Main St, Springfield"],
          ["Beta Industries", "456 Oak Ave, Shelbyville"],
        ];

        db.query(
          "INSERT INTO companies (name, address) VALUES ?",
          [companies],
          (err4) => {
            if (err4) return res.status(500).json(err4);

            // Insert sample products
            const products = [
              ["Widget A", 9.99, 18],
              ["Gadget B", 19.5, 12],
              ["Service C", 49.99, 5],
            ];

            db.query(
              "INSERT INTO products (name, unit_price, vat_rate) VALUES ?",
              [products],
              (err5) => {
                if (err5) return res.status(500).json(err5);

                // Now create a couple of orders linking created companies/products
                // Fetch ids to be safe
                db.query("SELECT id FROM companies ORDER BY id", (err6, compRows) => {
                  if (err6) return res.status(500).json(err6);
                  db.query("SELECT id FROM products ORDER BY id", (err7, prodRows) => {
                    if (err7) return res.status(500).json(err7);

                    const companyId1 = compRows[0]?.id;
                    const companyId2 = compRows[1]?.id;
                    const productId1 = prodRows[0]?.id;
                    const productId2 = prodRows[1]?.id;

                    const orders = [
                      [companyId1, productId1, 3, null, null],
                      [companyId2, productId2, 2, null, null],
                    ];

                    // For orders we'll compute total and vat server-side using product values
                    const insertOrder = (order, cb) => {
                      const [cId, pId, qty] = order;
                      db.query(
                        "SELECT unit_price, vat_rate FROM products WHERE id = ?",
                        [pId],
                        (err8, rows) => {
                          if (err8) return cb(err8);
                          const unit = parseFloat(rows[0]?.unit_price) || 0;
                          const vat = parseFloat(rows[0]?.vat_rate) || 0;
                          const total = unit * qty;
                          const vatAmount = total * (vat / 100);
                          db.query(
                            "INSERT INTO orders (company_id, product_id, quantity, total_price, vat_amount) VALUES (?, ?, ?, ?, ?)",
                            [cId, pId, qty, total, vatAmount],
                            cb
                          );
                        }
                      );
                    };

                    // Insert orders sequentially
                    insertOrder(orders[0], (e1) => {
                      if (e1) return res.status(500).json(e1);
                      insertOrder(orders[1], (e2) => {
                        if (e2) return res.status(500).json(e2);
                        res.json({ message: "Database seeded" });
                      });
                    });
                  });
                });
              }
            );
          }
        );
      });
    });
  });
});

module.exports = router;
