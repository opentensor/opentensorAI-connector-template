## SN Owners' to do list 

- Fork the template and put up a PR to create a React app that works for respective SN: add @specialK111 as reviewer. Set up a walkthrough session with @specialK111
  
- SLA

- Product proposal & existing URL/frontend
  


## Web 2 and Connector Architecture

It's not clear to me if the Micro Frontends (MFE) need to be fluent in non https talk. 

The reason being not all AI models are the same. Some are stream based, some could be queue based, and some are prompt/response interactive.

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
