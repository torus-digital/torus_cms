// Load the AWS SDK
const aws = require('aws-sdk');

// Construct the AWS S3 Object
const s3 = new aws.S3({
    apiVersion: '2006-03-01'
 });
        
// Define 2 new variables for the source and destination buckets
var srcBucket = process.env.SOURCE_BUCKET;
var destBucket = process.env.DEST_BUCKET + '/';

//Main function
exports.handler = (event, context, callback) => {     
//Copy the current object to the destination bucket
   if(event.delete){
      s3.deleteObject({
         Bucket: destBucket +  event.destRoute,
         Key: event.sourceObject
      }, function(deleteErr, data) {
         if (deleteErr) {
            console.log("Error: " + deleteErr);
         }
         else {
            console.log('Successfully deleted the item');
         }
      });
   }
   else {
      s3.copyObject({ 
         CopySource: srcBucket + '/' + event.sourceRoute + '/' + event.sourceObject,
         Bucket: destBucket +  event.destRoute,
         Key: event.sourceObject
         }, function(copyErr, copyData){
            if (copyErr) {
               console.log("Error: " + copyErr);
            } else {
               console.log('Successfully copied the item');
            } 
      });
   }
   callback(null, 'All Done!');
};
