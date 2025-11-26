// server/controllers/authController.js
const jwt = require('jsonwebtoken');

// ✅ Define your owner account(s)
const OWNER_ACCOUNTS = {
  'czaile2404@gmail.com': 'sanamagworknato!',
  'test@gmail.com': 'test12345' // ← YOUR PLAIN-TEXT PASSWORD
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // ✅ Check if email exists
    if (!OWNER_ACCOUNTS[email]) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // ✅ Compare plain-text passwords
    if (password !== OWNER_ACCOUNTS[email]) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // ✅ Generate JWT token
    const token = jwt.sign(
      { ownerId: email },
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