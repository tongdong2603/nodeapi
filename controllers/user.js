const User = require("../models/User");
const Deck = require("../models/Deck");

const { JWT_SECRET } = require("../configs/index");
const JWT = require("jsonwebtoken");

const encodedToken = userID => {
  return JWT.sign(
    {
      iss: "Tong Dong",
      sub: userID,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 3)
    },
    JWT_SECRET
  );
};

// Get all user
const allUser = async (req, res, next) => {
  const users = await User.find({});
  return res.status(200).json({
    users: users
  });
};

// Create new User
const newUser = async (req, res, next) => {
  const newUser = new User(req.value.body);
  newUser.save();
  return res.status(201).json({
    user: newUser
  });
};

// Get one user
const oneUser = async (req, res, next) => {
  const userId = req.value.params.userID;
  const user = await User.findById(userId);
  return res.status(200).json({
    user
  });
};

// Put User Info
const replaceUser = async (req, res, next) => {
  const userId = req.value.params.userID;

  const newUser = req.value.body;

  await User.findByIdAndUpdate(userId, newUser);

  return res.status(200).json({
    success: true
  });
};

// sign up
const signUp = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  const mailDuplicate = await User.findOne({ email });
  if (mailDuplicate) {
    return res
      .status(403)
      .json({ error: { message: "Email is already in use" } });
  }

  // Create new User
  const newUser = new User({ firstName, lastName, email, password });
  await newUser.save();

  // Encode
  const token = encodedToken(newUser._id);

  res.setHeader("Authorization", token);
  return res.status(201).json({ success: true });
};
// sign in
const signIn = async (req, res, next) => {
  // Assign Token
  console.log(req.user)
  const token = encodedToken(req.user._id);
  console.log(token);
  res.setHeader("Authorization", token);
  return res.status(200).json({ success: true });
};
// Secrets
const secret = async (req, res, next) => {
  return res.status(200).json({ resources: true });
};

// Patch user Info
const updateUser = async (req, res, next) => {
  const userId = req.value.params.userID;

  const newUser = req.value.body;

  await User.findByIdAndUpdate(userId, newUser);

  return res.status(200).json({
    success: true
  });
};

// Get decks by user
const getUserDecks = async (req, res, next) => {
  const userId = req.value.params.userID;

  const decks = await User.findById(userId).populate("decks");

  return res.status(200).json({
    decks
  });
};

// Post decks by user
const postUserDeck = async (req, res, next) => {
  const userId = req.value.params.userID;

  const newDeck = new Deck(req.value.body);

  const user = await User.findById(userId);

  newDeck.owner = user;

  // deck save
  await newDeck.save();

  user.decks.push(newDeck._id);

  await user.save();

  res.status(201).json({ deck: newDeck });
};

module.exports = {
  newUser,
  allUser,
  oneUser,
  replaceUser,
  updateUser,
  postUserDeck,
  getUserDecks,
  signUp,
  signIn,
  secret
};
