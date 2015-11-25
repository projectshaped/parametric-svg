#! /usr/bin/env node

const fs = require('fs');
const sortKeys = require('sort-keys');
const asArray = require('as/array');
const asObject = require('as/object');
const includes = require('array-includes');

const packages = require('./utilities/packages');

const globalManifest = require('../package.json');
const originalDependencies = globalManifest.dependencies;

const serialize = (value) => JSON.stringify(value, null, 2) + '\n';

// Pull local dependencies into global manifest.
const ourPackageNames = packages.map(project => project.manifest.name);

const dependencies = sortKeys(packages.reduce((target, project) => {
  const externalDependencies = asObject(
    asArray(project.manifest.dependencies)
      .filter(dependency => !includes(ourPackageNames, dependency.key))
  );

  return Object.assign({}, externalDependencies, target);
}, originalDependencies));

const newGlobalManifest = Object.assign({}, globalManifest, { dependencies });

fs.writeFileSync(
  `${__dirname}/../package.json`,
  serialize(newGlobalManifest)
);

// Push global versions to local manifests.
packages.forEach((project) => {
  if (!project.manifest.dependencies) return;

  const newManifest = Object.assign({}, project.manifest);

  Object.keys(newManifest.dependencies).forEach(name => {
    if (!('name' in dependencies)) return;
    newManifest.dependencies[name] = dependencies[name];
  });

  fs.writeFileSync(
    `${project.cwd}/package.json`,
    serialize(newManifest)
  );
});
