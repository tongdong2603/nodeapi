const express = require("express");
const router = require("express-promise-router")();

const userController = require("../controllers/user");
const {
  validateParam,
  validateBody,
  schemas
} = require("../helpers/routerHelpers");

const passport = require('passport');
require('../middlewares/passport');

router
  .route("/")
  .get(userController.allUser)
  .post(validateBody(schemas.userSchema), userController.newUser);
router
  .route("/signUp")
  .post(validateBody(schemas.authSignUpSchema), userController.signUp);
router
  .route("/signIn")
  .post(validateBody(schemas.authSignInSchema), passport.authenticate('local', { session: false }), userController.signIn);

router.route("/secret").get(passport.authenticate('jwt', { session: false }), userController.secret);

router
  .route("/:userID")
  .get(userController.oneUser)
  .put(
    validateParam(schemas.idSchema, "userID"),
    validateBody(schemas.userSchema),
    userController.replaceUser
  )
  .patch(
    validateParam(schemas.idSchema, "userID"),
    validateBody(schemas.userOptionalSchema),
    userController.updateUser
  );

router
  .route("/:userID/decks")
  .get(validateParam(schemas.idSchema, "userID"), userController.getUserDecks)
  .post(validateParam(schemas.idSchema, "userID"), userController.postUserDeck);

module.exports = router;
