const promisePool = require("../config/database");



// Find user by email
const getUserByEmail = async (email) => {
  try {
    console.log("🔍 Fetching user by email:", email);
    const [results] = await promisePool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (results.length === 0) {
      console.warn("⚠️ No user found with email:", email);
      return null;
    }

    console.log("✅ User found:", results[0]);
    return results[0];
  } catch (error) {
    console.error("❌ Error fetching user by email:", error);
    throw error;
  }
};

// Find user by ID
const getUserById = async (id) => {
  try {
    console.log("🔍 Fetching user by ID:", id);
    const [results] = await promisePool.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (results.length === 0) {
      console.warn("⚠️ No user found with ID:", id);
      return null;
    }

    return results[0];
  } catch (error) {
    console.error("❌ Error fetching user by ID:", error);
    throw error;
  }
};

// Get musician profile by ID
const getMusicianById = async (id) => {
  try {
    console.log("🎸 Fetching musician profile by ID:", id);
    const [results] = await promisePool.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (results.length === 0) {
      console.warn("⚠️ No musician found with ID:", id);
      return null;
    }

    return results[0];
  } catch (error) {
    console.error("❌ Error fetching musician profile:", error);
    throw error;
  }
};

// Get all tracks by artist name
const getTracksByArtist = async (musician_id) => {
  try {
    console.log("🎶 Fetching tracks for artist:", musician_id);
    const [results] = await promisePool.query(
      "SELECT * FROM tracks WHERE musician_id = ?",
      [musician_id]
    );

    if (results.length === 0) {
      console.warn("⚠️ No tracks found for artist:", musician_id);
      return [];
    }

    return results; // Just return DB rows directly
  } catch (error) {
    console.error("❌ Error fetching tracks for artist:", error);
    throw error;
  }
};



module.exports = {
  getUserByEmail,
  getUserById,
  getMusicianById,
  getTracksByArtist,
};
