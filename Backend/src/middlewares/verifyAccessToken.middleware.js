import jwt from "jsonwebtoken"

// Middleware to verify the access token
function verifyAccessToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Access token missing' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden: Invalid access token' });
    }

    req.user = user;
    next();
  });
}

export default verifyAccessToken