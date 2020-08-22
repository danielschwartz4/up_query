exports.Login = function (body, callback) {
  var userName = body.name;
  var password = body.password;
  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
       Username: userName,
       Password: password
   });
   var userData = {
       Username: userName,
       Pool: userPool
   }
   var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
   cognitoUser.authenticateUser(authenticationDetails, {
       onSuccess: function (result) {
          var accesstoken = result.getAccessToken().getJwtToken();
          callback(null, accesstoken);
       },
       onFailure: (function (err) {
          callback(err);
      })
  })
};

exports.login = function(req, res){
  let login = authService.Login(req.body, function(err, result){
      if(err)
         res.send(err)
      res.send(result);
  })
}

exports.validate_token = function(req, res){
  let validate = authService.Validate(req.body.token,function(err, result){
      if(err)
          res.send(err.message);
      res.send(result);
  })
}