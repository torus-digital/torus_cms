//load files from the .env file
require('dotenv').load();

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

// Load credentials and set region from JSON file
// AWS.config.loadFromPath('./config.json');    //Currently loading from env file

// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01'});
route53 = new AWS.Route53({apiVersion: '2013-04-01'});
const wname = 'www.' + process.argv[2];
const path = require("path");
const fs = require('fs');
const publicPolicy = (
	`{
	"Version": "2012-10-17",
	"Statement": [
			{
					"Sid": "PublicReadGetObject",
					"Effect": "Allow",
					"Principal": "*",
					"Action": "s3:GetObject",
					"Resource": "arn:aws:s3:::${process.argv[2]}/*"
			}
	]
}`
);

// CREATE THE ROOT S3 BUCKET
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
s3.createBucket(bucketParams, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Bucket URL is ", data.Location);
    s3.putBucketWebsite(staticHostParams, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
				console.log("Success", data);

				//ATTACH THE PUBLIC BUCKET POLICY
				var params = {
					Bucket: process.argv[2], 
					Policy: publicPolicy
				};
				 s3.putBucketPolicy(params, function(err, data) {
					if (err){
						console.log(err, err.stack);
					} 
					else{
						console.log("public bucket policy attached")
						console.log(data);
					}     
				});
				
				//UPLOAD THE WEBSITE TEMPLATE TO THE S3 BUCKET
				const uploadDir = function(s3Path, bucketName) {
					let s3 = new AWS.S3();			
					function walkSync(currentDirPath, callback) {
							fs.readdirSync(currentDirPath).forEach(function (name) {
									var filePath = path.join(currentDirPath, name);
									var stat = fs.statSync(filePath);
									if (stat.isFile()) {
											callback(filePath, stat);
									} 
									else if (stat.isDirectory()) {
											walkSync(filePath, callback);
									}
							});
					}			
					walkSync(s3Path, function(filePath, stat) {
							let bucketPath = filePath.substring(s3Path.length+1);
							let fext = bucketPath.substring(bucketPath.lastIndexOf('.') + 1);
							let content_type = '';
							if(fext =='svg'){
									content_type = 'image/svg+xml'
							}
							else if(fext =='jpg' || fext =='jpeg'){
									content_type = 'image/jpeg'
							}
							else if(fext =='png'){
									content_type = 'image/png'
							}
							else if(fext =='html'){
									content_type = 'text/html'
							}
							else if(fext =='css'){
									content_type = 'text/css'
							}
							else if(fext =='js'){
									content_type = 'application/javascript'
							}
							else if(fext =='txt'){
									content_type = 'text/plain'
							}
							else if(fext =='xml'){
									content_type = 'text/xml'
							}
							else if(fext =='mp4'){
									content_type = 'video/mp4'
							}        
							let fileParams = {Bucket: bucketName, Key: bucketPath, Body: fs.readFileSync(filePath), ContentType: content_type};
							s3.putObject(fileParams, function(err, data) {
									if (err) {
											console.log(err)
									} 
									else {
											console.log('Successfully uploaded '+ bucketPath +' to ' + bucketName);
									}
							});
					});
				};			
				uploadDir("../website_template", process.argv[2]);
				
				// CREATE THE WWW REROUTE BUCKET
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
				s3.createBucket(wbucketParams, function(err, data) {
					if (err) {
						console.log("Error", err);
					} else {
						console.log("Bucket URL is ", data.Location);
						s3.putBucketWebsite(wstaticHostParams, function(err, data) {
							if (err) {
								console.log("Error", err);
							} 
							else {
								console.log("Success", data);
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
										console.log(err, err.stack);
									} 
									else {
										console.log(data);
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
												console.log(err, err.stack);
											} 
											else {
												console.log(data);
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










