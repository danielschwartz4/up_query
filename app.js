const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const AthenaExpress = require('athena-express')

// athena logic

const aws = require("aws-sdk");
const awsCredentials = {
  region: "us-east-2",
  accessKeyId: "AKIA3OA4SIGHE76FA2OV",
  secretAccessKey: "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",
};
aws.config.update(awsCredentials);

const athenaExpressConfig = { aws }; //configuring athena-express with aws sdk object
const athenaExpress = new AthenaExpress(athenaExpressConfig);

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true,}));

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

// athena test route

let myQuery = {
  sql: "SELECT * FROM wv_up_data limit 10", /* required */
  db: "up_data"
};

app.get("/test_query", (req, res) => {
  athenaExpress
    .query(myQuery)
    .then((results) => {
      res.json(results);
    })
    .catch((error) => {
      console.log(error);
    });
})

app.listen(port, () => console.log("runnnnnnnning..."))


