const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, password } = req.body;
  if (!validator.isStrongPassword(password)) {
    throw new Error("The password must be of atleast 8 characters, consisting of atleast one uppercase character, one lowercase character, one digit and one symbol");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
