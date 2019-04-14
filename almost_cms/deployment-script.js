require('dotenv').load();

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

// Load credentials and set region from JSON file
// AWS.config.loadFromPath('./config.json');    //Currently loading from env file

// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01'});
route53 = new AWS.Route53({apiVersion: '2013-04-01'});
var wname = 'www.' + process.argv[2];

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

// Create Route53 Hosted Zone
var call_ref = new Date().toString();

var hostZoneParams = {
	CallerReference: call_ref, /* required */
	Name: process.argv[2], /* required */
	HostedZoneConfig: {
		Comment: 'almost hosted zone',
		PrivateZone: false
	}
};
route53.createHostedZone(hostZoneParams, function(err, data) {
	if (err) {
		console.log(err, err.stack); // an error occurred
	} 
	else {
		console.log(data); // successful response
		const hosted_id = data.HostedZone.Id.slice(data.HostedZone.Id.lastIndexOf('/') + 1);

		// Create the Alias A record for the root bucket
		var aliasParams = {
			ChangeBatch: {
				 Changes: [{
					Action: "CREATE", 
					ResourceRecordSet: {
						AliasTarget: {
							DNSName: "s3-website-us-east-1.amazonaws.com", 
							EvaluateTargetHealth: false, 
							HostedZoneId: 'Z3AQBSTGFYJSTF' // a code depending on your region and resource for more info refer to https://docs.aws.amazon.com/general/latest/gr/rande.html#s3_website_region_endpoints
						}, 
						Name: process.argv[2], 
						Type: "A"
					 }
				}], 
				Comment: "Alias Record for S3 Bucket"
			}, 
			HostedZoneId: hosted_id // the Id of your recently created hosted zone
		 };
		route53.changeResourceRecordSets(aliasParams, function(err, data) {
			if (err) {
				console.log(err, err.stack); // an error occurred
			} 
			else {
				console.log(data); // successful response
			}
		});

		//Create the Alias A record for the www bucket
		var waliasParams = {
			ChangeBatch: {
				 Changes: [{
					Action: "CREATE", 
					ResourceRecordSet: {
						AliasTarget: {
							DNSName: "s3-website-us-east-1.amazonaws.com", 
							EvaluateTargetHealth: false, 
							HostedZoneId: 'Z3AQBSTGFYJSTF' // a code depending on your region and resource for more info refer to https://docs.aws.amazon.com/general/latest/gr/rande.html#s3_website_region_endpoints
						}, 
						Name: wname, 
						Type: "A"
					 }
				}], 
				Comment: "Alias Record for S3 Bucket"
			}, 
			HostedZoneId: hosted_id // the Id of your recently created hosted zone
		 };
		route53.changeResourceRecordSets(waliasParams, function(err, data) {
			if (err) {
				console.log(err, err.stack); // an error occurred
			} 
			else {
				console.log(data); // successful response
			}
		});

	}
});







