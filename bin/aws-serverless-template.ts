#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsServerlessTemplateStack } from '../lib/aws-serverless-template-stack';

const app = new cdk.App();
new AwsServerlessTemplateStack(app, 'AwsServerlessTemplateStack');
