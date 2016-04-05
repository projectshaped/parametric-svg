#! /usr/env node

const packages = require('./utilities/packages');
const exec = require('./utilities/exec');

console.log(`\nBuilding our packages…`);
packages.forEach(project => {
  try {
    exec('npm run --silent prepublish', { cwd: project.cwd });
  } catch (error) {
    if (error.status !== 1) throw error;
    console.log('Nothing to build!');
  }
});
console.log('…done.');
