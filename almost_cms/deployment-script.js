require('dotenv').load();

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

// Load credentials and set region from JSON file
//AWS.config.loadFromPath('./config.json');

// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01'});
route53 = new AWS.Route53({apiVersion: '2013-04-01'});


// Create Route53 Hosted Zone
var call_ref = new Date().toString()

var params = {
	CallerReference: call_ref, /* required */
	Name: process.argv[2], /* required */
	HostedZoneConfig: {
		Comment: 'almost hosted zone',
		PrivateZone: false
	}
};
route53.createHostedZone(params, function(err, data) {
	if (err) console.log(err, err.stack); // an error occurred
	else console.log(data); // successful response
});



// CREATE THE ROOT S3 BUCKET

// Create params JSON for S3.createBucket
var bucketParams = {
  Bucket : process.argv[2],
  ACL : 'public-read'
};
var staticHostParams = {
  Bucket: process.argv[2],
  WebsiteConfiguration: {
		ErrorDocument: {
			Key: 'error.html'
		},
		IndexDocument: {
			Suffix: 'index.html'
		},
  }
};
// call S3 to create the bucket
s3.createBucket(bucketParams, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Bucket URL is ", data.Location);
    // set the new policy on the newly created bucket
    s3.putBucketWebsite(staticHostParams, function(err, data) {
      if (err) {
        // display error message
        console.log("Error", err);
      } else {
				console.log("Success", data);

				// CREATE THE WWW REROUTE BUCKET

				// Create params JSON for S3.createBucket
				var wname = 'www.' + process.argv[2];
				var wbucketParams = {
					Bucket : wname,
				};
				var wstaticHostParams = {
					Bucket: wname,
					WebsiteConfiguration: {
						RedirectAllRequestsTo: {
							HostName: process.argv[2], /* required */
							Protocol: 'http'
						},
					}
				};
				// call S3 to create the bucket
				s3.createBucket(wbucketParams, function(err, data) {
					if (err) {
						console.log("Error", err);
					} else {
						console.log("Bucket URL is ", data.Location);
						// set the new policy on the cewly created bucket
						s3.putBucketWebsite(wstaticHostParams, function(err, data) {
							if (err) {
								// display error message
								console.log("Error", err);
							} else {
								// update the displayed policy for the selected bucket
								console.log("Success", data);
							}
						});
					}
				});



      }
    });
  }
});





