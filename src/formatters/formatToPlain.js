import _ from 'lodash';

const messages = [
  {
    name: 'added',
    create: (path, status, currentValue) => `Property '${path}' was ${status} with value: ${currentValue}`,
  },
  {
    name: 'removed',
    create: (path, status) => `Property '${path}' was ${status}`,
  },
  {
    name: 'updated',
    create: (path, status, currentValue, previewValue) => `Property '${path}' was ${status}. From ${previewValue} to ${currentValue}`,
  },
];

const getNodeMessage = (node) => messages.find((message) => message.name === node.status);

const formatToPlain = (diff) => {
  const iter = (node, fullPath) => {
    if (_.isArray(node)) {
      return node
        .map((child) => iter(child, [...fullPath, child.name]))
        .join('\n');
    }

    const { previewValue, currentValue } = node;

    if (node.status === 'unchanged' && _.isObject(currentValue)) {
      return currentValue
        .map((child) => iter(child, [...fullPath, child.name]))
        .filter((child) => child)
        .join('\n');
    }

    if (node.status !== 'unchanged') {
      const { name, create } = getNodeMessage(node);

      let prevValue;
      let curValue;

      if (_.isObject(previewValue)) {
        prevValue = '[complex value]';
      } else if (typeof previewValue === 'string') {
        prevValue = `'${previewValue}'`;
      } else {
        prevValue = previewValue;
      }

      if (_.isObject(currentValue)) {
        curValue = '[complex value]';
      } else if (typeof currentValue === 'string') {
        curValue = `'${currentValue}'`;
      } else {
        curValue = currentValue;
      }

      const message = create(fullPath.join('.'), name, curValue, prevValue);

      return message;
    }

    return '';
  };

  return iter(diff, []);
};

export default formatToPlain;
