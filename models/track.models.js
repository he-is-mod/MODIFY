const pool = require("../config/database"); // database connection

async function createTrack(title, audioUrl, musicianId, coverUrl = null) {
  const [result] = await pool.execute(
    "INSERT INTO tracks (title, url, musician_id, cover ) VALUES (?, ?, ?, ?)",
    [title, audioUrl, musicianId, coverUrl]
  );
  return result;
}

async function getAllTracks() {
  const [rows] = await pool.execute(
    "SELECT * FROM tracks ORDER BY created_at DESC"
  );
  return rows;
}

const getRandomTracks = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM tracks ORDER BY RAND() LIMIT 6"
    );
    res.render("home", { tracks: rows });
  } catch (err) {
    console.error("Error fetching tracks:", err);
    res.status(500).send("Server error");
  }
};

module.exports = {
  createTrack,
  getAllTracks,
  getRandomTracks,
};
