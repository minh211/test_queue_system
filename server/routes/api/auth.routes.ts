import { Router, Request } from "express";
import * as jwt from "jsonwebtoken";

export const authRouter = Router();

const users = [
  {
    username: "admin",
    password: "admin",
    role: "admin",
  },
  {
    username: "anna",
    password: "password123member",
    role: "member",
  },
];

const accessTokenSecret = "youraccesstokensecret";

authRouter.post("/signIn", (req: Request<never, any, { username: string; password: string }>, res) => {
  const { username, password } = req.body;

  // Filter user from the users array by username and password
  const user = users.find((u) => {
    return u.username === username && u.password === password;
  });

  if (user) {
    // Generate an access token
    const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret);

    res.status(200).json({ accessToken });
  } else {
    res.status(403).send("Username or password incorrect");
  }
});
