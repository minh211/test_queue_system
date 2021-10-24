import * as http from "http";

import * as dotenv from "dotenv";

import { io } from "./io";
import { app } from "./app";

dotenv.config({ debug: true });

const server = http.createServer(app);

io.attach(server);

const PORT = process.env.PORT || 1604;

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
