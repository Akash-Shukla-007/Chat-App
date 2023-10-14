import jwt from "jsonwebtoken";

const tokenGenerator = (email: string, id: any) => {
  var secretKey = process.env.JWT_SECRET;
  var token = jwt.sign({ email, id }, secretKey!);
  return token;
};

export default tokenGenerator;
