# stock-tranding-sls

### Architecture Diagram

[logo]: /stock_trading_serverless_service.png
![alt text][logo]

### Items below for todos

~~1. Layout the traditional architectural components for the serverless app.
    - API Gateways
    - Services/Lambdas
    - Data/Models
    - EventBus/EventBridge, etc
    and to use Python diagram draw up and connect the dots together.~~
2. AWS Secret Keys to configure
3. `sls deploy` , `sls invoke`, `sls logs` commands to document.
4. To clean up and uniform JSONified response everywhere ie `statusCode`, `body`, `message`, etc.
5. To annotate REST API guidelines
6. To describe database schemas
7. To decide whether this endpoints need some authorizer endpoint before consuming resource.
8. To find the time to come up the fullfillment calclation logic as the next steps..
9. And to include unit testing, integrationtesting etc

#### NB - for serverless v3 to work; you need to install node v18 or above in order to make this work. For serverless v2; node 14 works better; In short, bear in mind which local/global node/npm version you used for switching between serverless versions
