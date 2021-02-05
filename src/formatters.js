import _ from 'lodash';

const formatToStylish = (diff) => {
  const DIFF_NODE_STATUS_SYMBOL = {
    added: '+',
    removed: '-',
    unchanged: ' ',
  };

  const SPACES_COUNT = 4;
  const REPLACER = ' ';

  const iter = (node, depth) => {
    const currentValue = node;

    if (!_.isObject(currentValue)) {
      return currentValue;
    }

    const indentSize = SPACES_COUNT * depth;
    const bracketIndent = REPLACER.repeat(indentSize - SPACES_COUNT);

    const lines = (_.isArray(currentValue))
      ? currentValue
        .map((child) => {
          const currentStatusSymbol = DIFF_NODE_STATUS_SYMBOL[child.status];
          const currentIndent = `${REPLACER.repeat(indentSize - 2)}${currentStatusSymbol}${REPLACER}`;
          return `${currentIndent}${child.name}: ${iter(child.value, depth + 1)}`;
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

const getDiffFormatter = (formatName) => {
  switch (formatName) {
    case 'stylish':
      return formatToStylish;

    default:
      throw new Error(`Unexpected format ${formatName}.`);
  }
};

export default getDiffFormatter;
