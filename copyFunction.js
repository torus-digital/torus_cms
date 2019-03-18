// Load the AWS SDK
const aws = require('aws-sdk');

// Construct the AWS S3 Object - http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
const s3 = new aws.S3({
    apiVersion: '2006-03-01'
 });
        
// Define 2 new variables for the source and destination buckets
var srcBucket = "***REMOVED***";
var destBucket = "***REMOVED***/";


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
};