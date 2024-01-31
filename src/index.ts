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

// import express, { Request, Response } from "express";
// import { router as routes } from "./routes";
// import "dotenv/config";
// import { google } from "googleapis";

// const app = express();
// const PORT = 8000;

// app.use(express.json());
// app.use("/api", routes);
// app.get("/", async (req: Request, res: Response) => {
//   res.send("Welcome to Gmail API with NodeJS");
// });

// app.listen(PORT, () => {
//   console.log("listening on port " + PORT);
// });

// import express, { Request, Response } from "express";
// import { router as routes } from "./routes";
// import "dotenv/config";
// import { google } from "googleapis";
// import bodyParser from "body-parser";
// import { generateConfig } from "./utils";

// const app = express();
// const port = 8000;

// app.use(bodyParser.json());

// app.get("/api", (req: Request, res: Response) => {
//   console.log("Received push notification:", req.body);
//   // Handle the new email event and trigger the necessary logic.
//   res.status(200).send("OK");
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// const oAuth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.GOOGLE_REDIRECT_URI
// );
// oAuth2Client.setCredentials({
//   refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
// });
// const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

// const watchParams = {
//   userId: "prasoon2honey@gmail.com",
//   resource: {
//     labelIds: ["INBOX"],
//     topicName: "projects/readydesk-api/topics/pubsubforemail",
//   },
// };
// async function watch() {
//   const watchResponse = await gmail.users.watch(watchParams);
//   const expiration = watchResponse.data.expiration;
//   console.log("Watch response:", watchResponse.data);
// }
// watch();
