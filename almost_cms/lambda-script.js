//load files from the .env file
require('dotenv').load();
const fs = require('fs');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

// Load credentials and set region from JSON file
// AWS.config.loadFromPath('./config.json');    //Currently loading from env file

var iam = new AWS.IAM({apiVersion: '2010-05-08'});
var lambda = new AWS.Lambda({apiVersion: '2015-03-31'});
var apigateway = new AWS.APIGateway({apiVersion: '2015-07-09'});

const copyPolicy = (
    `{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "ListSourceAndDestinationBuckets",
                "Effect": "Allow",
                "Action": [
                    "s3:ListBucket",
                    "s3:ListBucketVersions"
                ],
                "Resource": [
                    "arn:aws:s3:::${process.argv[3]}",
                    "arn:aws:s3:::${process.argv[2]}"
                ]
            },
            {
                "Sid": "SourceBucketGetObjectAccess",
                "Effect": "Allow",
                "Action": [
                    "s3:GetObject",
                    "s3:GetObjectVersion"
                ],
                "Resource": "arn:aws:s3:::${process.argv[3]}/*"
            },
            {
                "Sid": "DestinationBucketPutObjectAccess",
                "Effect": "Allow",
                "Action": [
                    "s3:PutObject"
                ],
                "Resource": "arn:aws:s3:::${process.argv[2]}/*"
            }
        ]
    }`
);

const trustRel =`{"Version": "2012-10-17","Statement": [{"Effect": "Allow","Principal": {"Service": "lambda.amazonaws.com"},"Action": "sts:AssumeRole"}]}`;
const uniqNow = new Date().toISOString().replace(/-/, '').replace(/-/, '').replace(/T/, '').replace(/\..+/, '').replace(/:/, '').replace(/:/, '');
console.log(uniqNow);

// CREATE THE IAM POLICY
var policyParams = {
    PolicyDocument: copyPolicy, /* required */
    PolicyName: `almostCopyPolicy${uniqNow}`, /* required */
    Description: 'the IAM policy that allows the role to communicate with your sotrage and public buckets'
  };
  iam.createPolicy(policyParams, function(err, data) {
    if (err){
        console.log(err, err.stack);
    } 
    else {
        console.log(data);
        var policyArn = data.Policy.Arn;
        
        // CREATE THE IAM ROLE
        var rolParams = {
            AssumeRolePolicyDocument: trustRel, /* required */
            RoleName: `almostCopyRole${uniqNow}`, /* required */
            Description: 'The Role that allows the Lambda function to interact with the IAM policy',
            Tags: [
                {
                    Key: 'name', /* required */
                    Value: `almostCopyRole${uniqNow}` /* required */
                },
            ]
        };
        iam.createRole(rolParams, function(err, data) {
        if (err) {
            console.log(err, err.stack);
        }
        else {
            console.log(data);
            const rolArn = data.Role.Arn;
            const rolName = data.Role.RoleName;
            console.log(rolName);
            console.log(rolArn);

            // ATTACH THE IAM POLICY TO THE NEW ROLE
            var attachParams = {
                PolicyArn: policyArn, 
                RoleName: rolName
               };
               iam.attachRolePolicy(attachParams, function(err, data) {
                    if (err) {
                        console.log(err, err.stack);
                    } 
                    else {
                        console.log(data);
                        
                        // WAIT 10 SECONDS 
                        setTimeout(
                            function createCopyFunc(){
                                // CREATE THE LAMBDA COPY BUCKET FUNCTION
                                console.log("ROLE ARN: ", rolArn)
                                var funcParams = {
                                    Code: {
                                        ZipFile: fs.readFileSync('../copyFunction.zip') 
                                    }, 
                                    Description: "This Lambda Function Allows you to copy objects from one bucket to another", 
                                    FunctionName: `almostCopyFunction${uniqNow}`, 
                                    Handler: "copyFunction.handler",
                                    MemorySize: 128, 
                                    Publish: true, 
                                    Role: rolArn,
                                    Runtime: "nodejs8.10", 
                                    Timeout: 30,
                                    Environment: {
                                        Variables: {
                                        'SOURCE_BUCKET': process.argv[3],
                                        'DEST_BUCKET': process.argv[2],
                                        }
                                    },    
                                };
                                lambda.createFunction(funcParams, function(err, data) {
                                    if (err) {
                                        console.log(err, err.stack); 
                                    }
                                    else {
                                        console.log(data);
                                        const copyFuncArn = data.FunctionArn;
                                        const copyFuncName = data.FunctionName;
                                        console.log(copyFuncArn);      
                                        
                                        // CALL THE CREATE API FUNCTION
                                        createApi(copyFuncArn, copyFuncName);
                                        
                                    }
                                });
                            }, 10000); 
                    }     
               });
        }
    });
    }     
});


// CREATE THE API
function createApi(arn, funcName) {
    var params = {
        name: `almostCopyApi${uniqNow}`, /* required */
        apiKeySource: 'HEADER',
        description: 'The REST API for the lambda copy function',
        endpointConfiguration: {
          types: [
            'REGIONAL'
          ]
        },
        version: uniqNow
      };
      apigateway.createRestApi(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
        } 
        else {
            console.log(data);
            const rest_api_id = data.id;
            //const rest_api_name = data.name
            console.log("REST API ID: ", rest_api_id)
            
            // GET THE PARENT RESOURCE ID
            var params = {
                restApiId: rest_api_id, /* required */
                };
                apigateway.getResources(params, function(err, data) {
                if (err) {
                    console.log(err, err.stack);
                }
                else {
                    const parent_id = data.items[0].id;
                    console.log("RESOUCRES: ", parent_id);     
    
                        // CREATE THE POST METHOD
                        var params = {
                            authorizationType: 'NONE', /* required */
                            httpMethod: 'POST', /* required */
                            resourceId: parent_id, /* required */
                            restApiId: rest_api_id, /* required */
                            apiKeyRequired: false,
                        };
                        apigateway.putMethod(params, function(err, data) {
                            if (err) {
                                console.log(err, err.stack);
                            } 
                            else {
                                console.log(data);
        
                                // CREATE THE INTEGRATION WITH THE LAMBDA COPY BUCKET FUNCTION
                                var params = {
                                    httpMethod: 'POST', /* required */
                                    integrationHttpMethod: 'POST',
                                    resourceId: parent_id, /* required */
                                    restApiId: rest_api_id, /* required */
                                    type: 'AWS', /* required */
                                    uri: `arn:aws:apigateway:${process.env.AWS_REGION}:lambda:path/2015-03-31/functions/${arn}/invocations`
                                };
                                apigateway.putIntegration(params, function(err, data) {
                                    if (err) {
                                        console.log(err, err.stack);
                                    }
                                    else {
                                        console.log(data);

                                        // ASSIGN POLICY TO THE LAMBDA COPY BUCKET FUNCTION 
                                        var params = {
                                        Action: "lambda:InvokeFunction", 
                                        FunctionName: funcName, 
                                        Principal: "apigateway.amazonaws.com", 
                                        SourceArn: `arn:aws:execute-api:us-east-1:519275522978:${rest_api_id}/*/POST/`,
                                        StatementId: `ID-${uniqNow}`
                                        };
                                        lambda.addPermission(params, function(err, data) {
                                            if (err) console.log(err, err.stack); // an error occurred
                                            else     console.log(data);           // successful response
                                        });

                                        // CREATE THE API DEPLOYMENT
                                        var params = {
                                            restApiId: rest_api_id, /* required */
                                            description: 'deployment for the REST API for the lambda copy function',
                                            stageDescription: `stage ${uniqNow} of the REST API for the lambda copy function deployment`,
                                            stageName: `deployment${uniqNow}`,
                                        };
                                        apigateway.createDeployment(params, function(err, data) {
                                            if (err) {
                                                console.log(err, err.stack);
                                            }
                                            else {
                                                console.log(data);
                                                // CREATE THE METHOD RESPONSE
                                                var params = {
                                                    httpMethod: 'POST', /* required */
                                                    resourceId: parent_id, /* required */
                                                    restApiId: rest_api_id, /* required */
                                                    statusCode: '200', /* required */
                                                    };
                                                    apigateway.putMethodResponse(params, function(err, data) {
                                                    if (err) {
                                                        console.log(err, err.stack);
                                                    } 
                                                    else {
                                                        console.log(data);
                                                        // CREATE THE INTEGRATION RESPONSE
                                                        var params = {
                                                            httpMethod: 'POST', /* required */
                                                            resourceId: parent_id, /* required */
                                                            restApiId: rest_api_id, /* required */
                                                            statusCode: '200', /* required */
                                                            };
                                                            apigateway.putIntegrationResponse(params, function(err, data) {
                                                            if (err) {
                                                                console.log(err, err.stack);
                                                            }
                                                            else {
                                                                console.log(data);
                                                            }     
                                                        });
                                                    }            
                                                });
                                            }
                                        });
                                    }     
                                });
                             
                        }    
                    });   
                }                
            });             
                       
        }     
    });
}


  

  