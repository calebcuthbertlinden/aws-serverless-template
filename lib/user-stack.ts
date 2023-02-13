import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export interface UserStackProps extends cdk.NestedStackProps {
    stage: string;
    removal_policy: cdk.RemovalPolicy;
    stackName: string,
};

export class UserStack extends cdk.NestedStack {
    public readonly createUser: lambda.Function;
    public readonly fetchUser: lambda.Function;
    public readonly restApi: apigw.RestApi;
    public readonly infoTable: dynamodb.Table;

    constructor(scope: Construct, id: string, props: UserStackProps) {
        super(scope, id, props);

        // DynamoDB for user info
        // --------------------------------------------------------------------------------
        // NoSQL database
        const userTablePartitionKey: string = 'UserUUID';
        this.infoTable = new dynamodb.Table(this, `${props.stage}UserInfoDB`, {
            partitionKey: {
                name: userTablePartitionKey,
                type: dynamodb.AttributeType.STRING,
            },
            tableName: `${props.stage}UserInfoTable`,
            removalPolicy: props.removalPolicy,
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        });

        // Lambdas
        // --------------------------------------------------------------------------------
        // Serveless function
        this.createUser = new lambda.Function(this, 'CreateUserHandler', {
            runtime: lambda.Runtime.NODEJS_16_X, // execution environment
            code: lambda.Code.fromAsset('lambda'), // code loaded from "lambda" directory
            handler: 'create-user.handler', // file is "create-user", function is "handler"
            functionName: `${props.stage}CreateUser`,
        });
        this.infoTable.grantReadWriteData(this.createUser);

        this.fetchUser = new lambda.Function(this, 'FetchUserHandler', {
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset('lambda'),
            handler: 'fetch-user.handler',
            functionName: `${props.stage}FetchUser`,
        });
        this.infoTable.grantReadWriteData(this.fetchUser);

        // ApiGateway
        // --------------------------------------------------------------------------------
        // Rest API
        const debugDeployOptions: apigateway.StageOptions = {
            // loggingLevel: apigateway.MethodLoggingLevel.INFO, // enable cloud watch logging to uncomment this
        };
        this.restApi = new apigw.RestApi(this, 'UserApi', {
            restApiName: `${props}UserApi`,
            defaultMethodOptions: {
                apiKeyRequired: false,
            },
            deployOptions: debugDeployOptions,
            description: `User API (${props.stage})`,
        });
        const userPath = this.restApi.root.addResource('user');
        userPath.addMethod("POST", new apigw.LambdaIntegration(this.createUser))
        userPath.addMethod("GET", new apigw.LambdaIntegration(this.fetchUser))
    }
}