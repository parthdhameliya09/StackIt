const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root", // ← replace with your MySQL username
  password: "parth", // ← replace with your MySQL password
  database: "stack_db", // ← replace with your database name
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
    return;
  }
  console.log("✅ Connected to MySQL database.");
});

module.exports = db;
