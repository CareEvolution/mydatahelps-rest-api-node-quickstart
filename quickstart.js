require('dotenv').config();

const jwt = require('jsonwebtoken');
const axios = require('axios');
const util = require('util');
const querystring = require('querystring');
const { v4: uuidv4 } = require('uuid');

// **NOTE!** In a real production app you would want these to be sourced from real environment variables. The .env file is just
// a convenience for development.
const rksProjectId = process.env.RKS_PROJECT_ID;
const rksServiceAccount = process.env.RKS_SERVICE_ACCOUNT;
const privateKey = process.env.RKS_PRIVATE_KEY;

const baseApiUri = 'https://rkstudio.careevolution.com/inv';

async function getFromApi(accessToken, resourceUrl, queryParams = {}) {
  var data = null;
  let api = axios.create({
    baseURL: baseApiUri,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Accept": "application/json", 
      "Content-Type": "application/json; charset=utf-8"
    }
  });
  
  await api.get(resourceUrl, { params: queryParams })
  .then(function (apiResponse) {
    if (apiResponse.status != '200') {
      logResponse(apiResponse);
    }
    else {
      data = apiResponse.data;
    }})
  .catch(function (error) {
    logResponse(error);
  });
  return data;
}

async function getAccessToken() {
    const audienceString = `${baseApiUri}/identityserver/connect/token`;
    
    const assertion = {
        "iss": rksServiceAccount,
        "sub": rksServiceAccount,
        "aud": audienceString,
        "exp": Math.floor(new Date().getTime() / 1000) + 200,
        "jti": uuidv4()
    };

    var signedAssertion;
    try {
        signedAssertion = jwt.sign(assertion, privateKey, { algorithm: 'RS256' });
    }
    catch(err) {
      console.log(`Error signing JWT. Check your private key. Error: ${err}`);
      return null;
    }
    
    const payload = {
        scope: "api",
        grant_type: "client_credentials",
        client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        client_assertion: signedAssertion
    };

    const tokenResponse = await makeAccessTokenRequest(payload); 
    if (!tokenResponse || !tokenResponse.access_token) {
        return null;
    }
    return tokenResponse.access_token;
}


async function makeAccessTokenRequest(payload) {
  return axios.post(`${baseApiUri}/identityserver/connect/token`, querystring.stringify(payload))
  .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return null;
    });
}

function logResponse(response) {
  console.log(util.inspect(response, { colors: true, depth: 3 }));
}

getAccessToken().then( token => {
  if (token) {
    console.log('Obtained access token:');
    console.log(token);
    
    const participantResourceUrl = `/api/v1/administration/projects/` + rksProjectId + '/participants';
    getFromApi(token, participantResourceUrl)
      .then(data => {
        if (data) {
          // Uncomment this to print out the full response to the console.
          // logResponse(data);
          console.log(`\nTotal Participants: ${data.totalParticipants}`);
        } else {
          console.log("Error when accessing the API.");
        }
      });
    }
    else {
      console.log("Error obtaining access token.");
    }
});