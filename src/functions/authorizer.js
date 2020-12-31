//https://medium.com/@chrisconcannon/nodejs-lambda-authorizer-for-json-web-tokens-334fbd6d3228
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const jwksUri = process.env.JWKS_URI;
const keyClient = jwksClient({
    cache: true,
    useTmpFileCache:true,
    cacheMaxAge: 86400000, //value in ms
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    strictSsl: true,
    jwksUri: jwksUri //"https://www5.wipo.int/am/oauth2/connect/jwk_uri" URI Will be environment specific using Env variables
})

const verificationOptions = {
    // verify claims, e.g.
    // "audience": "urn:audience"
    "algorithms": "RS256"
}

const allow = {
    "principalId": "user",
    "policyDocument": {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Action": "execute-api:Invoke",
                "Effect": "Allow",
                "Resource": "*"
            }
        ]
    }
}

function getSigningKey (header, callback) {
    keyClient.getSigningKey(header.kid, function(err, key) {
        if(err){
            return;
        }
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    })
}
function extractTokenFromHeader(e) {
    if (e.authorizationToken && e.authorizationToken.split(' ')[0] === 'Bearer') {
        return e.authorizationToken.split(' ')[1];
    } else {
        return e.authorizationToken;
    }
}
function validateToken(token, callback) {
    jwt.verify(token, getSigningKey, function (error) {
        if (error) {
            console.log("AUTH ERROR>>>",error);
            callback("Unauthorized")
        } else {
            callback(null, allow)
        }
    })
}
exports.handler = (event, context, callback) => {
    console.log("EVT>>>",event);
    let token = extractTokenFromHeader(event) || '';
    validateToken(token, callback);
}