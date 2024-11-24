# local-area-planning
## Setting up local development environment for Fabric using built in examples
Install [Docker](https://docs.docker.com/get-started/get-docker/) and [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install)

Enter linux environment

`curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh`

`./install-fabric.sh docker samples binary`

`cd fabric-samples/test-network`

`./network.sh down`

`./network.sh up createChannel -c mychannel -ca`

`./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-typescript/ -ccl typescript`
