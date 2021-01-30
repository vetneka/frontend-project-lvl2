#!/usr/bin/env node

import commander from 'commander';

const VERSION = '1.0.0';
const DESCRIPTION = 'Compares two configuration files and shows a difference.';

const { program } = commander;

program
  .version(VERSION)
  .description(DESCRIPTION)
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format');

program.parse(process.argv);
