const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403);
      next(new Error('Forbidden: Insufficient privileges'));
    }
  };
};

module.exports = { requireRole };
