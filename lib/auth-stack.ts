import { Duration,} from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export interface AuthStackProps extends cdk.NestedStackProps {
    stage: string;
    removal_policy: cdk.RemovalPolicy;
    stackName: string;
};

export class AuthStack extends cdk.NestedStack {
    public readonly userPool: cognito.UserPool;
    public readonly identityPool: cognito.CfnIdentityPool;
    public readonly userPoolClient: cognito.UserPoolClient;

    constructor(scope: Construct, id: string, props: AuthStackProps) {
        super(scope, id, props);

        // UserPool - Authentication
        // ------------------------------------------------------------------------------------------
        // User pools are for authentication (identity verification). 
        // With a user pool, your app users can sign in through the user pool or federate through a third-party identity provider (IdP). 
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


        // UserPoolClient
        // ------------------------------------------------------------------------------------------
        // A User Pool Client resource represents an Amazon Cognito User Pool Client that provides a way to 
        // generate authentication tokens used to authorize a user for an application. Configuring a User Pool 
        // Client then connecting it to a User Pool will generate to a User Pool client ID
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

        // CfnIdentityPool - Authorization
        // ------------------------------------------------------------------------------------------
        // Identity pools are for authorization (access control).
        // Amazon Cognito identity pools provide temporary AWS credentials for users who are guests (unauthenticated) 
        // and for users who have been authenticated and received a token. 
        // An identity pool is a store of user identity data specific to your account.
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