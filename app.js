const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;
const AthenaExpress = require('athena-express')
require('dotenv').config()
const test_query = require('./Queries/test_query')
const state_query = require('./Queries/state_query')
const city_query = require('./Queries/city_query')
const name_query = require('./Queries/name_query')
const state_name_query = require('./Queries/state_name_query')
const st_ct_nm_query = require('./Queries/st_ct_nm_query')
const st_ct_nm_ad_query = require('./Queries/st_ct_nm_ad_query')

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const poolData = {
   UserPoolId: process.env.USER_POOL_ID,
   ClientId: process.env.CLIENT_ID
};

const pool_region = "us-east-2";

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// athena logic

const aws = require("aws-sdk");
const awsCredentials = {
  region: "us-east-2",
  accessKeyId: process.env.MY_KEY,
  secretAccessKey: process.env.SECRET_KEY,
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

Validate = function(token, callback){
  request({
      url : `https://cognito
idp.${pool_region}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
      json : true
   }, function(error, response, body){
      if (!error && response.statusCode === 200) {
          pems = {};
          var keys = body['keys'];
          for(var i = 0; i < keys.length; i++) {
               var key_id = keys[i].kid;
               var modulus = keys[i].n;
               var exponent = keys[i].e;
               var key_type = keys[i].kty;
               var jwk = { kty: key_type, n: modulus, e: exponent};
               var pem = jwkToPem(jwk);
               pems[key_id] = pem;
          }
       var decodedJwt = jwt.decode(token, {complete: true});
               if (!decodedJwt) {
                   console.log("Not a valid JWT token");
                   callback(new Error('Not a valid JWT token'));
               }
               var kid = decodedJwt.header.kid;
               var pem = pems[kid];
               if (!pem) {
                   console.log('Invalid token');
                   callback(new Error('Invalid token'));
               }
              jwt.verify(token, pem, function(err, payload) {
                   if(err) {
                       console.log("Invalid Token.");
                       callback(new Error('Invalid token'));
                   } else {
                        console.log("Valid Token.");
                        callback(null, "Valid token");
                   }
              });
      } else {
            console.log("Error! Unable to download JWKs");
            callback(error);
      }
  });
}


app.post("/sessions", (req, res) => {
  console.log('Inside POST /login callback function')
  console.log(req.body)
  Validate()
  res.send(`You posted to the login page!\n`)
})

app.listen(port, () => console.log("runnnnnnnning..."))


