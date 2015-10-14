#! /usr/env babel-node

const {ls} = require('shelljs');
const {execSync} = require('child_process');

const packages = ls(`${__dirname}/../packages/*`).map(cwd => ({
  cwd,
  manifest: require(`${cwd}/package.json`),
}));

packages.forEach(({cwd}) => {
  execSync('npm link', {cwd});
});

const isOurPackage = /^parametric-svg-/;
packages.forEach((
  {cwd, manifest: {dependencies = {}, devDependencies = {}}}
) => {
  execSync('npm install', {cwd});

  Object.keys(dependencies).concat(Object.keys(devDependencies))
    .filter(name => isOurPackage.test(name))
    .forEach(name => execSync(`npm link ${name}`, {cwd}));
});
