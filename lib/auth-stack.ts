import { Duration,} from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export interface AuthStackProps extends cdk.NestedStackProps {
    stage: string;
    removal_policy: cdk.RemovalPolicy;
    stackName: string;
};

export class AuthStack extends cdk.Stack {
    public readonly userPool: cognito.UserPool;
    public readonly identityPool: cognito.CfnIdentityPool;
    public readonly userPoolClient: cognito.UserPoolClient;

    constructor(scope: Construct, id: string, props: AuthStackProps) {
        super(scope, id, props);

        // User pool
        this.userPool = new cognito.UserPool(this, `${props.stage}UserPool`, {
            selfSignUpEnabled: true, // users can sign themselves up/as opposed to admin creating users
            signInAliases: { email: true }, // what is the user sign in alias
            autoVerify: { email: true }, 
            passwordPolicy: { // password rules
                minLength: 8,
                requireLowercase: true,
                requireDigits: true,
                requireUppercase: true,
                requireSymbols: true,
            },
            accountRecovery: cognito.AccountRecovery.EMAIL_ONLY, // recover account using email address
            removalPolicy: props.removalPolicy,
        });

        // Secure client
        this.userPoolClient = new cognito.UserPoolClient(this, `${props.stage}UserPoolClient`, {
            userPool: this.userPool,
            authFlows: {
                adminUserPassword: true,
                userPassword: true,
                userSrp: true,
                custom: true,
            },
            refreshTokenValidity: Duration.hours(24), // how long is the refresh token valid for
            supportedIdentityProviders: [ // can add other supported ones, such as google or apple
                cognito.UserPoolClientIdentityProvider.COGNITO,
            ],
        });

        // Secure identityPool
        this.identityPool = new cognito.CfnIdentityPool(this, `${props.stage}UserIdentityPool`, {
            allowUnauthenticatedIdentities: false,
            cognitoIdentityProviders: [
                {
                    clientId: this.userPoolClient.userPoolClientId,
                    providerName: this.userPool.userPoolProviderName,
                },
            ],
        });

        // Associate domain to user pool
        this.userPool.addDomain(`${props.stage.toLowerCase()}-domain`, {
            cognitoDomain: {
                domainPrefix: `${props.stage.toLowerCase()}-id-login`,
            },
        });
    }
}