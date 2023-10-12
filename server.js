const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
const port = 3000; // Set your desired port
const cors = require("cors"); // Import the cors middleware

const admin = require("firebase-admin");

const serviceAccount = require("./notification-23222-firebase-adminsdk-v8fmn-a2aff1f562.json");
app.use(cors()); // Use cors middleware

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(bodyParser.json());

// Define an API route to send push notifications
app.post("/send-notification", async (req, res) => {
  try {
    // Get registration tokens and notification data from the request
    const { registrationTokens, notificationData, data, tokenToExclude } = req.body;

    // Remove the token you want to exclude
    const filteredTokens = registrationTokens.filter(token => token !== tokenToExclude);

    if (filteredTokens.length === 0) {
      return res.status(400).json({ error: "No valid tokens to send to." });
    }

    const message = {
      data: notificationData, // Notification data (e.g., title, body)
      tokens: filteredTokens, // Array of registration tokens (with excluded token)
      notification: data
    };

    // Send a push notification using the axios library or Firebase Admin SDK
    admin.messaging()
      .sendEachForMulticast(message)
      .then((response) => {
        console.log(response.responses, "----response----", response.successCount, "---count---");
      })
      .catch((error) => {
        console.error("Error sending push notification:", error);
        res.status(500).json({ error: "Error sending push notification" });
      });

    // Respond with success
    res.json({ message: "Push notification sent successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Error sending push notification" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
