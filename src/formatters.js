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

const getDiffFormatter = (formatName) => {
  switch (formatName) {
    case 'stylish':
      return formatToStylish;

    default:
      throw new Error(`Unexpected format ${formatName}.`);
  }
};

export default getDiffFormatter;
