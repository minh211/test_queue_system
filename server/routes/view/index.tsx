import { Router } from "express";

import { authenticateMiddleware, viewMiddlewares } from "../../middlewares";
import { viewController } from "../../controllers";

export const viewRouter = Router();

viewRouter.use(viewMiddlewares);

viewRouter.get(["/", "/signIn"], viewController);
viewRouter.get(["/queue", "/doctors"], authenticateMiddleware, viewController);
