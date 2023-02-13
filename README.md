# Welcome to your CDK Serverless template- using Typescript

The `cdk.json` file tells the CDK Toolkit how to execute your app.

aws_config.json contains all identifiers and URLs that can be used to integrate with the AWS serverless backend

## Setup

- Install AWS CLI
- Install CDK
- Install Node.js
- Setup AWS account
- Add IAM user with service credentials (access keys)
- AWS configure (your credentials)

## Deploy scripts

-- sh deploy.sh
    - this uses the .env file
    - update the STAGE variable
    - first synthensises and then deploys
    ```
        cdk synthesize
        cdk deploy
    ```

-- sh destroy.sh
    - this uses the .env file
    - update the STAGE variable