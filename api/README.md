# API

In this project we will use [.NET Core 2.1](https://docs.microsoft.com/en-us/dotnet/core/) and create a [Web API app](https://docs.microsoft.com/en-us/aspnet/core/web-api/?view=aspnetcore-2.1) in a [Docker container](https://www.docker.com/) behind a [Network Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html). These will form the microservice backend for the frontend website to integrate with.

## Creating a .NET Web API Container

### Building A Docker Image

Next, create a Docker container image that contains all of the code and configuration required to run the JustAskEvie backend as a microservice API created with .NET Core. We will build the docker container image within our local terminal and then push it to the Amazon Elastic Container Registry, where it will be available to pull when we create our service using Fargate.

All of the code required to run our service backend is stored within the `/api` directory of the repository you've cloned into your local dev environment.  If you would like to review the .NET Core code that is used to create the service API, view the `/api/Controllers/JustAskEvieController.cs` file.

If you do not have Docker installed on your machine, you will need to install it. If you have it aleady installed, we can build the image by running the following commands:

* First change directory to `/api`

```
cd ./api
```

* Then build the Docker image. This will use the file in the current directory called `Dockerfile` that tells Docker all of the instructions that should take place when the build command is executed. Replace the contents in and the {braces} below with the appropriate information from the account/region you're working in.

To retrieve the needed information about your account and region, you can run the following CLI command that uses the AWS Security Token Service to return back information about the principal issuing either the CLI command or the PoewrShell command:

```
aws sts get-caller-identity
```
```
Get-STSCallerIdentity | Select-Object -Property Account
```

Once you have your Account ID, you are ready to build the docker image:

```
docker build . -t REPLACE_ME_AWS_ACCOUNT_ID.dkr.ecr.REPLACE_ME_REGION.amazonaws.com/justaskevie/service:latest
```
Commands with autoreplace:

`Bash`
```
docker build . -t $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$(aws configure get region).amazonaws.com/justaskevie/service:latest
```
`PowerShell`
```
docker build . -t ("{0}.dkr.ecr.{1}.amazonaws.com/justaskevie/service:latest" -f $(Get-STSCallerIdentity | Select-Object -ExpandProperty Account), $(Get-DefaultAWSRegion | Select-Object -ExpandProperty Region))
```

You will see docker download and install all of the necessary dependency packages that our application needs, and output the tag for the built image.  **Copy the image tag for later reference. Below the example tag shown is: 111111111111.dkr.ecr.us-east-1.amazonaws.com/justaskevie/service:latest**

```
Successfully built 8bxxxxxxxxab
Successfully tagged 111111111111.dkr.ecr.us-east-1.amazonaws.com/justaskevie/service:latest
```

#### Testing the Service Locally

Let's test our image locally to make sure everything is operating as expected. Copy the image tag that resulted from the previous command and run the following command to deploy the container locally:

```
docker run -p 8080:8080 REPLACE_ME_WITH_DOCKER_IMAGE_TAG
```

As a result you will see docker reporting that your container is up and running locally:

```
 * Running on http://0.0.0.0:8080/ (Press CTRL+C to quit)
```

To test our service with a local request, open up the above ip address in your browser of choice. Append /api/evies to the end of the URI in the address bar of the preview browser and hit enter:

![preview-menu](/images/module-2/address-bar.png)

If successful you will see a response from the service that returns the JSON document stored at `./api/evies-response.json`

When done testing the service you can stop it by pressing CTRL-c on PC or Mac.
