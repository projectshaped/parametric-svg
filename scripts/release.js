#! /usr/env babel-node

const {ls, exit} = require('shelljs');
const {execSync} = require('child_process');
const {basename} = require('path');

const exec = (...args) => {
  console.log(`${args[1] && args[1].cwd || ''}$ ${args[0]}`);
  process.stdout.write(execSync(...args));
};
const args = process.argv.slice(2);

const versionBundles = {
  'parametric-svg-spec': [
    'parametric-svg-element',
    'parametric-svg-parse',
    'parametric-svg-patch',
    'parametric-svg-spec',
  ],
};

if (args.length < 2) {
  process.stderr.write('Usage:  release.js <package name> <version keyword>\n');
  exit(1);
}

const [packageName, versionKeyword] = args;
const bundle = versionBundles[packageName] || [packageName];

const packagePath = (name) => `${__dirname}/../packages/${name}`;
const bumpPackage = ({name, version}) => {
  exec(`npm --no-git-tag-version version ${version}`, {
    cwd: packagePath(name),
  });
};

console.log('\nBumping package versions…');
bumpPackage({name: packageName, version: versionKeyword});
const versionNumber = (
  require(`${packagePath(packageName)}/package.json`).version
);
bundle
  .filter(name => name !== packageName)
  .forEach(name => bumpPackage({name, version: versionNumber}));
console.log('…done.');
