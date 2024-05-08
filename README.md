# Connector Documentation Guidelines

## TLDR / Subnet Owner's Todo List
- Fork the repo and put up a PR to add OpenAPI documentation for your respective SNs API connector under the `SN_[YOUR_SUBNET_NUMBER_HERE]` directory, add @specialk111 as reviewer
- Set up a walkthrough session with @specialk111
- SLA
- Product proposal & existing URL/frontend

## Introduction
To ensure uniformity and to facilitate easier integration, we request all subnets who are collaborating with us to follow a set format for API documentation. This README outlines the requirements for submitting connector API documentation.

## Documentation Format
All API documentation should be provided in the [OpenAPI specification](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md), using either YAML or JSON formats. We recommend using the `Library API` documentation (located in the `SN_X` folder) as a template or reference for how your API documentation should be structured.

## Required Information
Your API documentation should include the following key elements:

### API Details
- Base URL: The root URL of your API where all endpoint paths will be appended.
- Authentication: Details on the authentication mechanism (e.g., API keys, OAuth tokens).
- Rate Limits: Information on any limitations on the number of API calls.

### Endpoints
For each public endpoint in your API, the documentation must include:

- Path: The specific URL path for the endpoint.
- Method: The HTTP method (GET, POST, PUT, DELETE, etc.) used.
- Parameters: Any parameters required or optional, their data types, and whether they are included in the query string, path, or body.
- Request Examples: Example requests to show how data should be formatted and sent.
- Response Examples: Example responses from the API including error responses and status codes.
- Data Types: Clearly specify the data types that are expected by and returned from the API.

### Data Types
Specify the data structures used in your API. For each data type, detail:

- Properties: Name and data type of each property.
- Required: Fields that are mandatory.
- Example Values: Provide examples of what the data type should look like.

## Non-RESTful APIs
If connecting to your system does not involve RESTful API endpoints but uses other methods (like WebSocket connections, FTP, etc.), please provide detailed documentation in any format that includes:

- Connection Details: How to establish a connection from the frontend.
- Data Transmission: How data is sent and received through your system.
- Examples and Use Cases: Detailed examples of using your system including any initialization or setup needed.

## Submission
Please fork this repo and submit a pull request with your subnet's complete connector documentation. Following the `SN_X` example, create a directory for your subnet (`SN_[YOUR_SUBNET_NUMBER_HERE]`) and add your connector details.


## Web 2 and Connector Architecture

```mermaid
flowchart LR
    Alice --> web2_ELB

    subgraph Web2 Networking Layer
        web2_ELB["Web2 ELB"]
    end

    subgraph Web2 EKS Cluster
        web2_nginx_1["nginx pod"]
        web2_nginx_2["nginx pod"]
        web2_nginx_3["nginx pod"]
        mfe["Micro Frontends"]
    end

    web2_ELB -- HTTPS --> web2_nginx_1
    web2_ELB -- HTTPS --> web2_nginx_2
    web2_ELB -- HTTPS --> web2_nginx_3

    web2_nginx_1 -- MESH --> mfe
    web2_nginx_2 -- MESH --> mfe
    web2_nginx_3 -- MESH --> mfe

    mfe -- HTTPS --> connector_ELB
    mfe -- STREAMS --> connector_FIREHOSE
    mfe -- QUEUE --> connector_SQS


    subgraph Connector Networking Layer
        connector_ELB["ELB"]
        connector_FIREHOSE["Kinesis Firehose"]
        connector_SQS["SQS"]
    end

    subgraph Connector EKS Cluster
        connector_nginx_1["nginx pods"]
        connector_streams_2["streams pods"]
        connector_queue_3["queue pods"]
    end

    connector_ELB -- HTTPS --> connector_nginx_1
    connector_FIREHOSE -- STREAMS --> connector_streams_2
    connector_SQS -- QUEUE --> connector_queue_3

    connector_nginx_1 -- HTTPS --> validator_ELB
    connector_streams_2 -- HTTPS --> validator_ELB
    connector_queue_3 -- HTTPS --> validator_ELB


    subgraph Validator Networking Layer
        validator_ELB["Validator ELB"]
    end

    subgraph Validator EC2 instances
        validator_1
        validator_2
        validator_N
    end

    validator_ELB -- HTTPS --> validator_1
    validator_ELB -- HTTPS --> validator_2
    validator_ELB -- HTTPS --> validator_N



```