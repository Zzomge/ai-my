const express = require('express');
const line = require('./utils/line');
const gemini = require('./utils/gemini');
const app = express();

app.use(express.json());

// Route for handling webhook events
app.post('/webhook', async (req, res) => {
  try {
    const events = req.body.events;

    for (const event of events) {
      if (event.type === "message") {
        if (event.message.type === "text") {
          const msg = await gemini.chat(event.message.text);
          await line.reply(event.replyToken, [{ type: "text", text: msg }]);
          return res.end();
        }

        if (event.message.type === "image") {
          const imageBinary = await line.getImageBinary(event.message.id);
          const msg = await gemini.multimodal(imageBinary);
          await line.reply(event.replyToken, [{ type: "text", text: msg }]);
          return res.end();
        }
      }
    }

    res.status(200).send('OK'); // Respond with 200 OK if no issues
  } catch (error) {
    console.error("Error processing event:", error);
    res.status(500).send('Internal Server Error'); // Respond with error status
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
