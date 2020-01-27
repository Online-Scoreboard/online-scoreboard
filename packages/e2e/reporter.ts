import { generate } from 'cucumber-html-reporter';

export const options = {
  theme: 'foundation',
  jsonFile: './reporting/json/json-report.json',
  output: './reporting/html/html-report.html',
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: false,
};

try {
  generate(options);
} catch (e) {
  if (e.code === 'ENOENT') {
    console.log(`Report.json does not exist in packages/e2e/reporting/json`);
  }
}
