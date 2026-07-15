const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Use an environment variable in production; fall back to a dev default.
const SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const hashed = await bcrypt.hash(password, 8);
    await User.create({ email, password: hashed });
    res.json({ success: true });
  } catch (err) {
    res
      .status(400)
      .json({ error: 'Email already registered or invalid.', details: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // Check if user has a password (legacy users or social auth might not)
    if (!user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token, email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Login failed.', details: err.message });
  }
};

