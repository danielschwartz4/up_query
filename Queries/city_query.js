function cityFunc() {
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
  app.use(bodyParser.urlencoded({extended: false,}));
  
  app.get("/", (request, response) => {
    response.json({ info: "Node.js, Express, and Postgres API" });
  });

  app.get("/cities/:city", (req, res) => {
    let city = req.params.city;
    let cityParsed = city.split('_').join(" ")
    let cityQuery = {
      sql: `SELECT * FROM alldata WHERE owner_city = '${cityParsed}' LIMIT 100`,
      db: "updata",
    };
    athenaExpress
      .query(cityQuery)
      .then((results) => {
        res.send(results);
      })
      .catch((error) => {
        console.log(error);
      });
  });

} 

module.exports = {cityFunc}