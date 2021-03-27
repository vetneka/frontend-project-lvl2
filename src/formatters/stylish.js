import _ from 'lodash';
import nodeTypes from '../consts.js';

const spacesCount = 4;
const placeholder = ' ';

const getNodeSymbol = (type) => {
  switch (type) {
    case nodeTypes.added:
      return '+';

    case nodeTypes.removed:
      return '-';

    default:
      return placeholder;
  }
};

const createPrefix = (depth) => {
  const reservedSpaceForSymbol = 2;
  return placeholder.repeat((spacesCount * depth) - reservedSpaceForSymbol);
};

const formatNodeValue = (value, depth) => {
  if (!_.isObject(value)) {
    return value;
  }

  const prefix = createPrefix(depth);

  const body = Object
    .keys(value)
    .map((key) => `${prefix}${placeholder} ${key}: ${formatNodeValue(value[key], depth + 1)}`)
    .join('\n');

  return `{\n${body}\n${createPrefix(depth - 1)}  }`;
};

const getStylishLine = (node, depth) => {
  const {
    key, type, prevValue, nextValue, children,
  } = node;
  const prefix = createPrefix(depth);
  const symbol = getNodeSymbol(type);

  switch (type) {
    case nodeTypes.added:
    case nodeTypes.removed:
    case nodeTypes.unchanged:
      return `${prefix}${symbol} ${key}: ${formatNodeValue(prevValue, depth + 1)}`;

    case nodeTypes.changed: {
      const symbolRemove = getNodeSymbol(nodeTypes.removed);
      const symbolAdded = getNodeSymbol(nodeTypes.added);

      return [
        `${prefix}${symbolRemove} ${key}: ${formatNodeValue(prevValue, depth + 1)}`,
        `${prefix}${symbolAdded} ${key}: ${formatNodeValue(nextValue, depth + 1)}`,
      ].join('\n');
    }
    case nodeTypes.nested: {
      const formattedSubNodes = children
        .map((subNode) => getStylishLine(subNode, depth + 1))
        .join('\n');

      return `${prefix}${symbol} ${key}: {\n${formattedSubNodes}\n${createPrefix(depth)}  }`;
    }
    default:
      throw new Error(`Unexpected node type: ${type}.`);
  }
};

const formatStylish = (diff) => {
  const lines = diff.map((node) => getStylishLine(node, 1));

  return ['{', ...lines, '}'];
};

export default (diff) => formatStylish(diff).join('\n');
