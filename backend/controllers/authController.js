const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { regno, password } = req.body;
    if (!regno || !password)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });

    const [existing] = await db.execute("SELECT * FROM users WHERE regno = ?", [
      regno.trim(),
    ]);
    if (existing.length > 0)
      return res
        .status(400)
        .json({
          success: false,
          message: "Register Number already registered.",
        });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.execute("INSERT INTO users (regno, password) VALUES (?, ?)", [
      regno.trim(),
      hashedPassword,
    ]);
    return res
      .status(201)
      .json({ success: true, message: "Registration successful." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { regno, password } = req.body;
    const [users] = await db.execute("SELECT * FROM users WHERE regno = ?", [
      regno.trim(),
    ]);
    if (users.length === 0)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });

    const token = jwt.sign(
      { id: user.id, regno: user.regno },
      "InterviewAI123",
      { expiresIn: "24h" },
    );
    return res
      .status(200)
      .json({ success: true, token, user: { regno: user.regno } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
