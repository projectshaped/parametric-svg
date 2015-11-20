#! /usr/env babel-node

const {ln} = require('shelljs');
const packages = require('./utilities/packages');

const projectRoot = `${__dirname}/..`;

console.log('\nLinking our packages…');
packages.forEach(({cwd, manifest: {name}}) => {
  ln('-sf', `${cwd}`, `${projectRoot}/node_modules/${name}`);
});
console.log('…done.');

console.log(`\nLinking node_modules folders…`);
packages.forEach(({ cwd }) => {
  ln('-sf', `${projectRoot}/node_modules`, `${cwd}/node_modules`);
});
console.log('…done.');
