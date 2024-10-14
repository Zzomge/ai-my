const axios = require("axios");

// แทนที่ process.env.CHANNEL_ACCESS_TOKEN ด้วยค่า token ของคุณโดยตรง
const CHANNEL_ACCESS_TOKEN = "7249a1e1af36547090174c97508711ca"
const LINE_HEADER = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`
};

const getImageBinary = async (messageId) => {
  const originalImage = await axios({
    method: "get",
    headers: LINE_HEADER,
    url: `https://api-data.line.me/v2/bot/message/${messageId}/content`,
    responseType: "arraybuffer"
  });
  return originalImage.data;
};

const reply = (token, payload) => {
  return axios({
    method: "post",
    url: "https://api.line.me/v2/bot/message/reply",
    headers: LINE_HEADER,
    data: { replyToken: token, messages: payload }
  });
};

module.exports = { getImageBinary, reply };
