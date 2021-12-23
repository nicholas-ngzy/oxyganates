const errorHandler = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    // jwt authentication error
    return res.status(401).json({ message: 'User not authorized' });
  }
  return res.status(500).json(err);
};

export default errorHandler;
