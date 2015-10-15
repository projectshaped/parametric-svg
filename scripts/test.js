#! /usr/env babel-node

const {basename} = require('path');
const exec = require('./utilities/exec');

const packages = require('./utilities/packages');
packages.forEach(({cwd}) => {
  console.log(`\nTesting ${basename(cwd)}…`);
  exec('npm test', {cwd});
  console.log('…done.');
});
