#!/usr/bin/env node

require('@babel/register')({
  cwd: __dirname,
  extensions: ['.ts'],
  ...require('../babel.config'),
});

const verifyCWD = require('./lib/verify-cwd').default;
verifyCWD();

const run = require('./run').default;
const task = require(`./${process.argv[2]}`).default;

run(task).catch(err => {
  console.error(err.stack);
  process.exit(1);
});

