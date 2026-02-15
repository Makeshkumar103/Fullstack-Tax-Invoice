const mysql = require("mysql2");

// Create MySQL connection using Railway provided MYSQL_URL
const db = mysql.createConnection(process.env.MYSQL_URL);

// Connect to DB
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ MySQL connected successfully");
  }
});

module.exports = db;
