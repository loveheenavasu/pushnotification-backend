const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
const port = 3000; // Set your desired port
const cors = require("cors"); // Import the cors middleware

const admin = require("firebase-admin");
const getmessage = require("firebase-admin/messaging");

const serviceAccount = require("./notification-23222-firebase-adminsdk-v8fmn-a2aff1f562.json");
app.use(cors()); // Use cors middleware

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// const messaging = getMessaging;

console.log(getmessage, "getmessage");

app.use(bodyParser.json());

// Define an API route to send push notifications
app.post("/send-notification", async (req, res) => {
  try {
    // Get registration tokens and notification data from the request
    const { registrationTokens, notificationData } = req.body;

    const message = {
      data: notificationData, // Notification data (e.g., title, body)
      tokens: registrationTokens, // Array of registration tokens
    };
    console.log(req.body, "req.body");
    // Send a push notification using the axios library or Firebase Admin SDK
    getmessage
      .getMessaging()
      .sendEachForMulticast(message)
      .then((response) => {
        console.log(response.responses, "----reponse----", response.successCount,"---count---");
        // console.log(response + " messages were sent successfully");
      });
    // Replace this with your FCM or custom notification logic

    // Respond with success or an error message
    res.json({ message: "Push notification sent successfully" });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ error: "Error sending push notification" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
