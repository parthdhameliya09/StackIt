import express from "express";
import jwt from "jsonwebtoken";
import axios from "axios";
import pool from "./db.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/google", async (req, res) => {
  const { token } = req.body;

  try {
    // Verify Google Token
    const googleRes = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`);
    const { email, name, picture } = googleRes.data;

    // Check if user exists
    const [rows] = await pool.query("SELECT * FROM user WHERE email = ?", [email]);

    let user;
    if (rows.length > 0) {
      user = rows[0];
    } else {
      const [result] = await pool.query(
        "INSERT INTO user (username, email, password_hash, user_role) VALUES (?, ?, ?, ?)",
        [name, email, "-", "user"]
      );
      user = {
        user_id: result.insertId,
        username: name,
        email,
        user_role: "user",
      };
    }

    // Generate JWT
    const jwtToken = jwt.sign({ userId: user.user_id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      user: {
        name: user.username,
        email: user.email,
        picture,
      },
      token: jwtToken,
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid Google token" });
  }
});

export default router;
