#!/usr/bin/env node

import commander from 'commander';
import genDiff from '../index.js';

const VERSION = '1.0.0';
const DESCRIPTION = 'Compares two configuration files and shows a difference.';

const { program } = commander;

program
  .version(VERSION)
  .description(DESCRIPTION)
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format', 'stylish')
  .action((filepath1, filepath2) => {
    const formatName = program.opts().format;
    const diff = genDiff(filepath1, filepath2, formatName);
    console.log(diff);
  });

program.parse(process.argv);
