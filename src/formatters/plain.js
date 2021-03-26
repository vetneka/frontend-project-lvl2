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

const getPlainLine = (node, path) => {
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
      return children
        .flatMap((child) => getPlainLine(child, [...path, key]));

    case nodeTypes.unchanged:
      return '';

    default:
      throw new Error(`Unexpected node type: ${type}.`);
  }
};

const formatPlain = (diff) => diff
  .flatMap((node) => getPlainLine(node, []))
  .filter((node) => node);

export default (diff) => formatPlain(diff).join('\n');
