const Deck = require("../models/Deck");
const User = require("../models/User");

// Get all Deck
const getDecks = async (req, res, next) => {
  const decks = await Deck.find({});
  return res.status(200).json({
    decks
  });
};

// Post Deck
const newDeck = async (req, res, next) => {
  //find owner
  const owner = await User.findById(req.value.body.owner);

  // Create a new deck
  const deck = req.value.body;
  deck.delete(owner);

  deck.owner = owner._id;
  const newDeck = new Deck(deck);
  await newDeck.save();

  return res.status(201).json({
    newDeck
  });
};

//get one Deck
const oneDeck = async (req, res, next) => {
  const deckId = req.value.params.deckID;
  const deck = await Deck.findById(deckId);
  return res.status(200).json({
    deck
  });
};

// Put Deck
const putDeck = async (req, res, next) => {
  const deckId = req.value.params.deckID;
  const newDeck = req.value.body;
  await Deck.findByIdAndUpdate(deckId, newDeck);
  // Check if put user, remove deck in user's model
  return res.status(200).json({ success: true });
};

// Patch Deck
const updateDeck = async (req, res, next) => {
  const { deckID } = req.value.params;
  const newDeck = req.value.body;
  const result = await Deck.findByIdAndUpdate(deckID, newDeck);
  // Check if put user, remove deck in user's model
  return res.status(200).json({ success: true });
};

// Delete Deck
const deleteDeck = async (req, res, next) => {
  const { deckID } = req.value.params;

  // Get a deck
  const deck = await Deck.findById(deckID);
  const ownerID = deck.owner;

  // Get a owner
  const owner = await User.findById(ownerID);

  // Remove the deck
  await deck.remove();

  // Remove deck from owner's decks list
  owner.decks.pull(deck);
  await owner.save();

  return res.status(200).json({ success: true });
};

module.exports = {
  getDecks,
  newDeck,
  oneDeck,
  putDeck,
  updateDeck,
  deleteDeck
};
