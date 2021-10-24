import { Router } from "express";

import { authenticateMiddleware, viewMiddlewares } from "../../middlewares";
import { viewController } from "../../controllers";

export const viewRouter = Router();

viewRouter.get(["/", "/signIn", "/queue", "/doctors"], authenticateMiddleware, viewMiddlewares, viewController);
