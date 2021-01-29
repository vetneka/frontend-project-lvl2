#!/usr/bin/env node

import commander from 'commander';

const VERSION = '1.0.0';
const DESCRIPTION = 'Compares two configuration files and shows a difference.';

const { program } = commander;

program
  .version(VERSION)
  .description(DESCRIPTION)
  .helpOption('-h, --help', 'output usage information');

program.parse();
