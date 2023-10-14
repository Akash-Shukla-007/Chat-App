import User from "../Models/User";

const jwt = require("jsonwebtoken");

const authMiddleware = async (req: any, res: any, next: any) => {
  if (req.headers.authorization) {
    try {
      var token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error: any) {
      return res.status(500).json({ message: "Invalid Token" });
    }
  } else {
    return res.status(400).json({ message: "No Token" });
  }
};

export { authMiddleware };
