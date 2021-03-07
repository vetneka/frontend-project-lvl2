import _ from 'lodash';
import nodeTypes from '../consts.js';

const stringify = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  return `${(_.isString(value)) ? `'${value}'` : value}`;
};

const getPlainLine = (node, path, callback) => {
  const {
    key, type, prevValue, nextValue, childrens,
  } = node;
  const currentPath = [...path, key].join('.');

  switch (type) {
    case nodeTypes.added:
      return `Property '${currentPath}' was added with value: ${stringify(prevValue)}`;

    case nodeTypes.removed:
      return `Property '${currentPath}' was removed`;

    case nodeTypes.changed:
      return `Property '${currentPath}' was updated. From ${stringify(prevValue)} to ${stringify(nextValue)}`;

    case nodeTypes.nested:
      return callback(childrens, [...path, key]);

    default:
      return '';
  }
};

const formatToPlain = (diff) => {
  const iter = (nodes, path) => nodes.flatMap((node) => getPlainLine(node, path, iter));

  return iter(diff, []).filter((node) => node).join('\n');
};

export default formatToPlain;
