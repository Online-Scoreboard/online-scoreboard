const semver = require('semver');
const { engines } = require('./package');

const nodeVersion = engines.node;
if (!semver.satisfies(process.version, nodeVersion)) {
  console.log(`Required node version ${nodeVersion} not satisfied with current version ${process.version}.`);
  process.exit(1);
}
