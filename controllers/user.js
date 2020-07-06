const User = require("../models/User");
const Deck = require("../models/Deck");

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
  getUserDecks
};
