import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

export interface UserStackProps extends cdk.NestedStackProps {
    stage: string;
    removal_policy: cdk.RemovalPolicy;
    stackName: string,
};

export class UserStack extends cdk.Stack {
    public readonly rootLambda: lambda.Function;
    public readonly restApi: apigw.LambdaRestApi;

    constructor(scope: Construct, id: string, props: UserStackProps) {
        super(scope, id, props);

        // Lambda
        this.rootLambda = new lambda.Function(this, 'RootHandler', {
            runtime: lambda.Runtime.NODEJS_16_X,    // execution environment
            code: lambda.Code.fromAsset('lambda'),  // code loaded from "lambda" directory
            handler: 'index.handler',                // file is "hello", function is "handler"
            functionName: `${props.stage}UpdateReferrer`,
        });

        // ApiGateway
        this.restApi = new apigw.LambdaRestApi(this, 'Endpoint', {
            handler: this.rootLambda,
        });
    }
}