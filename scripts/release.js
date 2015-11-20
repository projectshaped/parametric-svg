#! /usr/env babel-node

const {exit} = require('shelljs');
const {writeFileSync, readFileSync} = require('fs');
const {assign, keys} = Object;
const exec = require('./utilities/exec');
const format = require('format-date');

const args = process.argv.slice(2);

const versionBundles = {
  'spec': [
    'element',
    'parse',
    'patch',
    'spec',
  ],
};

if (args.length < 2) {
  process.stderr.write('Usage:  release.js <package name> <version keyword>\n');
  exit(1);
}

const [packageName, versionKeyword] = args;
const bundle = versionBundles[packageName] || [packageName];

const projectRoot = `${__dirname}/..`;
const packagesRoot = `${projectRoot}/packages`;
const bumpPackage = ({name, version}) => {
  exec(`npm --no-git-tag-version version ${version}`, {
    cwd: `${packagesRoot}/${name}`,
  });
};

console.log('\nBumping package versions…');
bumpPackage({name: packageName, version: versionKeyword});
const versionNumber = (
  require(`${packagesRoot}/${packageName}/package.json`).version
);
bundle
  .filter(name => name !== packageName)
  .forEach(name => bumpPackage({name, version: versionNumber}));
console.log('…done!');

console.log('Updating dependency versions…');
require('./utilities/packages').forEach(({cwd, manifest}) => {
  // We must require `./utilities/packages` after the bumps.

  const {dependencies} = manifest;

  if (dependencies) {
    const newDependencies = keys(dependencies).reduce((target, dep) => assign(
      {}, target,
      {[dep]: (bundle.includes(dep) ?
        versionNumber :
        dependencies[dep]
      )}
    ), {});

    const newManifest = `${
      JSON.stringify(
        assign(manifest, {dependencies: newDependencies}), null, 2
      )
    }\n`;

    writeFileSync(`${cwd}/package.json`, newManifest);
  }
});
console.log('…done!');

console.log('Updating the changelog…');
const changelogPath = `${projectRoot}/Changelog.yaml`;
const currentChangelog = readFileSync(changelogPath, 'utf8');
const newChangelog = currentChangelog
  .replace(/^master:\n/, `${
    versionNumber
  }:\n  date:         ${
    format('{year}-{month}-{day}', new Date())
  }\n`);
writeFileSync(changelogPath, newChangelog, 'utf8');
console.log('…done!');

console.log('Committing changes…');
exec(`git add packages/*/package.json Changelog.yaml`);
exec(`git commit --message='${packageName} v${versionNumber}'`);
console.log('…done!');

console.log('Publishing packages…');
bundle.forEach(name => {
  exec('npm publish', {cwd: `${packagesRoot}/${name}`});
});
exec('git push');
console.log('…done!');
