import _ from 'lodash';
import nodeTypes from '../consts.js';

const nodeStatusSymbol = {
  added: '+',
  removed: '-',
  unchanged: ' ',
  changed: ' ',
  nested: ' ',
};

const spacesCount = 4;
const placeholder = ' ';

const createIndent = (depth, type = nodeStatusSymbol.unchanged) => {
  const indentSize = spacesCount * depth;
  const indent = new Array(indentSize).fill(placeholder);

  const symbolIndex = indent.length - 2;
  indent[symbolIndex] = nodeStatusSymbol[type];

  return indent.join('');
};

const stringify = (value, depth) => {
  if (!_.isObject(value)) {
    return value;
  }

  const indent = createIndent(depth);

  const body = Object
    .keys(value)
    .map((key) => `\n${indent} ${key}: ${stringify(value[key], depth + 1)}`)
    .join('');

  return `{${body}\n${createIndent(depth - 1)} }`;
};

const getStylishLine = (node, depth, callback) => {
  const {
    key, type, prevValue, nextValue, childrens,
  } = node;
  const indent = createIndent(depth, type);

  switch (type) {
    case nodeTypes.added:
    case nodeTypes.removed:
    case nodeTypes.unchanged:
      return `\n${indent}${key}: ${stringify(prevValue, depth + 1)}`;

    case nodeTypes.changed: {
      const indentRemove = createIndent(depth, 'removed');
      const indentAdded = createIndent(depth, 'added');

      return [
        `\n${indentRemove}${key}: ${stringify(prevValue, depth + 1)}`,
        `\n${indentAdded}${key}: ${stringify(nextValue, depth + 1)}`,
      ].join('');
    }
    case nodeTypes.nested:
      return `\n${indent}${key}: {${callback(childrens, depth + 1)}\n${indent}}`;

    default:
      throw new Error(`Unexpented node type: ${type}`);
  }
};

const formatToStylish = (diff) => {
  const iter = (nodes, depth) => nodes
    .map((node) => getStylishLine(node, depth, iter))
    .join('');

  return ['{', iter(diff, 1), '\n}'].join('');
};

export default formatToStylish;
