const ensureAuthenticated = (req, res, next) => {   
  console.log("🔍 User in ensureAuthenticated:", req.user);
  console.log("req.isAuthenticated():", req.isAuthenticated());

  if (req.isAuthenticated()) return next();

  // 👇 For regular HTML requests (like visiting a page), redirect to login
  res.redirect("/login");
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log("🔐 User in authorizeRoles:", req.user);

    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden" });
    }

    next();
  };
};



module.exports = { ensureAuthenticated, authorizeRoles };
