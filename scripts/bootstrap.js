#! /usr/env babel-node

const {ls, mkdir, ln} = require('shelljs');
const {basename} = require('path');
const isOurPackage = require('./utilities/is-our-package');
const packages = require('./utilities/packages');
const exec = require('./utilities/exec');

console.log('\nCreating npm links…');
packages.forEach(({cwd, manifest: {name}}) => {
  exec('npm link', {cwd});
  exec(`npm link ${name}`, {cwd: `${__dirname}/..`});
});
console.log('…done.');

packages.forEach((
  {cwd, manifest: {dependencies = {}, devDependencies = {}, name}}
) => {
  console.log(`\nInstalling and linking dependendies for \`${name}\`…`);

  exec('npm install', {cwd});

  Object.keys(dependencies).concat(Object.keys(devDependencies))
    .filter(isOurPackage)
    .forEach(module => exec(`npm link ${module}`, {cwd}));

  console.log('…done.');
});

console.log('Linking binaries…');
const binaries = ls(`${__dirname}/../node_modules/.bin/*`);
packages.forEach(({cwd: module}) => {
  const destination = `${module}/node_modules/.bin`;
  mkdir('-p', destination);

  binaries.forEach(binary => {
    const target = `${destination}/${basename(binary)}`;

    console.log(`Linking ${binary} to ${target}.`);
    ln('-sf', binary, `${target}`);
  });
});
console.log('…done.');
