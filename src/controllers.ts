import axios from "axios";
import { generateConfig } from "./utils";
import { Request, Response } from "express";
import { google } from "googleapis";

import "dotenv/config";

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

async function sendMail(req: Request, res: Response) {
  try {
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}

async function getUser(req: Request, res: Response) {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/profile`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token as string);
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}

async function getDrafts(req: Request, res: Response) {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/drafts`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token as string);
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function readMail(req: Request, res: Response) {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/prasoon2honey@gmail.com/messages/${req.params.messageId}`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token as string);
    const response = await axios(config);

    let data = await response.data;

    res.json(data);
  } catch (error) {
    res.send(error);
  }
}
async function getInbox(req: Request, res: Response) {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/messages?q=in:inbox`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token as string);
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}

module.exports = {
  getUser,
  sendMail,
  getDrafts,
  readMail,
  getInbox,
};
