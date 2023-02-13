import { Stack, StackProps } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuthStack } from './auth-stack';
import { UserStack } from './user-stack';

export class AwsServerlessTemplateStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const STAGE: string = this.node.tryGetContext('stage');
    const REMOVAL_POLICY = cdk.RemovalPolicy.DESTROY;

    const createOutputValue = function (context: Construct, name: string, value: string) {
      new cdk.CfnOutput(context, name, {
        value: value,
      });
    }

    // Auth stack
    // Contains Cognito user pool used for sign up and authentication
    const authStack = new AuthStack(this, `${STAGE}AuthStack`, {
      stage: STAGE,
      removal_policy: REMOVAL_POLICY,
      stackName: `${STAGE}AuthStack`,
    });
    createOutputValue(this, 'IdentityPoolID', authStack.identityPool.ref)
    createOutputValue(this, 'UserPoolArn', authStack.userPool.userPoolArn)
    createOutputValue(this, 'UserPoolID', authStack.userPool.userPoolId)
    createOutputValue(this, 'UserPoolClientID', authStack.userPoolClient.userPoolClientId)

    // User stack
    // Contains user table, api gateway and lambdas to return and create users
    const userStack = new UserStack(this, `${STAGE}UserStack`, {
      stage: STAGE,
      removal_policy: REMOVAL_POLICY,
      stackName: `${STAGE}UserStack`,
    });
    createOutputValue(this, 'CreateUserLambda', userStack.createUser.functionArn)
    createOutputValue(this, 'FetchUserLambda', userStack.fetchUser.functionArn)
    createOutputValue(this, 'UserApiEndpoint', userStack.restApi.url)
    createOutputValue(this, 'UserInfoDB', userStack.infoTable.tableArn)
  }
}
