#! /usr/env node

const _shelljs = require('shelljs');
const rm = _shelljs.rm;
const packages = require('./utilities/packages');

const projectRoot = `${__dirname}/..`;

console.log('\nUnlinking our packages…');
rm('-f', `${projectRoot}/node_modules/@parametric-svg`);
console.log('…done.');

console.log(`\nUnlinking node_modules folders…`);
packages.forEach(project => {
  rm('-f', `${project.cwd}/node_modules`);
});
console.log('…done.');
