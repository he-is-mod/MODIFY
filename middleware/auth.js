const ensureAuthenticated = (req, res, next) => {   
  console.log("🔍 User in ensureAuthenticated:", req.user);
  console.log("req.isAuthenticated():", req.isAuthenticated());

  if (req.isAuthenticated()) return next();
  // if (req.headers.accept && req.headers.accept.includes("application/json")) {
  //   return res.status(401).json({ message: "Not authorized" });
  // }

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


// function checkRole(role) {
//   return (req, res, next) => {
//     if (!req.isAuthenticated()) {
//       return res.redirect("/login");
//     }

//     if (req.user.role !== role) {
//       return res.status(403).send("Access denied");
//     }

//     next();
//   };
// }


module.exports = { ensureAuthenticated, authorizeRoles };
