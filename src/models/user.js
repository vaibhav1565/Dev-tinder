const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 50,
      validate(value) {
        const regex = /^[a-zA-Z]*$/;
        if (!regex.test(value)) {
          throw new Error("Invalid name: " + value);
        }
      }
    },
    lastName: {
      type: String,
      // required: true,
      trim: true,
      minLength: 2, 
      maxLength: 50,
      validate(value) {
        const regex = /^[a-zA-Z]*$/;
        if (!regex.test(value)) {
          throw new Error("Invalid name: " + value);
        }
      }
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxLength: 300,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      maxLength: 100,
    },
    age: {
      type: Number,
      min: 13,
      max: 150,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not a valid age",
      },
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not a valid gender type`,
      },
      required: true,
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      maxLength: 2000,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default about of the user!",
      trim: true,
      maxLength: 200,
    },
    skills: {
      type: [
        {
          type: String,
          minLength: 2,
          maxLength: 25,
          trim: true,
        }
      ],
      default: [],
      validate: [(val) => val.length <= 10, "Cannot have more than 10 skills"],
    }
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);