const {execSync} = require('child_process');

module.exports = (...args) => {
  console.log(`${args[1] && args[1].cwd || ''}$ ${args[0]}`);
  process.stdout.write(execSync(...args));
};
