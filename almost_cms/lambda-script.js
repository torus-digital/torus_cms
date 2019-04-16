//load files from the .env file
require('dotenv').load();
const fs = require('fs');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

// Load credentials and set region from JSON file
// AWS.config.loadFromPath('./config.json');    //Currently loading from env file

var iam = new AWS.IAM({apiVersion: '2010-05-08'});
var lambda = new AWS.Lambda({apiVersion: '2015-03-31'});

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

const lambdaFunction = (
    `// Load the AWS SDK
    const aws = require('aws-sdk');
    
    // Construct the AWS S3 Object - http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
    const s3 = new aws.S3({
        apiVersion: '2006-03-01'
     });
            
    // Define 2 new variables for the source and destination buckets
    var srcBucket = "${process.argv[3]}";
    var destBucket = "${process.argv[2]}/";
    
    //Main function
    exports.handler = (event, context, callback) => {
            
    //Copy the current object to the destination bucket - http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#copyObject-property
    s3.copyObject({ 
        CopySource: srcBucket + '/' + event.sourceRoute + '/' + event.sourceObject,
        Bucket: destBucket + event.destRoute,
        Key: event.sourceObject
        }, function(copyErr, copyData){
           if (copyErr) {
                console.log("Error: " + copyErr);
             } else {
                console.log('Copied OK');
             } 
        });
      callback(null, 'All done!');
    };`
);

const uniqNow = new Date().toISOString().replace(/-/, '').replace(/-/, '').replace(/T/, '').replace(/\..+/, '').replace(/:/, '').replace(/:/, '');
console.log(uniqNow);

//CREATE THE IAM POLICY
var policyParams = {
    PolicyDocument: copyPolicy, /* required */
    PolicyName: `almostCopyPolicy${uniqNow}`, /* required */
    Description: 'the IAM policy that allows the role to communicate with your sotrage and public buckets',
    //Path:'STRING_VALUE'
  };
  iam.createPolicy(policyParams, function(err, data) {
    if (err){
        console.log(err, err.stack);
    } 
    else {
        console.log(data);
        var policyArn = data.Policy.Arn;
        //CREATE THE IAM ROLE
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

            //ATTACH THE IAM POLICY TO THE NEW ROLE
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
                        // CREATE THE LAMBDA FUNCTION
                        setTimeout(
                            function createCopyFunc(){

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
                                    }
                                });
                            }, 10000);
                    }     
               });
        }
    });
    }     
});


