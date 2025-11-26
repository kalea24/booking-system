// server/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// ✅ Define your owner account(s)
// Format: email => hashed_password
const OWNER_ACCOUNTS = {
  'czaile2404@gmail.com': '$2b$10$SQ1VCYHH.NZZ8tT1AL7NhuI3PWrkvF/44.kszTKkPNr3I5WuV/gqK' // ← PASTE YOUR HASH HERE
  // Add more owners like this:
  // 'partner@gmail.com': '$2b$10$another-hash...'
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // ✅ Check if email exists in allowed accounts
    if (!OWNER_ACCOUNTS[email]) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // ✅ Verify password
    const isValid = await bcrypt.compare(password, OWNER_ACCOUNTS[email]);
    
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // ✅ Generate JWT token
    const token = jwt.sign(
      { ownerId: email }, // Include email in token
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ 
      message: 'Login successful', 
      token,
      owner: { email } // Send email back to frontend
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};