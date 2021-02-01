import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import getFileParser from './parsers.js';

const DIFF_CHANGE_STATES = {
  add: '+',
  delete: '-',
  unchange: ' ',
};

const createDiff = (obj1, obj2) => {
  const unionKeys = _.union(Object.keys(obj1), Object.keys(obj2));
  const sortedUnionKeys = unionKeys.sort();

  const diff = [];

  sortedUnionKeys.forEach((key) => {
    if (!_.has(obj1, key)) {
      diff.push(`${DIFF_CHANGE_STATES.add} ${key}: ${obj2[key]}`);
    } else if (!_.has(obj2, key)) {
      diff.push(`${DIFF_CHANGE_STATES.delete} ${key}: ${obj1[key]}`);
    } else if (obj1[key] === obj2[key]) {
      diff.push(`${DIFF_CHANGE_STATES.unchange} ${key}: ${obj1[key]}`);
    } else {
      diff.push(`${DIFF_CHANGE_STATES.delete} ${key}: ${obj1[key]}`);
      diff.push(`${DIFF_CHANGE_STATES.add} ${key}: ${obj2[key]}`);
    }
  });

  return diff;
};

const formatDiffForOutput = (diff) => {
  const marginLeft = '  ';

  const formattedDiff = diff
    .map((line) => `${marginLeft}${line}`)
    .join('\n');

  return [
    '{',
    formattedDiff,
    '}',
  ].join('\n');
};

const readFile = (filepath) => {
  const fullFilepath = path.resolve(process.cwd(), filepath);
  const data = fs.readFileSync(fullFilepath).toString();
  return data;
};

const getFIleExtension = (filepath) => path.extname(filepath).slice(1);

const genDiff = (filepath1, filepath2) => {
  const fileExtension1 = getFIleExtension(filepath1);
  const fileExtension2 = getFIleExtension(filepath2);

  if (fileExtension1 !== fileExtension2) {
    throw new Error(`Files extensions should be equal! But now file1 extension = ${fileExtension1}, file2 extension = ${fileExtension2}`);
  }

  const data1 = readFile(filepath1);
  const data2 = readFile(filepath2);

  const parseFile = getFileParser(fileExtension1);

  const obj1 = parseFile(data1);
  const obj2 = parseFile(data2);

  const diff = createDiff(obj1, obj2);
  const formattedDiff = formatDiffForOutput(diff);

  return formattedDiff;
};

export default genDiff;
