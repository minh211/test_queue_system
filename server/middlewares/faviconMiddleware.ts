import * as Path from "path";

import favicon from "serve-favicon";

export const faviconMiddleware = favicon(Path.join(__dirname, "views", "favicon.ico"));
