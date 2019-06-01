#!/usr/bin/env node

require('@babel/register')({
  cwd: __dirname,
  extensions: ['.ts'],
  ...require('./babel.config'),
});

const run = require('./tools/run').default;
const task = require(`./tools/${process.argv[2]}`).default;

run(task).catch(err => {
  console.error(err.stack);
  process.exit(1);
});

