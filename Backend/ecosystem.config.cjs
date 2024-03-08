module.exports = {
  apps: [
    {
      name: "myapp",
      script: "./src/index.js",
      watch: false,
      env: {
        "NODE_ENV": "development",
        "PORT": "80",
        "MONGODB_URI": "mongodb+srv://mailtomydoctor:4YweeAQEH25HKOpf@cluster0.m3fosfh.mongodb.net",
        "CORS_ORIGIN": "*",
        "ACCESS_TOKEN_SECRET": "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwNjE2NTY0OCwiaWF0IjoxNzA2MTY1NjQ4fQ.f5lmUkz_9phHwUh2iiSYqMGoVEeVuTozYYp-yG1AlQM",
        "ACCESS_TOKEN_EXPIRY": "1d",
        "REFRESH_TOKEN_SECRET": "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwNjE2NjI3OSwiaWF0IjoxNzA2MTY2Mjc5fQ.XCdSrKbCLXkxQpxvJpbIkQ7BJRIoiivaagvUoFFTO5g",
        "REFRESH_TOKEN_EXPIRY": "10d",
        "TWILIO_ACCOUNT_SID": "AC3d32aa77648a40dd98d2c0276b6e8334",
        "TWILIO_AUTH_TOKEN": "c3b907156819819f9bcd6f6d0d147e91",
        "TWILIO_SERVICE_SID": "VAd93d9cc75b045554b39fa24c0583711f",
        "MERCHANT_ID": "PGTESTPAYUAT",
        "UAT_HOST_URL": "https://api-preprod.phonepe.com/apis/pg-sandbox",
        "SALT_INDEX": "1",
        "SALT_KEY": "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399",
        "APP_BE_URL": "http://northscapegroup.com",
        "PHONE_PE_HOST_URL": "https://api-preprod.phonepe.com/apis/pg-sandbox"
      }
    }
  ]
};


