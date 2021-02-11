<p align="center">
<img src="https://user-images.githubusercontent.com/53361416/107611235-88f42680-6c69-11eb-8cdb-3806b50f52ac.png" alt="SIGH Finance text" width="240" height="240">
</p>

- SubGraph Link : https://thegraph.com/explorer/subgraph/cryptowhaler/sigh-boosters

Development
# copy env and adjust its content
cp .env.test .env
# fetch current contracts as submodule
npm run prepare:all
# run codegen
npm run subgraph:codegen
# now you're able to deploy to thegraph via
npm run deploy:hosted:mainnet
Deployment
To be able to deploy the subgraph in any environment for any network first we will need to prepare the local env:

get the protocol v2 contracts and compile them
npm run prepare:contracts
Self-hosted
The first time you will deploy the subgraph you need to first create it in the TheGraph node:
// For Kovan:
npm run subgraph:create:self-hosted:kovan

// for Mainnet
npm run subgraph:create:self-hosted:mainnet
Before any deployment you need to generate the types and schemas:
npm run subgraph:codegen
When / If the subgraph is created you can then deploy
// For Kovan:
  npm run deploy:self-hosted:kovan

// For Mainnet:
  npm run deploy:self-hosted:mainnet
Hosted
To be able to deploy to the hosted solution you will need to create a .env file and add ACCESS_TOKEN environment variable. You can find this in the dashboard of the TheGraph

// For Kovan:
npm run deploy:hosted:kovan

// For Mainnet:
npm run deploy:hosted:mainnet
Local
TODO:

refactor get addresses after local deployment
refactor npm scripts
Start docker environment for a buidler node and TheGraph infrastructure:
docker-compose up
Remember that before runing docker-compose up you need to run docker-compose down if it is not the first time. That is because the postgres database needs to not be persistant, so we need to delete the docker volumes.

Deploy local subgraph:

To check or query the subgraph use:
Queries (HTTP):     http://localhost:8000/subgraphs/name/aave/migrator
Subscriptions (WS): http://localhost:8001/subgraphs/name/aave/migrator

INFO Starting JSON-RPC admin server at: http://localhost:8020, component: JsonRpcServer
INFO Starting GraphQL HTTP server at: http://localhost:8000, component: GraphQLServer
INFO Starting index node server at: http://localhost:8030, component: IndexNodeServer
INFO Starting GraphQL WebSocket server at: ws://localhost:8001, component: SubscriptionServer
INFO Starting metrics server at: http://localhost:8040, component: MetricsServer
