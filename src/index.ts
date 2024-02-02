import express, { Request, Response } from "express";
import { router as routes } from "./routes";
import "dotenv/config";
import { google } from "googleapis";
import bodyParser from "body-parser";
import { generateConfig } from "./utils";
import axios from "axios";

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

app.post("/api", async (req, res) => {
  const url = `https://gmail.googleapis.com/gmail/v1/users/prasoon2honey@gmail.com/messages?q=in:inbox`;
  const { token } = await oAuth2Client.getAccessToken();
  const config = generateConfig(url, token as string);
  const response = await axios(config);
  const newEmails = response.data;

  latestEmail = newEmails?.messages[0];
  latestEmailId = newEmails?.messages[0].id;
  await readMail(latestEmailId);

  res.status(200).send("OK");
});
async function readMail(id: any[]) {
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
  // myApi.push(latestEmail);
  // myApi.push(latestEmailId);
  // myApi.push(latestEmailFullData);
  res.json({
    latestEmailTo,
    latestEmailFrom,
    latestEmailSubject,
    latestEmailFullData,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});
const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

const watchParams = {
  userId: "me",
  resource: {
    labelIds: ["INBOX"],
    topicName: "projects/readydesk-api/topics/pubsubforemail",
  },
};

async function watchEmails() {
  try {
    const { data } = await gmail.users.watch(watchParams);
    console.log("Watch response:", data);
  } catch (error: any) {
    console.error("Error watching user:", error.message);
  }
}
watchEmails();
