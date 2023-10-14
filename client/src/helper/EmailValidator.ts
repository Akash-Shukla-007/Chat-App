const EmailValidator = (email: string) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (email == "") {
    return "Email is required";
  }
  if (!re.test(email)) {
    return "Enter valid email";
  }
  return true;
};

export default EmailValidator;
