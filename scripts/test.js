#! /usr/env babel-node

const {execSync} = require('child_process');
const {basename} = require('path');

const exec = (...args) => {
  process.stdout.write(execSync(...args));
};

const packages = require('./utilities/packages');
packages.forEach(({cwd}) => {
  console.log(`\nTesting ${basename(cwd)}…`);
  exec('npm test', {cwd});
  console.log('…done.');
});
