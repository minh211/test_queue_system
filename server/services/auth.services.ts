import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

import { User } from "../models";

export async function createUser(username: string, password: string): Promise<void> {
  bcrypt.hash(password, 10).then(async (hash: string) => {
    await User.create({ username, hash });
  });
}

async function validateUser(username: string, password: string): Promise<boolean> {
  const user = await User.findOne({ where: { username } });

  if (!user) {
    return false;
  }

  return bcrypt.compare(password, user.hash);
}

export async function generateToken(username: string, password: string): Promise<string | undefined> {
  const validUser = await validateUser(username, password);

  if (validUser) {
    return jwt.sign({ username }, process.env.JWT_ACCESS_TOKEN as string);
  }
  return undefined;
}

export function verifyToken(token: string): boolean {
  let verified = false;
  jwt.verify(token, process.env.JWT_ACCESS_TOKEN as string, (err) => {
    if (!err) {
      verified = true;
    }
  });

  return verified;
}
