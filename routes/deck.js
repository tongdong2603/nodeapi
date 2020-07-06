const express = require("express");

const router = require("express-promise-router")();

const deckController = require("../controllers/deck");

const {
  validateBody,
  validateParam,
  schemas
} = require("../helpers/routerHelpers");

router
  .route("/")
  .get(deckController.getDecks)
  .post(validateBody(schemas.newDeckSchema), deckController.newDeck);
router
  .route("/:deckID")
  .get(validateParam(schemas.idSchema, "deckID"), deckController.oneDeck)
  .put(
    validateParam(schemas.idSchema, "deckID"),
    validateBody(schemas.newDeckSchema),
    deckController.putDeck
  )
  .patch(
    validateParam(schemas.idSchema, "deckID"),
    validateBody(schemas.deckOptionalSchema),
    deckController.updateDeck
  )
  .delete(validateParam(schemas.idSchema, "deckID"), deckController.deleteDeck);

module.exports = router;
