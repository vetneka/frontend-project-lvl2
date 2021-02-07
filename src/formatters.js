import _ from 'lodash';

const formatToStylish = (diff) => {
  const DIFF_NODE_STATUS_SYMBOL = {
    added: '+',
    removed: '-',
    unchanged: ' ',
    updated: ' ',
  };

  const SPACES_COUNT = 4;
  const REPLACER = ' ';

  const iter = (node, depth) => {
    const currentValue = node;

    const indentSize = SPACES_COUNT * depth;
    const bracketIndent = REPLACER.repeat(indentSize - SPACES_COUNT);

    if (!_.isObject(currentValue)) {
      return currentValue;
    }

    const lines = (_.isArray(currentValue))
      ? currentValue.map((child) => {
        const currentStatusSymbol = DIFF_NODE_STATUS_SYMBOL[child.status];
        const currentIndent = `${REPLACER.repeat(indentSize - 2)}${currentStatusSymbol}${REPLACER}`;

        if (child.status === 'updated') {
          const currentIndentForRemove = `${REPLACER.repeat(indentSize - 2)}${DIFF_NODE_STATUS_SYMBOL.removed}${REPLACER}`;
          const currentIndentForAdded = `${REPLACER.repeat(indentSize - 2)}${DIFF_NODE_STATUS_SYMBOL.added}${REPLACER}`;
          return `${currentIndentForRemove}${child.name}: ${iter(child.previewValue, depth + 1)}\n${currentIndentForAdded}${child.name}: ${iter(child.currentValue, depth + 1)}`;
        }

        return `${currentIndent}${child.name}: ${iter(child.currentValue, depth + 1)}`;
      })
      : Object.entries(currentValue)
        .map(([key, value]) => {
          const currentIndent = REPLACER.repeat(indentSize);
          return `${currentIndent}${key}: ${iter(value, depth + 1)}`;
        });

    return [
      '{',
      ...lines,
      `${bracketIndent}}`,
    ].join('\n');
  };

  return iter(diff, 1);
};

const formatToPlain = (diff) => {
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

const getDiffFormatter = (formatName) => {
  switch (formatName) {
    case 'stylish':
      return formatToStylish;

    case 'plain':
      return formatToPlain;

    default:
      throw new Error(`Unexpected format ${formatName}.`);
  }
};

export default getDiffFormatter;
