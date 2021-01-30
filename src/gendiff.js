import fs from 'fs';
import _ from 'lodash';

const createDiff = (obj1, obj2) => {
  const STATE_TYPES = {
    add: '+',
    delete: '-',
    unchange: ' ',
  };

  const unionKeys = _.union(Object.keys(obj1), Object.keys(obj2));
  const sortedUnionKeys = unionKeys.sort();

  const diff = sortedUnionKeys
    .map((key) => {
      if (!_.has(obj1, key)) {
        return `  ${STATE_TYPES.add} ${key}: ${obj2[key]}`;
      }
      if (!_.has(obj2, key)) {
        return `  ${STATE_TYPES.delete} ${key}: ${obj1[key]}`;
      }
      if (obj1[key] === obj2[key]) {
        return `  ${STATE_TYPES.unchange} ${key}: ${obj1[key]}`;
      }
      return [
        `  ${STATE_TYPES.delete} ${key}: ${obj1[key]}`,
        `  ${STATE_TYPES.add} ${key}: ${obj2[key]}`,
      ].join('\n');
    });

  return diff;
};

const formatDiffForOutput = (diff) => {
  const formattedDiff = diff.join('\n');

  return [
    '{',
    formattedDiff,
    '}',
  ].join('\n');
};

const genDiff = (filepath1, filepath2) => {
  const ENCODING_TYPE = 'utf-8';

  const contentFile1 = fs.readFileSync(filepath1, { encoding: ENCODING_TYPE });
  const contentFile2 = fs.readFileSync(filepath2, { encoding: ENCODING_TYPE });

  const obj1 = JSON.parse(contentFile1);
  const obj2 = JSON.parse(contentFile2);

  const diff = createDiff(obj1, obj2);
  const formattedDiff = formatDiffForOutput(diff);

  return formattedDiff;
};

export default genDiff;
