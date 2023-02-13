import { Stack, StackProps } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuthStack } from './auth-stack';
import { UserStack } from './user-stack';

export class AwsServerlessTemplateStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const stage = "ServerlessTemplate"

    const REMOVAL_POLICY = cdk.RemovalPolicy.DESTROY;

    // Auth stack
    // Contains Cognito user pool used for sign up and authentication
    const authStack = new AuthStack(this, `${stage}AuthStack`, {
      stage: stage,
      removal_policy: REMOVAL_POLICY,
      stackName: `${stage}AuthStack`,
    });
    new cdk.CfnOutput(this, 'IdentityPoolID', {
      value: authStack.identityPool.ref,
    });
    new cdk.CfnOutput(this, 'UserPoolArn', {
      value: authStack.userPool.userPoolArn,
    });
    new cdk.CfnOutput(this, 'UserPoolID', {
      value: authStack.userPool.userPoolId,
    });
    new cdk.CfnOutput(this, 'UserPoolClientID', {
      value: authStack.userPoolClient.userPoolClientId,
    });

    // User stack
    // Contains user table, api gateway and lambdas to return and create users
    const userStack = new UserStack(this, `${stage}UserStack`, {
      stage: stage,
      removal_policy: REMOVAL_POLICY,
      stackName: `${stage}UserStack`,
    });
    new cdk.CfnOutput(this, 'UserLambda', {
      value: userStack.rootLambda.functionArn,
    });
    new cdk.CfnOutput(this, 'UserApiEndpoint', {
      value: userStack.restApi.url,
    });
    
  }
}
