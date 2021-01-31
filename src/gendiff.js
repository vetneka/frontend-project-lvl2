import fs from 'fs';
import _ from 'lodash';

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
