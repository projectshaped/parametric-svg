#! /usr/bin/env babel-node

const basename = require('path').basename;
const exec = require('./utilities/exec');

const packages = require('./utilities/packages');
packages.forEach(project => {
  const cwd = project.cwd;

  console.log(`\nTesting ${basename(cwd)}…`);
  exec('npm test', {cwd});
  console.log('…done.');
});
