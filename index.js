import parseFile from './src/parsers.js';
import getDiffFormatter from './src/formatters/index.js';
import createDiffTree from './src/createDiffTree.js';

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const file1 = parseFile(filepath1);
  const file2 = parseFile(filepath2);

  const diff = createDiffTree(file1, file2);

  const formatter = getDiffFormatter(formatName);
  const formattedDiff = formatter(diff);

  return formattedDiff;
};

export default genDiff;
