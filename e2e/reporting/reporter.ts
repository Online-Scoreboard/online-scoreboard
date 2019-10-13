import { generate } from 'cucumber-html-reporter';

export const options = {
  theme: 'foundation',
  jsonFile: './e2e/reporting/json/json-report.json',
  output: './e2e/reporting/html/html-report.html',
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: false,
};

generate(options);