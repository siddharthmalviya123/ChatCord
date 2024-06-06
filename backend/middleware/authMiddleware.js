const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;
   // console.log(req.headers);
  if (
    req.headers.authorization &&                          // we would be sending our auth token in the header of the request as a Bearer
    req.headers.authorization.startsWith("Bearer")        // token.
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];          // token would look like this "bearer sadasds323safsfsfhsdgfuygsdf"
                                                                // therefore extracting the jwt token from header in token and then
      //decodes token id                                        // matching ans extracting info of user except password and sending it 
      const decoded = jwt.verify(token, process.env.JWT_SECRET);// back;

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect }; 