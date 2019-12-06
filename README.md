# Online Scoreboard

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/d2700d18225345bd95c9ca74616db080)](https://www.codacy.com/manual/andreasonny83/online-scoreboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Online-Scoreboard/online-scoreboard&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/d2700d18225345bd95c9ca74616db080)](https://www.codacy.com/manual/andreasonny83/online-scoreboard?utm_source=github.com&utm_medium=referral&utm_content=Online-Scoreboard/online-scoreboard&utm_campaign=Badge_Coverage)

This project is running live at: [online-scoreboard.now.sh](https://online-scoreboard.now.sh)
against the latest changes on the master branch of this repository

- [Online Scoreboard](#online-scoreboard)
  - [About the project](#about-the-project)
  - [Setup](#setup)
    - [Install dependencies](#install-dependencies)
    - [Configure your environment](#configure-your-environment)
  - [Run the project locally](#run-the-project-locally)
  - [Serving the app](#serving-the-app)
  - [ESLint](#eslint)
  - [Unit Test](#unit-test)
  - [E2E](#e2e)
  - [Build the app](#build-the-app)

## About the project

Read more about this project in the [Wiki](https://github.com/Online-Scoreboard/online-scoreboard/wiki)

## Setup

### Install dependencies

This project uses Yarn workspaces. Do not use Npm for installing dependencies or for running the scripts.

Once the project is cloned on your local machine, just install all the dependencies by running:

```sh
yarn
```

### Configure your environment

Rename the `.env.sample` under the `packages/client` folder and fill the variables
according to your environment configuration

## Run the project locally

```sh
yarn start
```

This script will launch the client application and watch for file changes on the `packages/client` folder.

Use this for running E2E tests, develop new features or manual testing

## Serving the app

```sh
yarn serve
```

This script will build a distribution version of the app and serve that from your local environment.

Use this script for running E2E tests or manual testing the production version of the app

## ESLint

```sh
yarn lint
```

This script will lint the TypeScript code using ESLint according to the configuration present
under the `.eslintrc.js` file

## Unit Test

```sh
yarn test
```

This script will run the unit tests and watch for file changes.

Use this script for local development, write new tests or test your local app.

## E2E

```sh
yarn e2e
```

Runs all the end-to-end test suites under `packages/e2e/features`

This script requires a local version of the client application to run on the port `3000`.
You can either use the [`yarn start`](#run-the-project-locally) or the [`yarn serve`](#serving-the-app) script.

Optional Configuration:
 - `SELENIUM_BROWSER` - specify what browser to use. Defaults to `chrome`
 - `HOMEPAGE_URL` - specify base URL which will be used to access the online-scoreboard. Defaults to `http:localhost:3000`

Export those as environment variables or change the default values from the `packages/e2e/env-keys.ts` file


## Build the app

```sh
yarn build
```

This script will build a production version of the app under the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

Your app is ready to be deployed!
