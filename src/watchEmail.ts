import { google } from "googleapis";

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

export async function watchEmails() {
  try {
    const { data } = await gmail.users.watch(watchParams);
    console.log("Watch response:", data);
  } catch (error: any) {
    console.error("Error watching user:", error.message);
  }
}
