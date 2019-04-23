//load files from the .env file
require('dotenv').load();

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

// Load credentials and set region from JSON file
// AWS.config.loadFromPath('./config.json');    
// Currently loading from env file

// Load the other scripts
var websiteScript = require('./website-script');
var lambdaScript = require('./lambda-script');

// Create S3 service objects
s3 = new AWS.S3({apiVersion: '2006-03-01'});
route53 = new AWS.Route53({apiVersion: '2013-04-01'});
var iam = new AWS.IAM({apiVersion: '2010-05-08'});
var lambda = new AWS.Lambda({apiVersion: '2015-03-31'});
var apigateway = new AWS.APIGateway({apiVersion: '2015-07-09'});

// interact with fs
const path = require("path");
const fs = require('fs');

// Package to open browser window
const open = require('open');

// package to use stdin/out
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

//converts console input to y and n
function convertInput(input) {
    var mininput =  input.toLowerCase()
    if (mininput == 'y' || mininput == 'yes') {
        output = 'y';
    }
    else if(mininput == 'n' || mininput == 'no') {
        output = 'n';
    }
    else {
        output = '';   
    }
    return output;
}

// ADD THE VALUES TO THE VARIABLES.JSON FILE
function addVars(jsonVar, jsonVal){
    let rawdata = fs.readFileSync('variables.json');  
    obj = JSON.parse(rawdata);
    obj[jsonVar] = jsonVal;
    jsonObj = JSON.stringify(obj);
    fs.writeFileSync('variables.json', jsonObj);
    console.log('saved your public site name in the variables.json file')
}
 

function stmt1(){
    readline.question(`Want to deploy a new static website? [Y/n]`, (res) => {
        switch(convertInput(res)) {
            case 'y':
                stmt3();
                break;
            case 'n':
                stmt2();
                break;
            default:
                console.log('please enter a valid yes/no response');
                stmt1();
        }
    });
}

function stmt2(){
    readline.question(`I guess you want to install a backend for an existing static website [Y/n]`, (res2) => {
        switch(convertInput(res2)) {
            case 'y':
                // please enter the name of your static website
                sitebackend();
                break;
            case 'n':
                console.log('Sorry there isnt much we can do for you right now.')
                readline.close();
                break;
            default:
                console.log('please enter a valid yes/no response');
                stmt2();
        }
    });
}

function stmt3(){
    readline.question(`Will you want to install a backend for your site? [Y/n]`, (res3) => {
        switch(convertInput(res3)) {
            case 'y':
                stmt4();
                break;
            case 'n':
                console.log(`please create a new IAM user and enter the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY env variables`)
                console.log(`for more info check out https://github.com/gkpty/almost_cms`);
                (async () => {
                    await open('https://console.aws.amazon.com/iam/home?region=us-east-1#/users$new?step=details');
                })();
                stmt5();
                break;
            default:
                console.log('please enter a valid yes/no response');
                stmt3();
        }
    });
}

function stmt4(){
    readline.question(`Have you laready configured the backend? [Y/n]`, (res4) => {
        switch(convertInput(res4)) {
            case 'y':
                // EXECUTE THE WEBSITE FUNCTION
                siteFunc(false);
                setTimeout(() => {
                    storBkt()
                }, 25000);
                break;
            case 'n':
                console.log('Please configure Amplify');
                console.log('run: amplify init');
                console.log('run: amplify configure');
                console.log('Add AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY env variables with the credentials of the IAM user created for Amplify');
                console.log('then re-run the deployment script.')
                readline.close();
                break;
            default:
                console.log('please enter a valid yes/no response');
                stmt4();
        }
    });
}

function stmt5(){
    readline.question(`Have you finished configuring the env variables? [Y/n]`, (res5) => {
        switch(convertInput(res5)) {
            case 'y':
                siteFunc(true);
                break;
            default:
                console.log('please enter a valid yes/no response');
                stmt5();
        }
    });
}

function sitebackend(){
    readline.question(`Have you already configured Amplify? [Y/n]`, (res6) => {
        switch(convertInput(res6)) {
            case 'y':
                storBkt();
                break;
            case 'n':
                console.log('Please configure Amplify');
                console.log('run: amplify init');
                console.log('run: amplify configure');
                console.log('Add AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY env variables with the credentials of the IAM user created for Amplify');
                console.log('then re-run the deployment script.')
                readline.close();
                break;
            default:
                console.log('please enter a valid yes/no response');
                sitebackend();
        }
    }); 
}

function siteFunc(cond) {
    readline.question(`Please enter the domain name of your site ex. yourdomain.com `, (domainName) => {
        if (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(domainName)) {
            console.log("Valid Domain Name");
            addVars('public_site', domainName);
            websiteScript.script(s3, route53, path, fs, domainName);
            if (cond) {
                readline.close();
            }
        } else {
            console.log("Enter Valid Domain Name");
            siteFunc();
        }
    });
}

function storBkt() {
    readline.question(`Enter the name of your storage bucket created by Amplify `, (storBktName) => {
        if (storBktName.length < 1) {
            console.log("Please enter a valid bucket Name");
            storBkt();
        } else {
            addVars('storage_bucket', storBktName);
            let rawdata = fs.readFileSync('variables.json');  
            obj = JSON.parse(rawdata);
            const savedDomain = obj.public_bucket;
            console.log('Deploying your backend...');
            lambdaScript.script(iam, fs, lambda, apigateway, savedDomain, storBktName);
            readline.close();
        }
    });
}

console.log('Hi, welcome to the almost installer!');
stmt1();


