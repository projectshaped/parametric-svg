#! /usr/bin/env babel-node

const fs = require('fs');
const sortKeys = require('sort-keys');

const packages = require('./utilities/packages');

const globalManifest = require('../package.json');
const originalDependencies = globalManifest.dependencies;

const serialize = (value) => JSON.stringify(value, null, 2) + '\n';

// Pull local dependencies into global manifest.
const dependencies = sortKeys(packages.reduce((target, { manifest }) => {
  return Object.assign({}, manifest.dependencies, target);
}, originalDependencies));

const newGlobalManifest = Object.assign({}, globalManifest, { dependencies });

fs.writeFileSync(
  `${__dirname}/../package.json`,
  serialize(newGlobalManifest)
);

// Push global versions to local manifests.
packages.forEach(({ cwd, manifest }) => {
  if (!manifest.dependencies) return;

  const newManifest = Object.assign({}, manifest);

  Object.keys(newManifest.dependencies).forEach(name => {
    newManifest.dependencies[name] = dependencies[name];
  });

  fs.writeFileSync(
    `${cwd}/package.json`,
    serialize(newManifest)
  );
});
