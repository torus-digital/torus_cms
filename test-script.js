require('dotenv').load();

var AWS = require('aws-sdk');
var apigateway = new AWS.APIGateway({apiVersion: '2015-07-09'});
var lambda = new AWS.Lambda({apiVersion: '2015-03-31'});



https://lqcpx32pxa.execute-api.us-east-1.amazonaws.com/deployment20190417091135

  //get method response
  console.log('METHOD RESPONSE');
  var params = {
    httpMethod: 'POST', /* required */
    resourceId: 'd34ey94tal', /* required */
    restApiId: 'dquw9oidca', /* required */
    statusCode: '200' /* required */
  };
  apigateway.getMethodResponse(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log('METHOD RESPONSE ', data);           // successful response
  });


  console.log('INTEGRATION RESPONSE')
  var params = {
    httpMethod: 'POST', /* required */
    resourceId: 'd34ey94tal', /* required */
    restApiId: 'dquw9oidca', /* required */
    statusCode: '200' /* required */
  };
  apigateway.getIntegrationResponse(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log('INTEGRATION RESPONSE', data);           // successful response
  });