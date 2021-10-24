import { Router } from "express";

import { signIn, signUp } from "../../controllers";

export const authRouter = Router();

authRouter.post("/signIn", signIn);
authRouter.post("/signUp", signUp);
