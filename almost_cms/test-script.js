require('dotenv').load();

var AWS = require('aws-sdk');
var apigateway = new AWS.APIGateway({apiVersion: '2015-07-09'});
var lambda = new AWS.Lambda({apiVersion: '2015-03-31'});



https://lqcpx32pxa.execute-api.us-east-1.amazonaws.com/deployment20190417091135

  //get method response
  console.log('METHOD RESPONSE');
  var params = {
    httpMethod: 'POST', /* required */
    resourceId: 'bcyi6en6wa', /* required */
    restApiId: 'g5vjqzxs72', /* required */
    statusCode: '200' /* required */
  };
  apigateway.getMethodResponse(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });


  //get integration response
  var params = {
    httpMethod: 'POST', /* required */
    resourceId: 'bcyi6en6wa', /* required */
    restApiId: 'g5vjqzxs72', /* required */
    statusCode: '200' /* required */
  };
  apigateway.getIntegrationResponse(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });