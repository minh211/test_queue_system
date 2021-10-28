import { Router } from "express";

import { faviconMiddleware } from "../../middlewares";
import { viewController } from "../../controllers";

export const viewRouter = Router();

viewRouter.use(faviconMiddleware);

viewRouter.get(["/queue", "/doctors"], viewController);
viewRouter.get("*", viewController);
