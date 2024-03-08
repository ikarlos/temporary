import axios from "axios";
import btoa from "btoa";
import request from "request"

const sendotp = async (number) => {
  try {
    const options = {
      url: 'https://api.enablex.io/sms/v1/messages/',
      json: true,
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic NjVjNWQ1ODkzNzNmYTc4Y2FkMDIyZWUzOk1hdGV6ZVp1YXVnZVV1YWFxeWp1aHVCeUdlU2FzeXplN3lOdQ==',
      },
      body: {
          
          type: "sms",
          data_coding: "auto",
          campaign_id: "20475230", 
          recipient: [{"to":"+91"+number}],
from: "ENABLX",
template_id: "901"
      }
  };   
  request.post(options, (err, res, body) => {
      if (err) {
          return console.log(err);
      }
      console.log(`Status: ${res.statusCode}`);
      console.log(body);
  });

  } catch (error) {
    console.error("Error sending OTP:", error.message);
    // Handle the error appropriately
  }
};

export default sendotp;
