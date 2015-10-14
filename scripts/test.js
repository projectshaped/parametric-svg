#! /usr/env babel-node

const {ls} = require('shelljs');
const {execSync} = require('child_process');
const {basename} = require('path');

const exec = (...args) => {
  process.stdout.write(execSync(...args));
};

const packages = ls(`${__dirname}/../packages/*`).map(cwd => ({
  cwd,
  manifest: require(`${cwd}/package.json`),
}));

packages.forEach(({cwd}) => {
  console.log(`\nTesting ${basename(cwd)}…`);
  exec('npm test', {cwd});
  console.log('…done.');
});
