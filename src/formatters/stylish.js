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

const createPrefix = (depth) => placeholder.repeat((spacesCount * depth) - 2);

const formatNodeValue = (value, depth) => {
  if (!_.isObject(value)) {
    return value;
  }

  const prefix = createPrefix(depth);

  const body = Object
    .keys(value)
    .map((key) => `\n${prefix}${placeholder} ${key}: ${formatNodeValue(value[key], depth + 1)}`)
    .join('');

  return `{${body}\n${createPrefix(depth - 1)}  }`;
};

const getStylishLine = (node, depth) => {
  const {
    key, type, prevValue, nextValue, children,
  } = node;
  const prefix = createPrefix(depth);
  const symbol = getNodeSymbol(type);

  switch (type) {
    case nodeTypes.changed: {
      const symbolRemove = getNodeSymbol(nodeTypes.removed);
      const symbolAdded = getNodeSymbol(nodeTypes.added);

      return [
        `\n${prefix}${symbolRemove} ${key}: ${formatNodeValue(prevValue, depth + 1)}`,
        `\n${prefix}${symbolAdded} ${key}: ${formatNodeValue(nextValue, depth + 1)}`,
      ].join('');
    }
    case nodeTypes.nested: {
      const formattedSubNodes = children
        .map((subNode) => getStylishLine(subNode, depth + 1))
        .join('');

      return `\n${prefix}${symbol} ${key}: {${formattedSubNodes}\n${createPrefix(depth)}  }`;
    }
    default:
      return `\n${prefix}${symbol} ${key}: ${formatNodeValue(prevValue, depth + 1)}`;
  }
};

const formatToStylish = (diff) => {
  const body = diff
    .map((node) => getStylishLine(node, 1))
    .join('');

  return ['{', body, '\n}'].join('');
};

export default formatToStylish;
