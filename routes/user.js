const express = require("express");
const router = require("express-promise-router")();

const userController = require("../controllers/user");
const {validateParam, validateBody, schemas} = require('../helpers/routerHelpers')

router
  .route("/")
  .get(userController.allUser)
  .post(validateBody(schemas.userSchema), userController.newUser);

router
  .route("/:userID")
  .get(userController.oneUser)
  .put(validateParam(schemas.idSchema, 'userID'), validateBody(schemas.userSchema), userController.replaceUser)
  .patch(validateParam(schemas.idSchema, 'userID'), validateBody(schemas.userOptionalSchema), userController.updateUser);

router
  .route("/:userID/decks")
  .get(validateParam(schemas.idSchema, 'userID'), userController.getUserDecks)
  .post(validateParam(schemas.idSchema, 'userID'), userController.postUserDeck);

module.exports = router;
