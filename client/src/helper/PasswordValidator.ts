const PasswordValidator = (password: string) => {
  if (password === "") {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password should not be less than 8 characters";
  }
  if (password.search(/\d+/g) < 0) {
    return "Password must contain atleast one Number";
  }
  if (password.search(/[A-Z]/) < 0) {
    return "Password must contain atleast one Uppercase character";
  }
  return true;
};

export default PasswordValidator;
