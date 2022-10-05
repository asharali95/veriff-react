const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: [true, "Username is required!"],
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: [true, "Phone number is already taken"],
    maxLength: [11, "Phone number is too long"],
  },
  email: {
    type: String,
    unique: true, // indexing
    required: true,
    lower: true, // data modification eg. User@gmail.com & user@gmail.com
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    select: false, // ab yeh kisi bhi API request pe data k sath ni fetch hoga
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: [
      function (val) {
        //here, "this" pointout document
        return val === this.password;
      },
      "password doesnot match",
    ],
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpiredAt: Date,
});

userSchema.methods.passwordVerification = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

//reset password
userSchema.methods.passwordResetTokenGenerator = function () {
  var resetToken = crypto.randomBytes(32).toString("hex");
  var encryptedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetToken = encryptedResetToken;
  this.passwordResetTokenExpiredAt = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
// encrypting password before saving in database
userSchema.pre("save", async function (next) {
  //TODO: check if password change then do the following
  if (!this.isModified("password")) return next();
  var encryptedPassword = await bcrypt.hash(this.password, 12); //number for brute force attack
  this.password = encryptedPassword;
  this.confirmPassword = undefined;
  this.passwordChangedAt = Date.now() - 1000; //This is because JWT signing process takes time so we minus 1 second from actual time to prevent conflicts
  next();
});
var User = new mongoose.model("User", userSchema);

module.exports = User;
