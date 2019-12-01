import { generate } from 'cucumber-html-reporter';

export const options = {
  theme: 'foundation',
  jsonFile: './reporting/json/json-report.json',
  output: './reporting/html/html-report.html',
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: false,
};

generate(options);
