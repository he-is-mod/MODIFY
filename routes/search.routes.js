const express = require("express");
const searchRouter = express.Router();
const db = require("../config/database");

// GET /search
searchRouter.get("/", async (req, res) => {
  const query = req.query.q || "";
  let results = [];

  try {
    if (query) {
      const sql = `
        SELECT tracks.*, users.name AS artist_name
        FROM tracks
        LEFT JOIN users ON tracks.musician_id = users.id
        WHERE tracks.title LIKE ?
        LIMIT 20
      `;

      const values = [`%${query}%`];
      const [rows] = await db.query(sql, values);
      results = rows;
    } else {
      const recSql = `
        SELECT tracks.*, users.name AS artist_name
        FROM tracks
        LEFT JOIN users ON tracks.musician_id = users.id
        ORDER BY RAND()
        LIMIT 10
      `;
      const [rows] = await db.query(recSql);
      results = rows;
    }

    res.render("search", { query, results, user: req.user || null });
  } catch (err) {
    console.error("Search route error:", err);
    res.render("search", {
      query: "",
      results: [],
      error: "An error occurred while searching.",
      user: req.user || null,
    });
  }
});

module.exports = searchRouter;
