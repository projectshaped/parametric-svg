#! /usr/env babel-node
/* eslint-disable no-console */

const {ls} = require('shelljs');
const {execSync} = require('child_process');

const exec = (...args) => {
  process.stdout.write(execSync(...args));
};

const packages = ls(`${__dirname}/../packages/*`).map(cwd => ({
  cwd,
  manifest: require(`${cwd}/package.json`),
}));

console.log('\nCreating npm links…');
packages.forEach(({cwd}) => {
  exec('npm link', {cwd});
});
console.log('…done.');

const isOurPackage = /^parametric-svg-/;
packages.forEach((
  {cwd, manifest: {dependencies = {}, devDependencies = {}, name}}
) => {
  console.log(`\nInstalling and linking dependendies for \`${name}\`…`);

  exec('npm install', {cwd});

  Object.keys(dependencies).concat(Object.keys(devDependencies))
    .filter(module => isOurPackage.test(module))
    .forEach(module => exec(`npm link ${module}`, {cwd}));

  console.log('…done.');
});
