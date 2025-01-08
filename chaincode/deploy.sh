# Directory paths in linux environment
FABRIC_SAMPLE_TEST_NETWORK_PATH=""
CHAINCODE_PATH=""

# Install scripts if necessary
#curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh
#./install-fabric.sh docker samples binary

# Shut down any active networks
cd $FABRIC_SAMPLE_TEST_NETWORK_PATH
./network.sh down;

# Create the network
./network.sh up createChannel -c mychannel -ca;

# Deploy chaincode
./network.sh deployCC -ccn basic -ccp $CHAINCODE_PATH -ccl typescript