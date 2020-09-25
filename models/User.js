const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcryptjs = require("bcryptjs");

const UserSchema = new Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  decks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Deck"
    }
  ]
});

UserSchema.pre('save', async function(next) {
  try {
    const hashCode = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash(this.password, hashCode);
    this.password = passwordHash;
    next();
  }catch (e) {
    next(e);
  }
});

UserSchema.methods.isComparePassword = async function(newPassword) {
  try {
    return await bcryptjs.compare(newPassword, this.password);
  }catch (e) {
    throw new Error(e);
  }
}

const User = mongoose.model("User", UserSchema);
module.exports = User;
