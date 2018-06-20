/**
  In order to test the Lambda functions with the application locally, we need 
  to be on the same host (CORS and all that). 
  
  This is a simple reverse proxy to do just that.
*/

const redbird = require('redbird')
const { propOr, match } = require('ramda')

const functionsPrefixRegex = /\.netlify\/functions\/(.*)/
const urlPointsToFunction = match(functionsPrefixRegex)

const proxy = redbird({ 
  port: 1234,
  resolvers: [
      (host, url, req) => {
        const [isPointingAtFunction, functionName] = urlPointsToFunction(url)
        
        if (isPointingAtFunction) {
          return `http://127.0.0.1:9000/${functionName}`
        }
        else {
          return `http://127.0.0.1:3000/`
        }
      }
  ]
})