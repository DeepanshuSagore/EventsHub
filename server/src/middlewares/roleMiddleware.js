export function requireRole(...roles) {
  return (req, res, next) => {
    const user = req.dbUser;

    if (!user || (roles.length > 0 && !roles.includes(user.role))) {
      return res.status(403).json({ message: 'You do not have permission to perform this action.' });
    }

    return next();
  };
}

export function requireAnyAuthenticated(req, res, next) {
  if (!req.dbUser) {
    return res.status(403).json({ message: 'You do not have permission to perform this action.' });
  }

  return next();
}

export function userHasRole(user, ...roles) {
  if (!user) return false;
  if (roles.length === 0) return true;
  return roles.includes(user.role);
}
