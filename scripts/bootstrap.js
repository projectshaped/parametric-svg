#! /usr/env node

const _shelljs = require('shelljs');
const ln = _shelljs.ln;
const mkdir = _shelljs.mkdir;
const path = require('path');
const packages = require('./utilities/packages');

const projectRoot = `${__dirname}/..`;

console.log('\nLinking our packages…');
packages.forEach(project => {
  const target = `${projectRoot}/node_modules/${project.manifest.name}`;
  mkdir('-p', path.resolve(target, '..'));
  ln('-sf', `${project.cwd}`, target);
});
console.log('…done.');

console.log(`\nLinking node_modules folders…`);
packages.forEach(project => {
  ln('-sf', `${projectRoot}/node_modules`, `${project.cwd}/node_modules`);
});
console.log('…done.');
