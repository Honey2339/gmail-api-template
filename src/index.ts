import express, { Request, Response } from "express";
import "dotenv/config";
import { google } from "googleapis";
import bodyParser from "body-parser";
import { generateConfig } from "./utils";
import axios from "axios";
import { type WebSocket, WebSocketServer } from "ws";
import http from "http";
import { watchEmails } from "./watchEmail";
import { EventEmitter } from "stream";

const app = express();
const port = 8000;

app.use(bodyParser.json());

let latestEmail: any[] = [];
let latestEmailId: any[] = [];
let latestEmailFullData: any[] = [];
let latestEmailTo: any[] = [];
let latestEmailFrom: any[] = [];
let latestEmailSubject: any[] = [];
let latestEmailBody: any[] = [];
let myApi: any[] = [];
const eventEmitter = new EventEmitter();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

app.post("/api", async (req, res) => {
  const url = `https://gmail.googleapis.com/gmail/v1/users/prasoon2honey@gmail.com/messages?q=in:inbox`;
  const { token } = await oAuth2Client.getAccessToken();
  const config = generateConfig(url, token as string);
  const response = await axios(config);
  const newEmails = response.data;

  latestEmail = newEmails?.messages[0];
  latestEmailId = newEmails?.messages[0].id;
  await readMail(latestEmailId);

  eventEmitter.emit("updatedEmail", {
    ID: latestEmail,
    To: latestEmailTo,
    From: latestEmailFrom,
    Subject: latestEmailSubject,
    Body: latestEmailBody,
  });
  res.status(200).send("OK");
  // console.log({
  //   ID: latestEmail,
  //   To: latestEmailTo,
  //   From: latestEmailFrom,
  //   Subject: latestEmailSubject,
  //   Body: latestEmailBody,
  // });
});
export async function readMail(id: any[]) {
  const url = `https://gmail.googleapis.com/gmail/v1/users/prasoon2honey@gmail.com/messages/${id}`;
  const { token } = await oAuth2Client.getAccessToken();
  const config = generateConfig(url, token as string);
  const response = await axios(config);

  let data = await response.data;
  latestEmailFullData = data;
  latestEmailBody = data?.snippet;
  latestEmailTo = data?.payload?.headers[0];
  latestEmailFrom = data?.payload?.headers[16];
  latestEmailSubject = data?.payload?.headers[19];
}
app.get("/emails", async (req: Request, res: Response) => {
  res.json({
    ID: latestEmail,
    To: latestEmailTo,
    From: latestEmailFrom,
    Subject: latestEmailSubject,
    Body: latestEmailBody,
  });
});
watchEmails();
const server = http.createServer(app);

const wsServer = new WebSocketServer({ server: server });

wsServer.on("connection", (connection, request) => {
  // connection.send(
  //   JSON.stringify({
  //     ID: latestEmail,
  //     To: latestEmailTo,
  //     From: latestEmailFrom,
  //     Subject: latestEmailSubject,
  //     Body: latestEmailBody,
  //   })
  // );
  const updateHandler = (updatedEmail: any) => {
    connection.send(
      JSON.stringify({
        ID: latestEmail,
        To: latestEmailTo,
        From: latestEmailFrom,
        Subject: latestEmailSubject,
        Body: latestEmailBody,
      })
    );
  };
  eventEmitter.on("updatedEmail", updateHandler);
  connection.on("close", () => {
    eventEmitter.off("updatedEmail", updateHandler);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
