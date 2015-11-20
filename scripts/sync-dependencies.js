#! /usr/bin/env babel-node

const fs = require('fs');

const packages = require('./utilities/packages');

const globalManifest = require('../package.json');
const dependencies = globalManifest.dependencies;

// Update versions in local manifests.
packages.forEach(({ cwd, manifest }) => {
  const newManifest = Object.assign({}, manifest);

  Object.keys(newManifest.dependencies).forEach(name => {
    newManifest.dependencies[name] = dependencies[name];
  });

  fs.writeFileSync(`${cwd}/package.json`, JSON.stringify(newManifest));
});

// Update global dependencies.
const newDependencies = packages.reduce((target, { manifest }) => {
  return Object.assign(target, manifest.dependencies);
}, Object.assign({}, dependencies));

const newManifest = Object.assign({}, globalManifest, {
  dependencies: newDependencies,
});

fs.writeFileSync(
  `${__dirname}/../package.json`,
  JSON.stringify(newManifest)
);
