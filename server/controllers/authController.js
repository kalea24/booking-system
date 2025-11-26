// server/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// ✅ Paste your hashed password here
const HASHED_PASSWORD = '$2b$10$cqRAAv7k.t8qc6BtM.hlvOzNlKtZohKrKFHsgz3qRD8saDPHknWfu'; // ← YOUR HASH

exports.login = async (req, res) => {
  try {
    const { password } = req.body;
    
    // ✅ Compare password with hash
    const isValid = await bcrypt.compare(password, HASHED_PASSWORD);
    
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    
    // ✅ Generate JWT token
    const token = jwt.sign(
      { ownerId: 'owner123' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ 
      message: 'Login successful', 
      token 
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};