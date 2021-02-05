import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import getFileParser from './parsers.js';

const DIFF_NODE_STATUS = {
  added: 'added',
  removed: 'removed',
  unchanged: 'unchanged',
};

const createDiffNode = (name, status, value) => {
  const diffNode = {
    name,
    status,
    value,
  };

  if (_.isArray(value)) {
    diffNode.type = 'array';
  } else if (_.isObject(value)) {
    diffNode.type = 'object';
  } else {
    diffNode.type = 'primitive';
  }

  return diffNode;
};

const createDeepDiff = (obj1 = {}, obj2 = {}) => {
  const unionKeys = _.union(Object.keys(obj1), Object.keys(obj2));
  const sortedUnionKeys = unionKeys.sort();

  return sortedUnionKeys.flatMap((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];

    if (!_.has(obj1, key)) {
      return createDiffNode(key, DIFF_NODE_STATUS.added, value2);
    }

    if (!_.has(obj2, key)) {
      return createDiffNode(key, DIFF_NODE_STATUS.removed, value1);
    }

    if (value1 === value2) {
      return createDiffNode(key, DIFF_NODE_STATUS.unchanged, value1);
    }

    if (!_.isObject(value1) || !_.isObject(value2)) {
      return [
        createDiffNode(key, DIFF_NODE_STATUS.removed, value1),
        createDiffNode(key, DIFF_NODE_STATUS.added, value2),
      ];
    }

    return createDiffNode(key, DIFF_NODE_STATUS.unchanged, createDeepDiff(value1, value2));
  });
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

  const deepDiff = createDeepDiff(obj1, obj2);

  return deepDiff;
};

export default genDiff;
