---
title: Easy AWS AppSync with Terraform
date: '2020-12-13'
description: 'How Terraform simplifies AppSync deployments.'
tags: ['graphql', 'aws', 'terraform', 'appsync', 'go']
---

I am a big proponent of GraphQL, so when I was looking into AWS services and found [AppSync](https://aws.amazon.com/appsync/) I wanted to dig into it a bit more.

As a proof-of-concept, I wanted to create an extremely simple AppSync service with a single Query field attached to a single Lambda function. In my mind, that would be painless to set up.

## AppSync API requirements

In reality, it turned out to have quite a few moving parts, since there are extra entities required for AppSync to glue everything together. The process for that simple app looks something like this:

1. create AppSync instance with AppSync IAM role
1. attach "invoke Lambda" policy to AppSync IAM role so it can invoke the Lambda
1. write GraphQL schema in AppSync
1. write Lambda function and zip it
1. create Lambda instance with Lambda IAM role using zipped Lambda code
1. create AppSync data source for the Lambda
1. create AppSync resolver for your Query field and connect to data source
1. write resolvers in [Apache Velocity](https://velocity.apache.org/) to transform data to and from the Lambda

If you're keeping track, there are about 8 entities to create, and lots of other steps for connecting them. As someone who only has moderate familiarity with AWS, I was starting to get stressed out about keeping track of all of the created services. After all, this is just a test and I didn't want to forget to delete services once I'd finished testing it out.

I have used [Serverless](https://www.serverless.com/) in the past, but research into using it for AppSync led me to [this plugin](https://www.serverless.com/). I wasn't a fan of the "wall of yaml" configuration, or the fact that previous usage of Serverless had created services without me explicitly saying to, so I decided to look into [Hashicorp's Terraform](https://www.terraform.io/) instead.

## Why use Terraform?

Terraform immediately impressed me with the ease of setup, and I found it easy to understand and use. Some of my favorite features were:

- the diff-style changes, which show you precise information about what resources are being created, updated or destroyed
- the ultra-simple 3 command development cycle (`terraform init` to create resources, `terraform plan` to evaluate the diff, and `terraform apply` to apply the changes)
- the ultra-ultra-simple destroy command (`terraform destroy` and all the test resources are immediately removed from AWS)

Not to mention the fact that Terraform provides a consistent configuration language that can be used for all cloud providers (although I am using it solely for AWS in this example).

The rest of this post will focus on the actual Terraform configuration required to create a simple AppSync service. If you want to know more about Terraform CLI commands and syntax, then I recommend checking out the [Get Started - AWS](https://learn.hashicorp.com/collections/terraform/aws-get-started) tutorials and go from there!

## Terraform configuration

> If you want to skip ahead to the final product, I have a [repository with the final code](https://github.com/liamross/appsync-terraform-go-example). Read the README for information on the repo and instructions for publishing.

### 1. GraphQL schema

Generally when working with GraphQL it helps come up with your schema first, so that's what I did. Because this is a simple demo app, I kept the schema very simple. I created a `schema.graphql` file with the following contents:

```graphql{numberLines: true}
type Person {
  id: ID!
  name: String!
}

type Query {
  listPeople: [Person]!
}

schema {
  query: Query
}
```

As you can see, we will only need a single resolver to handle `listPeople`.

### 2. Create basic terraform files

Next we want to create 2 basic terraform files: `main.tf` and `variables.tf`. While having a variables file isn't necessary, it makes it easier to do quick changes to the naming and regions. I set the defaults to whatever worked best for me, but they can be changed to anything you want.

Inside `variables.tf`:

```shell{numberLines: true}
# This should be whatever AWS credentials profile you
# want to use to publish your AppSync service.
variable "aws_credentials_profile" {
  default = "default"
}

# This is the region the service will be built
# in. Set this to a valid AWS region.
variable "region" {
  default = "us-west-2"
}

# This is the prefix for the name of every created service.
# This can be anything you want, it is solely to prevent
# naming clashes if multiple AppSync services are published.
variable "prefix" {
  default = "appsync_terraform_go_example"
}
```

Inside `main.tf`:

```shell{numberLines: true}
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

# Set the AWS credentials profile and region you want to publish to.
provider "aws" {
  profile = var.aws_credentials_profile
  region  = var.region
}
```

### 3. IAM setup

If you're like me and don't use AWS much, then IAM policies and roles may be a bit confusing, especially if you are generating them using JSON. They have a lot of extra noise like the `"Version"` property which takes the value `"2012-10-17"` (or the earlier deprecated `"2008-10-17"`), and various other fields. Luckily, Terraform has an awesome `data` block called `aws_iam_policy_document` which has implemented lots of these extra "noise" properties as default values, so you can minimize what you actually have to repeat over and over again. In terms of what is required for our AppSync service, there are 3 resources and one attachment to create:

1. Lambda role
1. AppSync role
1. "Invoke Lambda" policy
1. Attach "Invoke Lambda" policy to AppSync role (so it can invoke the Lambda)

I decided to create a separate Terraform file just for IAM called `iam.tf` to contain all these elements. Terraform allows you to split up code into any number of `.tf` files, and they can all read each other's content as long as they're in the same directory.

In Terraform, that looks like this:

```shell{numberLines: true}
# =============
# --- Roles ---
# -------------

# Lambda role

data "aws_iam_policy_document" "iam_lambda_role_document" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "iam_lambda_role" {
  name               = "${var.prefix}_iam_lambda_role"
  assume_role_policy = data.aws_iam_policy_document.iam_lambda_role_document.json
}

# Appsync role

data "aws_iam_policy_document" "iam_appsync_role_document" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["appsync.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "iam_appsync_role" {
  name               = "${var.prefix}_iam_appsync_role"
  assume_role_policy = data.aws_iam_policy_document.iam_appsync_role_document.json
}

# ================
# --- Policies ---
# ----------------

# Invoke Lambda policy

data "aws_iam_policy_document" "iam_invoke_lambda_policy_document" {
  statement {
    actions   = ["lambda:InvokeFunction"]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "iam_invoke_lambda_policy" {
  name   = "${var.prefix}_iam_invoke_lambda_policy"
  policy = data.aws_iam_policy_document.iam_invoke_lambda_policy_document.json
}

# ===================
# --- Attachments ---
# -------------------

# Attach Invoke Lambda policy to AppSync role.

resource "aws_iam_role_policy_attachment" "appsync_invoke_lambda" {
  role       = aws_iam_role.iam_appsync_role.name
  policy_arn = aws_iam_policy.iam_invoke_lambda_policy.arn
}
```

### 4. Create the AppSync GraphQL API

[Terraform's AWS provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs) provides lots of useful resources, including an entire suite for AppSync! Back in `main.tf`, we can add the AppSync GraphQL API. We will use `"API_KEY"` as the authentication type for this demo, but there are other options which can be found [here](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appsync_graphql_api#authentication_type).

We will add the following to `main.tf`:

```shell{numberLines: 16}
# --- AppSync Setup ---

# Create the AppSync GraphQL api.
resource "aws_appsync_graphql_api" "appsync" {
  name                = "${var.prefix}_appsync"
  schema              = file("schema.graphql")
  authentication_type = "API_KEY"
}

# Create the API key.
resource "aws_appsync_api_key" "appsync_api_key" {
  api_id = aws_appsync_graphql_api.appsync.id
}
```

### 5. Create the Lambda function

Before we can use the lambda function as a data source for AppSync we need it to exist! Now, this is where your own preferences will differ slightly from my own. I chose to write my Lambda function in Go because I love Go, but really you can write it in any language you want.

I won't go into how I build the Go lambda, but if you want to check it out:

- [Go Lambda function](https://github.com/liamross/appsync-terraform-go-example/blob/main/functions/list-people/main.go)
- [Makefile with build command](https://github.com/liamross/appsync-terraform-go-example/blob/main/Makefile)

At the end of the day, once I run the `make build` which runs the build command in `Makefile`, I end up with a binary of my Go Lambda function located at `./bin/list-people`.

However, Lambda functions generally require a zip file. And once again, Terraform has a `data` block for that: `archive_file`.

Add the following to your `main.tf` file:

```shell{numberLines: 30}
# --- listPeople ---

# Create zip file from Go list-people binary.
data "archive_file" "listPeople_lambda_zip" {
  type        = "zip"
  source_file = "./bin/list-people"
  output_path = "./zip/list-people.zip"
}

# Create lambda function from zip file, with lambda role.
resource "aws_lambda_function" "listPeople_lambda" {
  function_name    = "${var.prefix}_listPeople_lambda"
  filename         = data.archive_file.listPeople_lambda_zip.output_path
  source_code_hash = data.archive_file.listPeople_lambda_zip.output_base64sha256
  role             = aws_iam_role.iam_lambda_role.arn
  runtime          = "go1.x"
  handler          = "list-people"
}
```

Since the `aws_lambda_function` resource takes a `source_code_hash`, it will only update your Lambda on AWS if there was a change!

> Note: I highly recommend using the `data` block `archive_file` as shown above to zip rather than running the `zip` command in your terminal or `Makefile`. One reason is that there are some issues around the `source_code_hash` being set properly if you zip it yourself. Additionally, there's an annoying `-j` flag that you should set if you run `zip` yourself, as without `-j` it will zip up the entire directory instead of just the function binary (which could, say, lead to hours and hours of frustration when your Lambda doesn't work since it's a zip of a directory and not a file. Not that I would know)

### 6. Connect Lambda to AppSync

The final step! Now that we have a Lambda function, we need to create a datasource for it, then connect that to AppSync using resolvers. You can do your resolvers however you want, but I chose to write them in actual velocity files then import those. I made a generic pair for GraphQL queries and placed them in the folder `./resolvers/lambda`:

`./resolvers/lambda/request.vtl`:

```shell{numberLines: true}
{
  "version": "2018-05-29",
  "operation": "Invoke",
  "payload": {
    "arguments": $utils.toJson($context.arguments)
  }
}
```

`./resolvers/lambda/response.vtl`:

```shell{numberLines: true}
$util.toJson($context.result)
```

All that was left to do now is create the datasource for the Lambda, and the resolvers for `listPeople`. To do that, we can add the following to `main.tf`:

```shell{numberLines: 49}
# Create data source in appsync from lambda function.
resource "aws_appsync_datasource" "listPeople_datasource" {
  name             = "${var.prefix}_listPeople_datasource"
  api_id           = aws_appsync_graphql_api.appsync.id
  service_role_arn = aws_iam_role.iam_appsync_role.arn
  type             = "AWS_LAMBDA"
  lambda_config {
    function_arn = aws_lambda_function.listPeople_lambda.arn
  }
}

# Create resolver using the velocity templates in /resolvers/lambda.
resource "aws_appsync_resolver" "listPeople_resolver" {
  api_id      = aws_appsync_graphql_api.appsync.id
  type        = "Query"
  field       = "listPeople"
  data_source = aws_appsync_datasource.listPeople_datasource.name

  request_template  = file("./resolvers/lambda/request.vtl")
  response_template = file("./resolvers/lambda/response.vtl")
}
```

## The end

That's all you need! It may have seemed like a lot, but in reality `main.tf` is only [~70 lines of code](https://github.com/liamross/appsync-terraform-go-example/blob/main/main.tf) (with another [~70 lines of code](https://github.com/liamross/appsync-terraform-go-example/blob/main/iam.tf) for IAM config in `iam.tf`). I find that much nicer than having to add all of those entities manually in AWS, and then having to delete them once I'm done.

Feel free to take a minute to compare your code with [the demo repository](https://github.com/liamross/appsync-terraform-go-example).

Now that you've done all the work to create the config, you can actually deploy it! Follow the instructions in the demo repo's README for setup and destroying the resources when you are done. Keep in mind that if you are past the 12 months of AWS's Free tier, you may be charged a small amount for the AppSync executions.

Overall, using Terraform has been a fantastic experience, especially for keeping track of active resources within AWS. For quick setup and tear-down it has been the perfect tool, and I feel like I have a lot more control over the services I provision. For me personally, I suspect I'll be using Terraform for most of the projects I create in the future.
