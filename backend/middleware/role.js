// Usage: router.delete('/:id', requireAuth, requireRole(['admin']), controllerFn)
function requireRole(allowedRoles) {
  return function checkRole(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated." });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: this action requires one of these roles: ${allowedRoles.join(", ")}.`,
      });
    }
    next();
  };
}

module.exports = requireRole;
