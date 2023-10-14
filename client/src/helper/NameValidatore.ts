const NameValidator = (name: string) => {
  if (name == "") {
    return "Name is required";
  }
  return true;
};

export default NameValidator;
