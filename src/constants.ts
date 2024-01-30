require("dotenv").config();

const auth = {
  type: "OAuth2",
  user: "prasoon2honey@gmail.com",
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
};

const mailoptions = {
  from: "Prasoon <prasoon2honey@gmail.com>",
  to: "prasoon2honey@gmail.com",
  subject: "Testing",
};

module.exports = {
  auth,
  mailoptions,
};
