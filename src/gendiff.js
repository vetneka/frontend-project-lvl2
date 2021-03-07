import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import nodeTypes from './consts.js';
import getFileParser from './parsers.js';
import getDiffFormatter from './formatters/index.js';

const createDiffNode = (key, type, prevValue, nextValue, childrens = null) => {
  const diffNode = {
    key,
    type,
    prevValue,
    nextValue,
    childrens,
  };

  return diffNode;
};

const createDiff = (obj1, obj2) => {
  const unionKeys = _.union(Object.keys(obj1), Object.keys(obj2));
  const sortedUnionKeys = unionKeys.sort();

  return sortedUnionKeys.flatMap((key) => {
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

const readFile = (filepath) => {
  const fullFilepath = path.resolve(process.cwd(), filepath);
  const data = fs.readFileSync(fullFilepath).toString();
  return data;
};

const getFIleExtension = (filepath) => path.extname(filepath).slice(1);

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const fileExtension1 = getFIleExtension(filepath1);
  const fileExtension2 = getFIleExtension(filepath2);

  const data1 = readFile(filepath1);
  const data2 = readFile(filepath2);

  const parseFile1 = getFileParser(fileExtension1);
  const parseFile2 = getFileParser(fileExtension2);

  const obj1 = parseFile1(data1);
  const obj2 = parseFile2(data2);

  const deepDiff = createDiff(obj1, obj2);

  const formatDiff = getDiffFormatter(formatName);
  const formattedDiff = formatDiff(deepDiff);

  return formattedDiff;
};

export default genDiff;
