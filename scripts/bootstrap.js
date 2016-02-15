#! /usr/env node

const _shelljs = require('shelljs');
const ln = _shelljs.ln;
const packages = require('./utilities/packages');

const projectRoot = `${__dirname}/..`;

console.log('\nLinking our packages…');
ln('-sf', `../packages`, `${projectRoot}/node_modules/@parametric-svg`);
console.log('…done.');

console.log(`\nLinking node_modules folders…`);
packages.forEach(package => {
  ln('-sf', `${projectRoot}/node_modules`, `${package.cwd}/node_modules`);
});
console.log('…done.');
