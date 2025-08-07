
const express = require("express");
const testRoutes = express.Router();
const db = require("../config/database");

testRoutes.get("/test-db", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});

module.exports = testRoutes;
