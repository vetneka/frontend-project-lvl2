import _ from 'lodash';
import nodeTypes from './consts.js';
import parseFile from './parsers.js';
import getDiffFormatter from './formatters/index.js';

const createDiffNode = (key, type, prevValue, nextValue, children = null) => {
  const diffNode = {
    key,
    type,
    prevValue,
    nextValue,
    children,
  };

  return diffNode;
};

const createDiff = (obj1, obj2) => {
  const unitedKeys = _.union(Object.keys(obj1), Object.keys(obj2));
  const sortedUnitedKeys = _.sortBy(unitedKeys);

  return sortedUnitedKeys.flatMap((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];

    if (!_.has(obj1, key)) {
      return createDiffNode(key, nodeTypes.added, value2);
    }

    if (!_.has(obj2, key)) {
      return createDiffNode(key, nodeTypes.removed, value1);
    }

    if (value1 === value2) {
      return createDiffNode(key, nodeTypes.unchanged, value1);
    }

    if (!_.isObject(value1) || !_.isObject(value2)) {
      return createDiffNode(key, nodeTypes.changed, value1, value2);
    }

    return createDiffNode(key, nodeTypes.nested, undefined, undefined, createDiff(value1, value2));
  });
};

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const file1 = parseFile(filepath1);
  const file2 = parseFile(filepath2);

  const diff = createDiff(file1, file2);

  const formatter = getDiffFormatter(formatName);
  const formattedDiff = formatter(diff);

  return formattedDiff;
};

export default genDiff;
