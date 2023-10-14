import User from "../Models/User";
import bcrypt from "bcrypt";
import tokenGenerator from "../helper/TokenGenerator";

const signUp = async (req: any, res: any) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    pic: req.body.pic,
  };
  try {
    const existingUser = await User.findOne({ email: user.email });
    // Checking Existing User
    if (existingUser) {
      return res.status(409).json({ message: "User Already Exists" });
    }
    // Password Hashing
    const saltRounds = parseInt(process.env.SALT_ROUND || "10");
    var hashedPassword = bcrypt.hashSync(user.password, saltRounds);
    user.password = hashedPassword;

    // Creating User in DB
    const data = new User(user);
    await data.save();

    //Sign JWT Token
    const loginToken = tokenGenerator(data.email, data._id);
    console.log(req.userId);
    res.status(201).json({
      message: "User Created",
      User: {
        id: data._id,
        name: data.name,
        email: data.email,
        pic: data.pic,
        Token: loginToken,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

//Login

const logIn = async (req: any, res: any) => {
  const { email, password } = req.body;
  // checking user Email Exist or not
  const user = await User.findOne({ email });

  try {
    //User Exists
    if (user) {
      // Comparing Password
      if (bcrypt.compareSync(password, user.password)) {
        // Valid User --> Signing new JWT Token
        const loginToken = tokenGenerator(user.email, user._id);
        return res.status(201).json({
          message: "Valid User",
          User: {
            id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            Token: loginToken,
          },
        });
      }

      // Email and Password not Match
      return res
        .status(404)
        .json({ message: "Email and Password Doesn't Match" });
    }
    //User doesn't Exists
    return res.status(404).json({ message: "User Not Found" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

const allUsers = async (req: any, res: any) => {
  const search = req.query.search;
  try {
    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }).find({ _id: { $ne: req.user.id } });
    if (users) {
      return res.status(201).json({ users: users });
    }
    return res.status(201).json({ users: [], message: "No users found" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export { signUp, logIn, allUsers };
