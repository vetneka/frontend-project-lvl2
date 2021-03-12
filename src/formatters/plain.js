import _ from 'lodash';
import nodeTypes from '../consts.js';

const formatNodeValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }

  if (_.isString(value)) {
    return `'${value}'`;
  }

  return value;
};

const getPlainLine = (node, path, formatNodes) => {
  const {
    key, type, prevValue, nextValue, children,
  } = node;
  const currentPath = [...path, key].join('.');

  switch (type) {
    case nodeTypes.added:
      return `Property '${currentPath}' was added with value: ${formatNodeValue(prevValue)}`;

    case nodeTypes.removed:
      return `Property '${currentPath}' was removed`;

    case nodeTypes.changed:
      return `Property '${currentPath}' was updated. From ${formatNodeValue(prevValue)} to ${formatNodeValue(nextValue)}`;

    case nodeTypes.nested:
      return formatNodes(children, [...path, key]);

    default:
      return '';
  }
};

const plainFormatter = (diff) => {
  const formatNodes = (nodes, path) => nodes
    .flatMap((node) => getPlainLine(node, path, formatNodes));

  return formatNodes(diff, [])
    .filter((node) => node)
    .join('\n');
};

export default plainFormatter;
