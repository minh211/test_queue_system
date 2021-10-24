import { Router } from "express";

import { authenticateMiddleware, faviconMiddleware } from "../../middlewares";
import { viewController } from "../../controllers";

export const viewRouter = Router();

viewRouter.use(faviconMiddleware);

viewRouter.get(["/queue", "/doctors"], authenticateMiddleware, viewController);
viewRouter.get("*", viewController);
