// import { WebSocketServer, type WebSocket } from "ws";
// import * as http from "http";
// import * as uuid from "uuid";

// interface Connections {
//   [key: string]: WebSocket;
// }

// const server = http.createServer();
// const PORT = 8000;
// const wsServer = new WebSocketServer({ server: server });

// const connections: Connections = {};
// const users = {};

// wsServer.on("connection", (connection, request) => {
//   const randomId = uuid.v4();
//   connections[randomId] = connection;
//   console.log(connections);
//   connection.on("message", (message) => {
//     let data = JSON.parse(message.toString());
//     console.log(data);
//   });
// });

// server.listen(PORT, () => {
//   console.log(`Server is running on ${PORT}`);
// });
import express, { Request, Response } from "express";
import { router as routes } from "./routes";
import "dotenv/config";

const app = express();
const PORT = 8000;

app.use(express.json());
app.use("/api", routes);
app.get("/", async (req: Request, res: Response) => {
  res.send("Welcome to Gmail API with NodeJS");
});

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
