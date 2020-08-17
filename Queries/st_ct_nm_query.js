function stateCityNameFunc() {
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

  app.get("/states/:state/:city/:name", (req, res) => {
    let state = req.params.state;
    let city = req.params.city;
    let cityParsed = city.split('_').join(" ");
    let name = req.params.name;
    let names = name.split("_");
    let firstName = names[0];
    let lastName = names[1];
    let query = {
      sql: `
            SELECT 
              * 
            FROM 
              alldata 
            WHERE owner_state = '${state}' 
            AND owner_city = '${cityParsed}' 
            AND owner_firstname = '${firstName}' 
            AND owner_last = '${lastName}' 
            LIMIT 100
            `,
      db: "updata",
    };
    athenaExpress
      .query(query)
      .then((results) => {
        res.send(results);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  app.get("/states/:state/:city/:street/:name", (req, res) => {
    let state = req.params.state;
    let city = req.params.city;
    let cityParsed = city.split("_").join(" ");
    let street = req.params.street;
    let streetParsed = street.split("_").join(" ");
    let name = req.params.name;
    let names = name.split("_");
    let firstName = names[0];
    let lastName = names[1];
    let query = {
      sql: `
            SELECT 
              * 
            FROM 
              alldata 
            WHERE 
              owner_state = '${state}' 
              AND owner_city = '${cityParsed}' 
              AND owner_street_1 = '${streetParsed}' 
              AND owner_firstname = '${firstName}' 
              AND owner_last = '${lastName}' 
              LIMIT 10
            `,
      db: "updata",
    };
    athenaExpress
      .query(query)
      .then((results) => {
        res.send(results);
      })
      .catch((error) => {
        console.log(error);
      });
  });
  
}

module.exports = {stateCityNameFunc}