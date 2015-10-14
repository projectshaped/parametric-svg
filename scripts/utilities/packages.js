const {ls} = require('shelljs');
const {extname} = require('path');

module.exports = ls(`${__dirname}/../../packages/*`)
  .filter(file => !extname(file))
  .map(cwd => ({
    cwd,
    manifest: require(`${cwd}/package.json`),
  }));
