const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const AthenaExpress = require('athena-express')
const test_query = require('./Queries/test_query')
const state_query = require('./Queries/state_query')
const city_query = require('./Queries/city_query')
const name_query = require('./Queries/name_query')
const state_name_query = require('./Queries/state_name_query')
const st_ct_nm_query = require('./Queries/st_ct_nm_query')
const st_ct_nm_ad_query = require('./Queries/st_ct_nm_ad_query')


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

// athena test route

let myQuery = {
  sql: "SELECT * FROM alldata limit 1000", /* required */
  db: "updata"
};

app.get("/test_query", (req, res) => {
  athenaExpress
    .query(myQuery)
    .then((results) => {
      res.send(results);
      console.log("test_query")
    })
    .catch((error) => {
      console.log(error);
    });
})

// test_query.testFunc()

// query by state

app.get("/states/:state", (req, res) => {
  let state = req.params.state;
  let stateQuery = {
    sql: `SELECT * FROM alldata WHERE owner_state = '${state}' LIMIT 100`,
    db: 'updata'
  };
  athenaExpress
    .query(stateQuery)
    .then((results) => {
      res.send(results);
      console.log("states")
    })
    .catch((error) => {
      console.log(error);
    });
})

// state_query.stateFunc()


// query by city

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

// city_query.cityFunc()

// query by name

app.get("/names/:name", (req, res) => {
  let name = req.params.name;
  let names = name.split('_');
  let firstName = names[0];
  let lastName = names[1];
  let nameQuery = {
    sql: `
          SELECT 
            * 
          FROM alldata 
          WHERE owner_firstname = '${firstName}' 
          AND owner_last = '${lastName}' 
          LIMIT 100
          `,
    db: "updata",
  };
  athenaExpress
    .query(nameQuery)
    .then((results) => {
      res.send(results);
    })
    .catch((error) => {
      console.log(error);
    });
});

// name_query.nameFunc()

// query by state and name

app.get("/states/:state/:name", (req, res) => {
  console.log(req.params)
  let state = req.params.state;
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

// state_name_query.stateNameFunc()

// query by state, city and name

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

// st_ct_nm_query.stateCityNameFunc()

// query by state, city, address and name

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
// st_ct_nm_ad_query.stateCityNameAddressFunc()

app.listen(port, () => console.log("runnnnnnnning..."))


