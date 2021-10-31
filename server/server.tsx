import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import { buildSchema } from "type-graphql";
import { DoctorResolver } from "./resolvers/doctor.resolvers";
import { io } from "./io";

import * as dotenv from "dotenv";
import { Express } from "express";
import { app } from "./app";

dotenv.config();

async function startApolloServer(app: Express) {
  // Required logic for integrating with Express
  const httpServer = createServer(app);

  io.attach(httpServer);

  const schema = await buildSchema({
    resolvers: [DoctorResolver],
    emitSchemaFile: {
      path: "server/schema/schema.graphql",
    },
  });

  const server = new ApolloServer({ schema });

  await server.start();
  server.applyMiddleware({ app, path: "/api/v2" });

  const port = process.env.PORT || 4000;

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(app);
