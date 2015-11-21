const ls = require('shelljs').ls;
const extname = require('path').extname;

module.exports = ls(`${__dirname}/../../packages/*`)
  .filter(file => !extname(file))
  .map(cwd => ({
    cwd,
    manifest: require(`${cwd}/package.json`),
  }));
