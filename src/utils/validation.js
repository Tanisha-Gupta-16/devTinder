const validator = require("validator");

const validateSignupData = (data) => {
  const { firstName, lastName, emailId, password } = data?.body;
  const SIGNUP_FIELDS = ["firstName", "emailId", "lastName", "password"];
  const isSignupAllowed = SIGNUP_FIELDS.every(
    (field) => field in data?.body && data?.body[field]?.trim() !== "",
  );
  if (!isSignupAllowed) {
    throw new Error("All fields must be filled");
  }
  if (!firstName || !lastName) {
    throw new Error("Please enter a valid name");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Please enter a valid email");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a passwod");
  }
};

const validateEditProfileData = (data) => {
  const ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "about",
    "skills",
    "photoUrl",
    "age",
    "gender",
  ];
  const user = data?.body;
  const isUpdateAllowed = Object.keys(user).every((key) =>
    ALLOWED_UPDATES.includes(key),
  );
  return isUpdateAllowed;
};

module.exports = { validateSignupData, validateEditProfileData };
