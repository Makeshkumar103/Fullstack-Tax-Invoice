const mysql = require("mysql2");

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// const db = mysql.createConnection(process.env.MYSQL_URL);


// Connect to DB
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("MySQL connected successfully");
  }
});

module.exports = db;
