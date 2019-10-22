# Online Scoreboard

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/d2700d18225345bd95c9ca74616db080)](https://www.codacy.com/manual/andreasonny83/online-scoreboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Online-Scoreboard/online-scoreboard&amp;utm_campaign=Badge_Grade)

This project is running live at: [online-scoreboard.now.sh](https://online-scoreboard.now.sh)
against the latest changes on the master branch of this repository

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## About the project

Read more about this project in the [Wiki](https://github.com/Online-Scoreboard/online-scoreboard/wiki)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run lint`

Lint the code using ESLint and the rules listed in the `.eslintrc` file.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run e2e`

Runs all the e2e test suites under `e2e/features`

Mandatory:
- export `TS_NODE_PROJECT=e2e/tsconfig.json`

Optional:
 - `SELENIUM_BROWSER` - specify what browser to use. Defaults to chrome.
 - `HOMEPAGE_URL` - specify base URL which will be used to access the online-scoreboard. Defaults to http:localhost:3000.

### `npm run e2e-report`

Generates an html report from the cucumber report json

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
