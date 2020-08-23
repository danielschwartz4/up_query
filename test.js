import * as AWS from 'aws-sdk/global';
 
var authenticationData = {
    Username: 'username',
    Password: 'password',
};
var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    authenticationData
);
const poolData = {
  UserPoolId: process.env.USER_POOL_ID,
  ClientId: process.env.CLIENT_ID
};


var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
var userData = {
    Username: 'username',
    Pool: userPool,
};

var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function(result) {
        var accessToken = result.getAccessToken().getJwtToken();
        var string = `cognito-idp.${process.env.POOL_REGION}.amazonaws.com/${process.env.USER_POOL_ID}`
        //POTENTIAL: Region needs to be set if not already set previously elsewhere.
        AWS.config.region = process.env.POOL_REGION;
 
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: process.env.IDENTITY_POOL_ID, // your identity pool id here
            Logins: {
                // Change the key below according to the specific region your user pool is in.
                string: result
                    .getIdToken()
                    .getJwtToken(),
            },
        });
 
        //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
        AWS.config.credentials.refresh(error => {
            if (error) {
                console.error(error);
            } else {
                // Instantiate aws sdk service objects now that the credentials have been updated.
                // example: var s3 = new AWS.S3();
                console.log('Successfully logged!');
            }
        });
    },
 
    onFailure: function(err) {
        alert(err.message || JSON.stringify(err));
    },
});