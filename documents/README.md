**Services used:**
* [AWS CloudFormation](https://aws.amazon.com/cloudformation/)
* [AWS Identity and Access Management (IAM)](https://aws.amazon.com/iam/)
* [Amazon Virtual Private Cloud (VPC)](https://aws.amazon.com/vpc/)
* [Amazon Elastic Load Balancing](https://aws.amazon.com/elasticloadbalancing/)
* [Amazon Elastic Container Service (ECS)](https://aws.amazon.com/ecs/)
* [AWS Fargate](https://aws.amazon.com/fargate/)
* [AWS Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/)
* [AWS CodeCommit](https://aws.amazon.com/codecommit/)
* [AWS CodePipeline](https://aws.amazon.com/codepipeline/)
* [AWS CodeDeploy](https://aws.amazon.com/codedeploy/)
* [AWS CodeBuild](https://aws.amazon.com/codebuild/)

### Overview

In Module 2, you will create a new microservice hosted with [AWS Fargate](https://aws.amazon.com/fargate/) on [Amazon Elastic Container Service](https://aws.amazon.com/ecs/) so the JustAskEvie website can have an application backend to integrate with. AWS Fargate is a deployment option in Amazon ECS that allows you to deploy containers without having to manage any clusters or servers. For our JustAskEvie backend, we will use [.NET Core 2.1](https://docs.microsoft.com/en-us/dotnet/core/) and create a [Web API app](https://docs.microsoft.com/en-us/aspnet/core/web-api/?view=aspnetcore-2.1) in a [Docker container](https://www.docker.com/) behind a [Network Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html). These will form the microservice backend for the frontend website to integrate with.

### Creating the Core Infrastructure using AWS CloudFormation

Before we can create our service, we need to create the core infrastructure environment that the service will use, including the networking infrastructure in [Amazon VPC](https://aws.amazon.com/vpc/), and the AWS Identity and Access Management Roles that will define the permissions that ECS and our containers will have on top of AWS.  We will use [AWS CloudFormation](https://aws.amazon.com/cloudformation/) to accomplish this. AWS CloudFormation is a service that can programmatically provision AWS resources that you declare within JSON or YAML files called *CloudFormation Templates*, enabling the common best practice of *Infrastructure as Code*. We have provided a CloudFormation template to create all of the necessary Network and Security resources in /module-2/cfn/core.yml.  This template will create the following resources:

* **An Amazon VPC** - a network environment that contains four subnets (two public and two private) in the 10.0.0.0/16 private IP space, as well as all the needed Route Table configurations.
* **Two NAT Gateways** (one for each public subnet) - allows the containers we will eventually deploy into our private subnets to communicate out to the Internet to download necessary packages, etc.
* **A DynamoDB Endpoint** - our microservice backend will eventually integrate with Amazon DynamoDB for persistence (as part of module 3).
* **A Security Group** - Allows your docker containers to receive traffic on port 8080 from the Internet through the Network Load Balancer.
* **IAM Roles** - Identity and Access Management Roles are created. These will be used throughout the workshop to give AWS services or resources you create access to other AWS services like DynamoDB, S3, and more.

To create these resources, run the following command in your Visual Studio Code terminal (will take ~10 minutes for stack to be created) using either the AWS CLI or the PowerShell command:

`Bash`|`PowerShell`
--------------|--------------
aws cloudformation create-stack --stack-name JustAskEvieCoreStack --capabilities CAPABILITY_NAMED_IAM --template-body file://final/cfn/core.yml| New-CFNStack -StackName JustAskEvieCoreStack -Capability CAPABILITY_NAMED_IAM -TemplateBody $(Get-Content $([io.path]::combine($(Get-Location), "module-2", "cfn", "core.yml")) | Out-String)

- [x] Finish my changes
- [ ] Push my commits to GitHub
- [ ] Open a pull request

`Bash`
```
aws cloudformation create-stack --stack-name JustAskEvieCoreStack --capabilities CAPABILITY_NAMED_IAM --template-body file://final/cfn/core.yml   
```
`PowerShell`
```
New-CFNStack -StackName JustAskEvieCoreStack -Capability CAPABILITY_NAMED_IAM -TemplateBody $(Get-Content $([io.path]::combine($(Get-Location), "module-2", "cfn", "core.yml")) | Out-String)
```

You can check on the status of your stack creation either via the AWS Console or by running the command using either the AWS CLI or the PowerShell command:

```
aws cloudformation describe-stacks --stack-name JustAskEvieCoreStack
```
```
Get-CFNStack -StackName JustAskEvieCoreStack | Select-Object -Property StackStatus
```

Run the the `describe-stacks` command, until you see a status of ```"StackStatus": "CREATE_COMPLETE"```

When you get this response, CloudFormation has finished provisioning all of the core networking and security resources described above.

Copy the **full response** and save it for future reference in a text editor. Or, create a temporary folder and file to save it to within your IDE. This JSON response contains the unique identifiers for several of the created resources, which we will use later in this workshop.  

# New-CFNStack -StackName JustAskEvieCoreStack -Capability CAPABILITY_NAMED_IAM -TemplateBody $(Get-Content $([io.path]::combine($(Get-Location), "cfn", "core.yml")) | Out-String)

# Get-CFNStack -StackName JustAskEvieCoreStack | Select-Object -Property StackStatus

# aws cloudformation describe-stacks --stack-name JustAskEvieCoreStack

PS C:\Users\robin\OneDrive\Documents\justaskevie\FINAL> aws cloudformation describe-stacks --stack-name JustAskEvieCoreStack
{
    "Stacks": [
        {
            "StackId": "arn:aws:cloudformation:us-east-1:042803551319:stack/JustAskEvieCoreStack/2f4c6400-787e-11eb-a39f-120fbf0f0187",
            "StackName": "JustAskEvieCoreStack",
            "Description": "This stack deploys the core network infrastructure and IAM resources to be used for a service hosted in Amazon ECS using AWS Fargate.",
            "CreationTime": "2021-02-26T22:01:32.224000+00:00",
            "RollbackConfiguration": {},
            "StackStatus": "CREATE_COMPLETE",
            "DisableRollback": false,
            "NotificationARNs": [],
            "Capabilities": [
                "CAPABILITY_NAMED_IAM"
            ],
            "Outputs": [
                {
                    "OutputKey": "CurrentAccount",
                    "OutputValue": "042803551319",
                    "Description": "The ID of the Account being used.",
                    "ExportName": "JustAskEvieCoreStack:CurrentAccount"
                },
                {
                    "OutputKey": "FargateContainerSecurityGroup",
                    "OutputValue": "sg-0eedda69dbdc873fc",
                    "Description": "A security group used to allow Fargate containers to receive traffic",
                    "ExportName": "JustAskEvieCoreStack:FargateContainerSecurityGroup"
                },
                {
                    "OutputKey": "PublicSubnetOne",
                    "OutputValue": "subnet-0ad7fee630f75b253",
                    "Description": "Public subnet one",
                    "ExportName": "JustAskEvieCoreStack:PublicSubnetOne"
                },
                {
                    "OutputKey": "ECSTaskRole",
                    "OutputValue": "arn:aws:iam::042803551319:role/JustAskEvieCoreStack-ECSTaskRole-BNYRPENZY096",
                    "Description": "The ARN of the ECS Task role",
                    "ExportName": "JustAskEvieCoreStack:ECSTaskRole"
                },
                {
                    "OutputKey": "PrivateSubnetTwo",
                    "OutputValue": "subnet-01a9686fe7f953cde",
                    "Description": "Private subnet two",
                    "ExportName": "JustAskEvieCoreStack:PrivateSubnetTwo"
                },
                {
                    "OutputKey": "CurrentRegion",
                    "OutputValue": "us-east-1",
                    "Description": "The string representation of the region being used.",
                    "ExportName": "JustAskEvieCoreStack:CurrentRegion"
                },
                {
                    "OutputKey": "VPCId",
                    "OutputValue": "vpc-069155575afaec2d2",
                    "Description": "The ID of the VPC that this stack is deployed in",
                    "ExportName": "JustAskEvieCoreStack:VPCId"
                },
                {
                    "OutputKey": "PublicSubnetTwo",
                    "OutputValue": "subnet-05ed52e98f57f3fe1",
                    "Description": "Public subnet two",
                    "ExportName": "JustAskEvieCoreStack:PublicSubnetTwo"
                },
                {
                    "OutputKey": "CodeBuildRole",
                    "OutputValue": "arn:aws:iam::042803551319:role/JustAskEvieServiceCodeBuildServiceRole",
                    "Description": "The ARN of the CodeBuild role",
                    "ExportName": "JustAskEvieCoreStack:JustAskEvieServiceCodeBuildServiceRole"
                },
                {
                    "OutputKey": "CodePipelineRole",
                    "OutputValue": "arn:aws:iam::042803551319:role/JustAskEvieServiceCodePipelineServiceRole",
                    "Description": "The ARN of the CodePipeline role",
                    "ExportName": "JustAskEvieCoreStack:JustAskEvieServiceCodePipelineServiceRole"
                },
                {
                    "OutputKey": "EcsServiceRole",
                    "OutputValue": "arn:aws:iam::042803551319:role/JustAskEvieCoreStack-EcsServiceRole-1WSGOS5N293E0",
                    "Description": "The ARN of the ECS Service role",
                    "ExportName": "JustAskEvieCoreStack:EcsServiceRole"
                },
                {
                    "OutputKey": "PrivateSubnetOne",
                    "OutputValue": "subnet-05f2317268d57fd66",
                    "Description": "Private subnet one",
                    "ExportName": "JustAskEvieCoreStack:PrivateSubnetOne"
                }
            ],
            "Tags": [],
            "EnableTerminationProtection": false,
            "DriftInformation": {
                "StackDriftStatus": "NOT_CHECKED"
            }
        }
    ]
}


PS C:\Users\robin\OneDrive\Documents\justaskevie\FINAL> aws sts get-caller-identity
{
    "UserId": "AIDAQT52KLRL5GT44ART3",
    "Account": "042803551319",
    "Arn": "arn:aws:iam::042803551319:user/robin"
}

docker build . -t 042803551319.dkr.ecr.us-east-1.amazonaws.com/justaskevie/service:latest


 042803551319.dkr.ecr.us-east-1.amazonaws.com/justaskevie/service:latest


 New-ECRRepository -RepositoryName justaskevie/service


 PS C:\Users\robin\OneDrive\Documents\justaskevie\FINAL\api>  New-ECRRepository -RepositoryName justaskevie/service


CreatedAt                  : 2/26/2021 10:14:22 PM
EncryptionConfiguration    : Amazon.ECR.Model.EncryptionConfiguration
ImageScanningConfiguration : Amazon.ECR.Model.ImageScanningConfiguration
ImageTagMutability         : MUTABLE
RegistryId                 : 042803551319
RepositoryArn              : arn:aws:ecr:us-east-1:042803551319:repository/justaskevie/service
RepositoryName             : justaskevie/service
RepositoryUri              : 042803551319.dkr.ecr.us-east-1.amazonaws.com/justaskevie/service

Invoke-Expression $(Get-ECRLoginCommand | Select-Object -ExpandProperty Command)
Get-ECRImage -RepositoryName mythicalmysfits/service