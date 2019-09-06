# BMO-Capital-Markets-UI

This repository holds the code base for the front end of the application.

## Deployed Instances

| DEV | QA | UAT | MASTER |
|--------|--------|--------|--------|
|[![Build Status](https://ci-galeservices-uw2.galepartners.com/buildStatus/icon?job=BMO/CapitalMarkets/UI/development)](https://ci-galeservices-uw2.galepartners.com/job/BMO/job/CapitalMarkets/job/UI/job/development/)|[![Build Status](https://ci-galeservices-uw2.galepartners.com/buildStatus/icon?job=BMO/CapitalMarkets/UI/QA)](https://ci-galeservices-uw2.galepartners.com/job/BMO/job/CapitalMarkets/job/UI/job/QA/)|[![Build Status](https://ci-galeservices-uw2.galepartners.com/buildStatus/icon?job=BMO/CapitalMarkets/UI/UAT)](https://ci-galeservices-uw2.galepartners.com/job/BMO/job/CapitalMarkets/job/UI/job/UAT/)|  NOT SETUP |


|    ENV    |    URL    |
|-----------|-----------|
|    DEV - Equity    | https://bmo-capital-markets-dev-ui-equity.galepartners.com/ |
|    DEV - Debt   | https://bmo-capital-markets-dev-ui-corp.galepartners.com/ |
|    QA  - Equity   | https://bmo-capital-markets-qa-ui-equity.galepartners.com/ |
|    QA  - Debt   | https://bmo-capital-markets-qa-ui-corp.galepartners.com/ |
|    UAT - Equity    | https://bmo-capital-markets-uat-ui-equity.galepartners.com/ |
|    UAT - Debt    | https://bmo-capital-markets-uat-ui-corp.galepartners.com/ |
|    PROD    ||

## To build JS and CSS on Equity Site

To install packages we can remove the local `node_modules` directory and run `yarn install`

### On local

```
npm start
```

### To Visualize the package size with bundle analyzer


```
npm run start-analyze
```

### On Servers (env)


```
npm run build:bmo_equity_dev (dev env)
npm run build:bmo_equity_qa  (QA env)
npm run build:bmo_equity_uat (UAT env)
npm run build:bmo_equity (production env)
```

The above environment specific commands shall generate the files in ``dist_equity`` folder


## To build JS and CSS on Corporate Debt Site

To install packages we can remove the local `node_modules` directory and run `yarn install` to install a fresh copy of the dependent packages.

### On local

```
npm run start-corp
```

### To Visualize the package size with bundle analyzer


```
npm run start-analyze-corp
```

### On Servers (env)


```
npm run build:bmo_corp_dev (dev env)
npm run build:bmo_corp_qa  (QA env)
npm run build:bmo_corp_uat (UAT env)
npm run build:bmo_corp (production env)
```

The above environment specific commands shall generate the files in ``dist_corp`` folder
