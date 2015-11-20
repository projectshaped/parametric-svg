#! /usr/env babel-node

const { ln, mkdir } = require('shelljs');
const { resolve } = require('path');
const packages = require('./utilities/packages');

const projectRoot = `${__dirname}/..`;

console.log('\nLinking our packages…');
packages.forEach(({ cwd, manifest: { name } }) => {
  const target = `${projectRoot}/node_modules/${name}`;
  mkdir('-p', resolve(target, '..'));
  ln('-sf', `${cwd}`, target);
});
console.log('…done.');

console.log(`\nLinking node_modules folders…`);
packages.forEach(({ cwd }) => {
  ln('-sf', `${projectRoot}/node_modules`, `${cwd}/node_modules`);
});
console.log('…done.');
