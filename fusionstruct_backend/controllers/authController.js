// controllers/authController.js
const db = require("../config/db");
const jwt = require("jsonwebtoken");

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });

  const sql = "SELECT * FROM admin_user WHERE username = ?";
  db.query(sql, [username], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length === 0)
      return res.status(401).json({ message: "Invalid username" });

    const user = result[0];

    // Plain text comparison (as per your DB)
    if (user.password !== password)
      return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username },
    });
  });
};


// Change Password
exports.changePassword = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
  const { newPassword, confirmPassword } = req.body;

  if (!token) return res.status(401).json({ message: "Unauthorized" });
  if (!newPassword || !confirmPassword)
    return res.status(400).json({ message: "All fields are required" });
  if (newPassword !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const sql = "UPDATE admin_user SET password = ? WHERE id = ?";
    db.query(sql, [newPassword, userId], (err, result) => {
      if (err) {
        console.error("Error updating password:", err);
        return res.status(500).json({ message: "Database error" });
      }

      res.json({ success: true, message: "Password updated successfully" });
    });
  } catch (err) {
    console.error("JWT error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};