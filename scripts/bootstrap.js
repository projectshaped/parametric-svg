#! /usr/env babel-node

const {cd, ls, exec, pwd} = require('shelljs');
const originalDirectory = pwd();
const npm = `${__dirname}/../node_modules/.bin/npm`;

const packages = ls(`${__dirname}/../packages/*`).map(location => ({
  location,
  manifest: require(`${location}/package.json`),
}));

packages.forEach(({location}) => {
  cd(location);
  exec(`${npm} link`);
});

const isOurPackage = /^parametric-svg-/;
packages.forEach(({location, manifest: {dependencies, devDependencies}}) => {
  cd(location);
  exec(`${npm} install`);

  Object.keys(dependencies).concat(Object.keys(devDependencies))
    .filter(name => isOurPackage.test(name))
    .forEach(name => exec(`${npm} link ${name}`));
});

cd(originalDirectory);
