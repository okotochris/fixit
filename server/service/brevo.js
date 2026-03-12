const SibApiV3Sdk = require('sib-api-v3-sdk');
let defaultClient = SibApiV3Sdk.ApiClient.instance;
require("dotenv").config();
// Configure API key
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY; // store this in Railway variables

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let sender = 'info@studynest.com.ng';

async function sendEmail(userEmail, msg) {
  let sendSmtpEmail = {
    sender: { email: sender, name: "Fixit.com" },
    to: [{ email: userEmail, name: "User" }],
    subject: "Fixit Verification Code",
    htmlContent: msg,
  };

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log("Email sent ✅:", data);
      return true
    },
    function (error) {
      console.error("Error sending email ❌:", error);
    }
  );
}

module.exports = sendEmail;
