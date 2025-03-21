require("dotenv").config();
const express = require("express");
const app = express();
const cors = require('cors')
const twilio = require("twilio");
const port = 3000;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
// console.log(twilioPhoneNumber)

const client = new twilio(accountSid, authToken);

app.post("/demo", async(req,res)=>{
  const nm= req.body.phone
  console.log(nm)
  res.send({message:"hello world"})
})

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/call-owner", async (req, res) => {
  const toNumber = req.body.phone;
  // return console.log(toNumber);
  // res.send({message:"test"})

  client.calls
    .create({
      url: "https://face-detector-backend-nine.vercel.app/call-handler", // URL for TwiML instructions
      to: toNumber,
      from: twilioPhoneNumber,
    })
    .then((call) => {
      console.log(`Call SID: ${call.sid}`);
      res.send("Call initiated!");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error making call");
    });
});

app.post("/call-handler", (req, res) => {
  const response = new twilio.twiml.VoiceResponse();

  // Customize your message here
  response.say("Hello! This is an automated call from our system.");
  response.pause({ length: 1 });
  response.say("Thank you for your time. Goodbye!");

  res.type("text/xml");
  res.send(response.toString());
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
