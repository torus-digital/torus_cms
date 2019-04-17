require('dotenv').load();

var AWS = require('aws-sdk');
var apigateway = new AWS.APIGateway({apiVersion: '2015-07-09'});


//get the API

var params = {
    restApiId: 'dquw9oidca' /* required */
  };
  apigateway.getRestApi(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
  

//get the resource

  var params = {
    restApiId: 'dquw9oidca', /* required */
  };
  apigateway.getResources(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log("RESOUCRES: ", data.items[0].id);           // successful response
  });


  //get method
  var params = {
    httpMethod: 'POST', /* required */
    resourceId: 'd34ey94tal', /* required */
    restApiId: 'dquw9oidca' /* required */
  };
  apigateway.getMethod(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log("METHOD: ", data);           // successful response
  });


  //get integration
  var params = {
    httpMethod: 'POST', /* required */
    resourceId: 'd34ey94tal', /* required */
    restApiId: 'dquw9oidca' /* required */
  };
  apigateway.getIntegration(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log("INTEGRATION: ", data);           // successful response
  });


  //get deployment
  var params = {
    restApiId: 'dquw9oidca', /* required */
  };
  apigateway.getDeployments(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log("DEPLOYMENT: ", data);           // successful response
  });