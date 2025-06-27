const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const User = require('../models/User');

const auth = async (req, res, next) => {
  // Check header for token
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication invalid' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    
    // Attach the user to the request object
    const user = await User.findById(payload.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Authentication invalid' });
    }
    
    req.user = {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication invalid' });
  }
};

module.exports = auth; 