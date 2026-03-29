const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15m', // 15 minutes access token
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: '7d', // 7 days refresh token
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Prevent CSRF attacks
  };

  // Set Access Token
  res.cookie('jwt', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 mins
  });

  // Set Refresh Token
  res.cookie('jwt_refresh', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return { accessToken, refreshToken };
};

module.exports = generateToken;
