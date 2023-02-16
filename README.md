# Welcome to your CDK Serverless template - using Typescript

## Setup

- Install AWS CLI
- Install CDK
- Install Node.js
- Setup AWS account
- Add IAM user with service credentials (access keys)
- AWS configure (your credentials)
- npm install

## Deploy scripts

NB - Before running these scripts, update the STAGE variable in ```.env``` to be specific to you (i.e CalebDev)


### sh deploy.sh

This script runs ```cdk synthesize``` and then ```cdk deploy```. <br/>
It also outputs the url's and resource arn's to an ```aws_config.json``` file when finished deploying.


### sh destroy.sh

This script will destroy all your stacks and their resources. <br/>Run this once you are done with your developement to make sure resources don't incur unintended costs.

## AWS resources used 

### Cognito
TODO
### Lambda
TODO
### API Gateway
TODO
### DynamoDB
TODO
