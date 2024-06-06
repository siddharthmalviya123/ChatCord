const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const User = require("../models/userModel");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });   //checking if user already exists in our database.

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token:generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});


const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
      success:true
    });
  } else {
    res.json({
      success:false
    })
  }
});
 
///       /api/user?search=siddharth
// here we are taking a query from our user. whatever the user is searching for will be passed as a query so we dont have to
// do a post request.
const allUsers = asyncHandler(async (req, res) => {
  console.log(req.query.search);
  const keyword = req.query.search
    ? {
      $or: [  //$or is mongodb OR functionality
        //regex regular expression capablity
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });  //return me every other user except the one logged in
  res.send(users);
});
//regex is used to search using pattern matching
//i is for case-insensitivity

module.exports={registerUser,authUser,allUsers};