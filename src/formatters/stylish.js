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
  const tempIndent = placeholder.repeat(spacesCount * depth);
  const symbolIndex = tempIndent.length - 2;
  const indent = Array.from(
    tempIndent,
    (item, index) => {
      if (index === symbolIndex) {
        return nodeStatusSymbol[type];
      }
      return item;
    },
  );

  return indent.join('');
};

const formatNodeValue = (value, depth) => {
  if (!_.isObject(value)) {
    return value;
  }

  const indent = createIndent(depth);

  const body = Object
    .keys(value)
    .map((key) => `\n${indent} ${key}: ${formatNodeValue(value[key], depth + 1)}`)
    .join('');

  return `{${body}\n${createIndent(depth - 1)} }`;
};

const getStylishLine = (node, depth, formatNodes) => {
  const {
    key, type, prevValue, nextValue, children,
  } = node;
  const indent = createIndent(depth, type);

  switch (type) {
    case nodeTypes.added:
    case nodeTypes.removed:
    case nodeTypes.unchanged:
      return `\n${indent}${key}: ${formatNodeValue(prevValue, depth + 1)}`;

    case nodeTypes.changed: {
      const indentRemove = createIndent(depth, 'removed');
      const indentAdded = createIndent(depth, 'added');

      return [
        `\n${indentRemove}${key}: ${formatNodeValue(prevValue, depth + 1)}`,
        `\n${indentAdded}${key}: ${formatNodeValue(nextValue, depth + 1)}`,
      ].join('');
    }
    case nodeTypes.nested:
      return `\n${indent}${key}: {${formatNodes(children, depth + 1)}\n${indent}}`;

    default:
      throw new Error(`Unexpented node type: ${type}`);
  }
};

const formatToStylish = (diff) => {
  const formatNodes = (nodes, depth) => nodes
    .map((node) => getStylishLine(node, depth, formatNodes))
    .join('');

  return ['{', formatNodes(diff, 1), '\n}'].join('');
};

export default formatToStylish;
